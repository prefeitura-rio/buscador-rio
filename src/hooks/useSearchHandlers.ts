import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { SearchResultItem } from "@/types";
import { useReCaptcha } from "./useReCaptcha";

export const useSearchHandlers = () => {
  const router = useRouter();
  const { getReCaptchaToken } = useReCaptcha();

  // Function to determine the device type
  const getTipoDispositivo = () => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/mobile|android|touch|webos|hpwos/i.test(userAgent)) {
        return "Mobile";
      }
      return "Desktop";
    }
    return "Unknown";
  };

  // Function to determine the portal origin
  const getPortalOrigem = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.includes("1746")) {
        return "1746";
      } else if (hostname.includes("prefeitura")) {
        return "Prefeitura Rio";
      } else if (hostname.includes("buscador")) {
        return "Buscador Rio";
      }
    }
    return "Unknown";
  };

  const handleSubmitSearch = async (query: string) => {
    if (query.trim()) {
      const cookies = parseCookies();
      const session_id = cookies.session_id;
      const portal_origem = getPortalOrigem();
      const tipo_dispositivo = getTipoDispositivo();

      // Get reCAPTCHA token
      const recaptchaToken = await getReCaptchaToken();

      try {
        const response = await fetch("/api/metrics/busca", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(recaptchaToken ? { "X-Recaptcha-Token": recaptchaToken } : {}),
          },
          body: JSON.stringify({
            session_id,
            query,
            portal_origem,
            tipo_dispositivo,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to log search metrics");
        }

        router.push(`/search-result?q=${encodeURIComponent(query.trim())}`);
      } catch (error) {
        console.error("Error logging search metrics:", error);
        router.push(`/search-result?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleItemClick = async (
    item: SearchResultItem,
    index: number,
    query: string,
    noticias_toggled: boolean
  ) => {
    const cookies = parseCookies();
    const session_id = cookies.session_id;
    const link = item.url;
    const portal_origem = getPortalOrigem();
    const tipo_dispositivo = getTipoDispositivo();

    // Get reCAPTCHA token
    const recaptchaToken = await getReCaptchaToken();
    try {
      const response = await fetch("/api/metrics/clique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(recaptchaToken ? { "X-Recaptcha-Token": recaptchaToken } : {}),
        },
        body: JSON.stringify({
          session_id,
          query,
          posicao: index,
          objeto_clicado: item,
          portal_origem,
          tipo_dispositivo,
          noticias_toggled,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to log click metrics");
      }
    } catch (error) {
      console.error("Error logging click metrics:", error);
    }

    if (link) {
      window.open(link, "_blank");
    }
  };

  const handleSearchApi = async (
    query: string
  ): Promise<SearchResultItem[]> => {
    if (!query.trim() || query.trim().length <= 2) {
      return [];
    }

    const recaptchaToken = await getReCaptchaToken();

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            ...(recaptchaToken ? { "X-Recaptcha-Token": recaptchaToken } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error("Error fetching search results:", error);
      throw error;
    }
  };

  return { handleSubmitSearch, handleItemClick, handleSearchApi };
};
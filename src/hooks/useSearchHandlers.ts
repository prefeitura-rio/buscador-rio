import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { SearchResultItem } from "@/types";
import { useReCaptcha } from "./useReCaptcha";
import { useCallback } from "react";

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


  const handleSubmitSearch = async (query: string) => {
    if (query.trim()) {
      const cookies = parseCookies();
      const session_id = cookies.session_id;
      const portal_origem = "Buscador Rio"
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
    const portal_origem = "Buscador Rio";
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
     window.location.href = link;
   }

  };

  const handleSearchApi = useCallback(
    async (query: string, llm_reorder: boolean): Promise<SearchResultItem[]> => {
      if (!query.trim() || query.trim().length <= 2) {
        return [];
      }

      const recaptchaToken = await getReCaptchaToken();

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&llm_reorder=${llm_reorder}`, // Include llm_reorder in the query string
          {
            headers: {
              ...(recaptchaToken
                ? { "X-Recaptcha-Token": recaptchaToken }
                : {}),
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
    },
    [getReCaptchaToken]
  );

  return { handleSubmitSearch, handleItemClick, handleSearchApi };
};

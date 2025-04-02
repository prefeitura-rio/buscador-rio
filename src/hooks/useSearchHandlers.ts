import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { SearchResultItem } from "@/types";

export const useSearchHandlers = () => {
  const router = useRouter();

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

      await fetch("/api/metrics/busca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id,
          query,
          portal_origem,
          tipo_dispositivo,
        }),
      });
      router.push(`/search-result?q=${encodeURIComponent(query.trim())}`);
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

    await fetch("/api/metrics/clique", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    if (link) {
      window.open(link, "_blank");
    }
  };

  return { handleSubmitSearch, handleItemClick };
};

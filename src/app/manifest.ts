import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Buscador Rio",
    short_name: "Buscador",
    description: "Fale com a gente! Como podemos ajudar?",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/vercel.svg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/vercel.svg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

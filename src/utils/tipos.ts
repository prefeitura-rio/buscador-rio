export const displayTipo = (tipo: string | undefined) => {
  switch (tipo) {
    case "noticia":
      return "Notícia";
    case "informacao":
      return "Informação";
    case "servico":
      return "Serviço";
    default:
      return tipo;
  }
};

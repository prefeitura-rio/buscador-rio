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

export const displayBreadCrumbCollection = (tipo: string | undefined) => {
  switch (tipo) {
    case "1746":
      return "1746";
    case "carioca-digital":
      return "carioca digital";
    case "pref-rio":
      return "prefeitura rio";
    default:
      return tipo;
  }
}

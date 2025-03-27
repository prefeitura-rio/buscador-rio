// Add a function or inline logic to map the 'tipo' to the desired display value
export const displayTipo = (tipo: string | undefined) => {
  switch (tipo) {
    case "noticia":
      return "Notícia";
    case "informacao":
      return "Informação";
    case "servico":
      return "Serviço";
    default:
      return tipo; // Fallback to the original value if no match
  }
};

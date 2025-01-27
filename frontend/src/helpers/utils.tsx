export const getCrimeName = (crime: string) => {
  let finalName = "";

  switch (crime) {
    case "omicidio":
      finalName = "Murder";
      break;
    case "omicidio_colposo":
      finalName = "Manslaughter";
      break;
    case "omicidio_stradale":
      finalName = "Road homicide";
      break;
    case "tentato_omicidio":
      finalName = "Attempted murder";
      break;
    case "furto":
      finalName = "Theft";
      break;
    case "rapina":
      finalName = "Robbery";
      break;
    case "violenza_sessuale":
      finalName = "Sexual violence";
      break;
    case "aggressione":
      finalName = "Assault";
      break;
    case "spaccio":
      finalName = "Drug trafficking";
      break;
    case "truffa":
      finalName = "Fraud";
      break;
    case "estorsione":
      finalName = "Extortion";
      break;
    case "contrabbando":
      finalName = "Smuggling";
      break;
    case "associazione_di_tipo_mafioso":
      finalName = "Mafia-type association";
      break;
    default:
      finalName = "Unknown crime";
      break;
  }

  return finalName;
};

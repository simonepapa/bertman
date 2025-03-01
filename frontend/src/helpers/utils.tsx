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

export const colorizeSquare = (index: number, palette: string) => {
  let colors: string[] = [];

  if (palette === "red") {
    colors = [
      "#7f0000",
      "#b30000",
      "#d7301f",
      "#ef6548",
      "#fc8d59",
      "#fdbb84",
      "#fdd49e",
      "#fee8c8",
      "#fff7ec"
    ];
  } else if (palette === "blue") {
    colors = [
      "#023858",
      "#045a8d",
      "#0570b0",
      "#3690c0",
      "#74a9cf",
      "#a6bddb",
      "#d0d1e6",
      "#ece7f2",
      "#fff7fb"
    ];
  } else if (palette === "green") {
    colors = [
      "#00441b",
      "#006d2c",
      "#238b45",
      "#41ae76",
      "#66c2a4",
      "#99d8c9",
      "#ccece6",
      "#e5f5f9",
      "#f7fcfd"
    ];
  }

  return colors[index];
};

export const getQuartiereName = (label: string) => {
  const names: { [key: string]: string } = {
    "bari-vecchia_san-nicola": "Bari Vecchia - San Nicola",
    carbonara: "Carbonara",
    carrassi: "Carrassi",
    "ceglie-del-campo": "Ceglie del Campo",
    japigia: "Japigia",
    liberta: "Libertà",
    loseto: "Loseto",
    madonnella: "Madonnella",
    murat: "Murat",
    "palese-macchie": "Palese - Macchie",
    picone: "Picone",
    "san-girolamo_fesca": "San Girolamo - Fesca",
    "san-paolo": "San Paolo",
    "san-pasquale": "San Pasquale",
    "santo-spirito": "Santo Spirito",
    stanic: "Stanic",
    "torre-a-mare": "Torre a mare"
  };

  return names[label];
};

export const getQuartiereIndex = (label: string) => {
  const names: { [key: string]: string } = {
    "Bari Vecchia - San Nicola": "bari-vecchia_san-nicola",
    Carbonara: "carbonara",
    Carrassi: "carrassi",
    "Ceglie del Campo": "ceglie-del-campo",
    Japigia: "japigia",
    Libertà: "liberta",
    Loseto: "loseto",
    Madonnella: "madonnella",
    Murat: "murat",
    "Palese - Macchie": "palese-macchie",
    Picone: "picone",
    "San Girolamo - Fesca": "san-girolamo_fesca",
    "San Paolo": "san-paolo",
    "San Pasquale": "san-pasquale",
    "Santo Spirito": "santo-spirito",
    Stanic: "stanic",
    "Torre a mare": "torre-a-mare"
  };

  return names[label];
};

type Crime = {
  crime: string;
  index: number | string;
  frequency: number;
};

type InfoQuartiere = {
  name: string;
  crime_index: number | null;
  total_crimes: number | null;
  population: number;
  crimes: Crime[];
  weights?: { [key: string]: string };
};

type Article = {
  aggressione: number;
  aggressione_prob: number;
  associazione_di_tipo_mafioso: number;
  associazione_di_tipo_mafioso_prob: number;
  content: string;
  contrabbando: number;
  contrabbando_prob: number;
  date: string;
  estorsione: number;
  estorsione_prob: number;
  furto: number;
  furto_prob: number;
  id: number;
  link: string;
  omicidio: number;
  omicidio_colposo: number;
  omicidio_colposo_prob: number;
  omicidio_prob: number;
  omicidio_stradale: number;
  omicidio_stradale_prob: number;
  quartiere: string;
  rapina: number;
  rapina_prob: number;
  spaccio: number;
  spaccio_prob: number;
  tentato_omicidio: number;
  tentato_omicidio_prob: number;
  title: string;
  truffa: number;
  truffa_prob: number;
  violenza_sessuale: number;
  violenza_sessuale_prob: number;
};

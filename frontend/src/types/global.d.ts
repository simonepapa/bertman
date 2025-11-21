import { TreeViewBaseItem } from "@mui/x-tree-view/models";

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
  weights?: { [key: string]: boolean };
  minmax: boolean;
};

type Article = {
  id: number;
  link: string;
  title: string;
  content: string;
  date: string;
  aggressione?: number;
  aggressione_prob?: number;
  associazione_di_tipo_mafioso?: number;
  associazione_di_tipo_mafioso_prob?: number;
  contrabbando?: number;
  contrabbando_prob?: number;
  estorsione?: number;
  estorsione_prob?: number;
  furto?: number;
  furto_prob?: number;
  omicidio?: number;
  omicidio_colposo?: number;
  omicidio_colposo_prob?: number;
  omicidio_prob?: number;
  omicidio_stradale?: number;
  omicidio_stradale_prob?: number;
  quartiere?: string;
  rapina?: number;
  rapina_prob?: number;
  spaccio?: number;
  spaccio_prob?: number;
  tentato_omicidio?: number;
  tentato_omicidio_prob?: number;
  truffa?: number;
  truffa_prob?: number;
  violenza_sessuale?: number;
  violenza_sessuale_prob?: number;
  [key: string]: number;
};

type LabeledArticle = {
  link: string;
  title: string;
  content: string;
  date: string;
  [key: string]: {
    prob: number;
    value: number;
  };
};

interface CustomTreeItem extends TreeViewBaseItem {
  url?: string;
  date?: string;
  children?: {
    id: string;
    label: string;
    url?: string;
    date?: string;
    isLastChild?: boolean;
    children?: CustomTreeItem[];
  }[];
}

type Filters = {
  crimes: {
    [key: string]: number;
  };
  quartieri: {
    [key: string]: number;
  };
  weights: {
    [key: string]: number;
  };
  scaling: {
    [key: string]: number;
  };
  dates: {
    [key: string]: Date | null;
  };
};

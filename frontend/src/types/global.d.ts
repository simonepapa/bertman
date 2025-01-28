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

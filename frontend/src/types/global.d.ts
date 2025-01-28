type Crime = {
  crime: string;
  index: number;
  frequency: number;
};

type InfoQuartiere = {
  name: string;
  crime_index: number | null;
  total_crimes: number | null;
  crimes: Crime[];
};

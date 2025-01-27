type InfoQuartiere = {
  name: string;
  crime_index: number | null;
  total_crimes: number | null;
  crimes: {
    crime: string;
    index: number;
    frequency: number;
  }[];
};

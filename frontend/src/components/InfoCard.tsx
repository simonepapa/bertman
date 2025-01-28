import { getCrimeName } from "../helpers/utils";
import { Chip, Divider } from "@mui/material";

type Props = {
  name: string;
  crime_index: number | null;
  crimes: Crime[];
  weights: {
    [key: string]: number;
  };
};

function InfoCard({ name, crime_index, crimes, weights }: Props) {
  return (
    <div className="info-card">
      {Object.keys(weights).some((weight: string) => weights[weight] === 1) && (
        <div className="mb-2 flex flex-wrap gap-2">
          <p className="text-base font-bold">Weights on:</p>
          {weights.num_of_articles === 1 && (
            <Chip color="primary" label="NO. OF ARTICLES" size="small" />
          )}
        </div>
      )}
      <h3 className="text-lg font-bold">{name || "Neighborhood"}</h3>
      <p>
        Crime index: {crime_index}
        <span className="text-text-secondary text-sm">
          {" "}
          -{" "}
          {crimes.reduce(
            (acc: number, crime: Crime) => acc + crime.frequency,
            0
          )}{" "}
          cases
        </span>
      </p>
      <Divider className="!my-2" />
      <div className="flex gap-2 overflow-auto !p-0 xl:flex-col">
        {Object.keys(crimes).map((crime: string, index: number) => (
          <div className="flex flex-col gap-0">
            <p className="text-text-primary text-base font-medium">
              {getCrimeName(crimes[index].crime)}
            </p>
            <p className="text-text-secondary text-sm">
              <span className="font-medium">Index: {crimes[index].index}</span>{" "}
              - {crimes[index].frequency} cases
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default InfoCard;

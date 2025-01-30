import { getCrimeName } from "../helpers/utils";
import { Crime } from "../types/global";
import { Chip, Divider } from "@mui/material";

type Props = {
  name: string;
  crime_index: number | null;
  population: number;
  crimes: Crime[];
  weights: { [key: string]: string } | null;
};

function InfoCard({ name, crime_index, population, crimes, weights }: Props) {
  const numberOfCrimes = crimes.reduce(
    (acc: number, crime: Crime) => acc + crime.frequency,
    0
  );

  return (
    <div className="info-card">
      {weights &&
        Object.keys(weights).some(
          (weight: string) => weights[weight] === "true"
        ) && (
          <div className="mb-2 flex flex-wrap gap-2">
            <p className="text-base font-bold">Weights on:</p>
            {weights.num_of_articles === "true" && (
              <Chip color="primary" label="NO. OF ARTICLES" size="small" />
            )}
            {weights.num_of_people === "true" && (
              <Chip color="primary" label="NO. OF PEOPLE" size="small" />
            )}
          </div>
        )}
      <h3 className="text-lg font-bold">{name || "Neighborhood"}</h3>
      <p>
        Crime index: {crime_index}
        <span className="text-text-secondary text-sm">
          {" "}
          - {population.toLocaleString("it-IT")} people
        </span>
      </p>
      <p className="text-text-secondary text-sm">
        {numberOfCrimes} cases,{" "}
        {!isNaN(Math.round((numberOfCrimes / population) * 1000))
          ? Math.round((numberOfCrimes / population) * 1000)
          : 0}{" "}
        crimes per 1000 people
      </p>
      <Divider className="!my-2" />
      <div className="flex gap-2 overflow-auto !p-0 xl:flex-col">
        {Object.keys(crimes).map((crime: string, index: number) => (
          <div className="flex flex-col gap-0" key={index}>
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

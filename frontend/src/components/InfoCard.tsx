import { getCrimeName } from "../helpers/utils";
import { Divider } from "@mui/material";

type Props = {
  name: string;
  crime_index: number | null;
  crimes: Crime[];
};

function InfoCard({ name, crime_index, crimes }: Props) {
  return (
    <div className="info-card">
      <h3 className="font-bold">{name}</h3>
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

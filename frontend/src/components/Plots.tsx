import { getCrimeName, getQuartiereIndex } from "../helpers/utils";
import { CustomTreeItem } from "../types/global";
import { Card, Chip } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { Feature, GeoJsonObject } from "geojson";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  data: GeoJsonObject | null;
  weights: { [key: string]: string } | null;
  articles: CustomTreeItem[] | null;
  filters: {
    [key: string]: { [key: string]: number };
  };
};

function Plots({ data, weights, articles, filters }: Props) {
  const [crimesByYear, setCrimesByYear] = useState<
    | {
        [key: string]: number | string;
      }[]
    | null
  >(null);
  const [crimesByYearQuartiere, setCrimesByYearQuartiere] = useState<
    | {
        [key: string]: number | string;
      }[]
    | null
  >(null);
  const [crimesByType, setCrimesByType] = useState<
    | {
        [key: string]: number | string;
      }[]
    | null
  >(null);

  const quartieri = useMemo(
    () => [
      "Bari Vecchia - San Nicola",
      "Carbonara",
      "Carrassi",
      "Ceglie del Campo",
      "Japigia",
      "Libertà",
      "Loseto",
      "Madonnella",
      "Murat",
      "Palese - Macchie",
      "Picone",
      "San Girolamo - Fesca",
      "San Paolo",
      "San Pasquale",
      "Santo Spirito",
      "Stanic",
      "Torre a mare"
    ],
    []
  );
  const colors: string[] = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A133FF",
    "#FFC300",
    "#FF5733",
    "#C70039",
    "#900C3F",
    "#581845",
    "#1F618D",
    "#28B463",
    "#D4AC0D",
    "#7D3C98",
    "#E74C3C",
    "#F39C12",
    "#2ECC71",
    "#3498DB",
    "#9B59B6",
    "#34495E"
  ];

  const barDataset = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(data as any).features.map((feature: Feature) => {
      return {
        ...feature.properties,
        name: feature?.properties?.name
      };
    })
  ];

  const valueFormatter = (value: number | null) => {
    return `${value}`;
  };

  const countCrimesByYear = useCallback(() => {
    if (articles) {
      const crimeCountByYear: { [key: string]: number } = {};
      const final: { [key: string]: number | string }[] = [];

      const filteredArticles = articles.filter((obj: CustomTreeItem) => {
        const quartiere_index = getQuartiereIndex(obj.label);

        return filters.quartieri[quartiere_index] === 1;
      });

      filteredArticles.forEach((area) => {
        if (area.children) {
          area.children.forEach((yearObj) => {
            const year = yearObj.label;
            let crimes = 0;

            if (yearObj.children) {
              yearObj.children.forEach((monthObj) => {
                if (monthObj.children) {
                  crimes += monthObj.children.length;
                }
              });
            }

            crimeCountByYear[year] = (crimeCountByYear[year] || 0) + crimes;
          });
        }
      });

      Object.keys(crimeCountByYear).map((year: string) => {
        final.push({
          year: parseInt(year),
          label: year,
          crimes: crimeCountByYear[year]
        });
      });

      setCrimesByYear(final);
    }
  }, [articles, filters.quartieri]);

  const countCrimesByYearAndNeighborhood = useCallback(() => {
    if (articles) {
      const crimeData: { [key: string]: { [key: string]: number } } = {};

      const filteredArticles = articles.filter((obj: CustomTreeItem) => {
        const quartiere_index = getQuartiereIndex(obj.label);

        return filters.quartieri[quartiere_index] === 1;
      });

      filteredArticles.forEach((area) => {
        const neighborhood = area.label;
        if (quartieri.includes(neighborhood) && area.children) {
          if (!crimeData[neighborhood]) {
            crimeData[neighborhood] = {};
          }

          area.children.forEach((yearObj) => {
            const year = yearObj.label;
            let crimes = 0;

            if (yearObj.children) {
              yearObj.children.forEach((monthObj) => {
                if (monthObj.children) {
                  crimes += monthObj.children.length;
                }
              });
            }

            crimeData[neighborhood][year] =
              (crimeData[neighborhood][year] || 0) + crimes;
          });
        }
      });

      const allYears = new Set(
        Object.values(crimeData).flatMap((q) => Object.keys(q))
      );

      setCrimesByYearQuartiere(
        Array.from(allYears)
          .sort()
          .map((year) => {
            const entry: Record<string, number> = { year: parseInt(year) };
            for (const [quartiere, anni] of Object.entries(crimeData)) {
              entry[quartiere] = anni[year] || 0;
            }
            return entry;
          })
      );
    }
  }, [articles, filters.quartieri, quartieri]);

  const countCrimesByType = useCallback(() => {
    if (data) {
      let idCounter = 0;
      const crimeList: { [key: string]: number | string }[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredData = (data as any).features.filter((obj: any) => {
        return filters.quartieri[obj.properties.python_id] === 1;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (filteredData as any).forEach((feature: Feature) => {
        if (feature && feature.properties && feature.properties.crimini) {
          Object.keys(feature?.properties?.crimini).map((key: string) => {
            const alreadyExists = crimeList.find(
              (crime: { [key: string]: number | string }) =>
                crime.label === getCrimeName(key)
            );
            if (alreadyExists) {
              alreadyExists.value +=
                feature?.properties?.crimini[key].frequenza;
            } else {
              crimeList.push({
                id: idCounter,
                value: feature?.properties?.crimini[key].frequenza,
                label: getCrimeName(key)
              });
              idCounter++;
            }
          });
        }
      });

      setCrimesByType(crimeList);
      return crimeList;
    }
  }, [data, filters.quartieri]);

  useEffect(() => {
    countCrimesByType();
    countCrimesByYear();
    countCrimesByYearAndNeighborhood();
  }, [countCrimesByType, countCrimesByYear, countCrimesByYearAndNeighborhood]);

  const keyToLabels: { [key: string]: string } = {
    "Bari Vecchia - San Nicola": "Bari Vecchia - San Nicola",
    Carbonara: "Carbonara",
    Carrassi: "Carrassi",
    "Ceglie del Campo": "Ceglie del Campo",
    Japigia: "Japigia",
    Libertà: "Libertà",
    Loseto: "Loseto",
    Madonnella: "Madonnella",
    Murat: "Murat",
    "Palese - Macchie": "Palese - Macchie",
    Picone: "Picone",
    "San Girolamo - Fesca": "San Girolamo - Fesca",
    "San Paolo": "San Paolo",
    "San Pasquale": "San Pasquale",
    "Santo Spirito": "Santo Spirito",
    Stanic: "Stanic",
    "Torre a mare": "Torre a mare"
  };

  return (
    <div className="xl:pl-4">
      {weights &&
        Object.keys(weights).some(
          (weight: string) => weights[weight] === "true"
        ) && (
          <div className="mb-4 flex flex-wrap gap-2">
            <p className="text-base font-bold">Weights on:</p>
            {weights.num_of_articles === "true" && (
              <Chip color="primary" label="NO. OF ARTICLES" size="small" />
            )}
            {weights.num_of_people === "true" && (
              <Chip color="primary" label="NO. OF PEOPLE" size="small" />
            )}
          </div>
        )}
      {data && barDataset && crimesByType && (
        <div className="flex flex-col gap-4 xl:flex-row">
          <Card className="!flex !w-full !flex-col !gap-2 p-4 xl:!w-1/2">
            <h2 className="text-lg font-bold">Crime index per neighborhood</h2>
            <BarChart
              dataset={barDataset}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "name",
                  tickPlacement: "middle"
                }
              ]}
              height={400}
              margin={{ bottom: 80 }}
              bottomAxis={{
                labelStyle: {
                  fontSize: 14,
                  transform: `translateY(${
                    // Hack that should be added in the lib latter.
                    5 * Math.abs(Math.sin((Math.PI * 45) / 180))
                  }px)`
                },
                tickLabelStyle: {
                  angle: 45,
                  textAnchor: "start",
                  fontSize: 12
                }
              }}
              series={[
                {
                  dataKey: "crime_index_scalato",
                  label: "Scaled crime index",
                  valueFormatter
                },
                {
                  dataKey: "crime_index",
                  label: "Crime index",
                  valueFormatter
                }
              ]}
            />
          </Card>
          <Card className="!flex !w-full !flex-col !gap-2 p-4 xl:!w-1/2">
            <h2 className="text-lg font-bold">Most common crimes in Bari</h2>
            <PieChart
              dataset={barDataset}
              colors={colors}
              height={400}
              series={[
                {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data: crimesByType as any,
                  highlightScope: { fade: "global", highlight: "item" }
                }
              ]}
            />
          </Card>
        </div>
      )}
      {articles && (
        <Card className="!mt-4 !flex !flex-col !gap-2 p-4">
          <h2 className="text-lg font-bold">
            Evolution of crimes in Bari by year
          </h2>
          <div className="flex flex-col flex-wrap gap-4 xl:flex-row xl:justify-between">
            <Card className="!w-full">
              <LineChart
                colors={colors}
                xAxis={[
                  {
                    dataKey: "year",
                    valueFormatter: (value) => value.toString(),
                    max: 2025,
                    min: 2011
                  }
                ]}
                series={[
                  {
                    dataKey: "crimes",
                    label: "Crimes"
                  }
                ]}
                height={400}
                dataset={crimesByYear || []}
              />
            </Card>
            <Card className="!w-full">
              <LineChart
                colors={colors}
                xAxis={[
                  {
                    dataKey: "year",
                    valueFormatter: (value) => value.toString(),
                    max: 2025,
                    min: 2011
                  }
                ]}
                series={Object.keys(keyToLabels).map((key) => ({
                  dataKey: key,
                  label: keyToLabels[key],
                  showMark: false
                }))}
                height={400}
                dataset={crimesByYearQuartiere || []}
              />
            </Card>
          </div>
        </Card>
      )}
    </div>
  );
}
export default Plots;

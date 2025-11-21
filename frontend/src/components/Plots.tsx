import { getCrimeName, getQuartiereIndex } from "../helpers/utils";
import { Article, CustomTreeItem, Filters } from "../types/global";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Feature, GeoJsonObject } from "geojson";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis
} from "recharts";

type Props = {
  data: GeoJsonObject | null;
  weights: { [key: string]: boolean } | null;
  minmax: boolean;
  articles: CustomTreeItem[] | null;
  treeArticles: Article[] | null;
  filters: Filters;
  startDate: Date | null;
  endDate: Date | null;
};

// Crime-related properties to check
const crimeProperties = [
  "aggressione",
  "associazione_di_tipo_mafioso",
  "contrabbando",
  "estorsione",
  "furto",
  "omicidio",
  "omicidio_colposo",
  "omicidio_stradale",
  "rapina",
  "spaccio",
  "tentato_omicidio",
  "truffa",
  "violenza_sessuale"
];

function Plots({
  data,
  weights,
  minmax,
  articles,
  treeArticles,
  filters
}: Props) {
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
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

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

  const articlesMap = useMemo(() => {
    if (!treeArticles) return new Map<string, Article>();
    return new Map(
      treeArticles.map((article) => [article.id.toString(), article])
    );
  }, [treeArticles]);

  const countCrimesByYear = useCallback(() => {
    if (articles) {
      const crimeCountByYear: { [key: string]: number } = {};
      const articleCountByYear: { [key: string]: number } = {};
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
            let totalArticles = 0;

            if (yearObj.children) {
              yearObj.children.forEach((monthObj) => {
                if (monthObj.children) {
                  monthObj.children.forEach((crimeObj) => {
                    if (!crimeObj.date) return;

                    const crimeDate = new Date(crimeObj.date);
                    const startDate = filters?.dates?.startDate;
                    const endDate = filters?.dates?.endDate;

                    const isInRange =
                      (!startDate || crimeDate >= startDate) &&
                      (!endDate || crimeDate <= endDate);

                    if (isInRange) {
                      // Count all articles
                      totalArticles += 1;

                      // Find the full article object from the map
                      const fullArticle = articlesMap.get(crimeObj.id);

                      /// Check and count how many crimes = 1
                      if (fullArticle) {
                        const crimeSum = crimeProperties.reduce((sum, prop) => {
                          return (
                            sum +
                            (fullArticle[prop as keyof Article] === 1 ? 1 : 0)
                          );
                        }, 0);

                        crimes += crimeSum;
                      }
                    }
                  });
                }
              });
            }

            crimeCountByYear[year] = (crimeCountByYear[year] || 0) + crimes;
            articleCountByYear[year] =
              (articleCountByYear[year] || 0) + totalArticles;
          });
        }
      });

      Object.keys(crimeCountByYear).map((year: string) => {
        final.push({
          year: parseInt(year),
          label: year,
          crimes: crimeCountByYear[year],
          articles: articleCountByYear[year]
        });
      });

      setCrimesByYear(final);
    }
  }, [
    articles,
    articlesMap,
    filters.quartieri,
    filters?.dates?.startDate,
    filters?.dates?.endDate
  ]);

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
                  monthObj.children.forEach((crimeObj) => {
                    if (!crimeObj.date) return;

                    const crimeDate = new Date(crimeObj.date);
                    const startDate = filters?.dates?.startDate;
                    const endDate = filters?.dates?.endDate;

                    const isInRange =
                      (!startDate || crimeDate >= startDate) &&
                      (!endDate || crimeDate <= endDate);

                    if (isInRange) {
                      // Find the full article object from the map (O(1) lookup)
                      const fullArticle = articlesMap.get(crimeObj.id);

                      // Check and count how many crimes = 1
                      if (fullArticle) {
                        const crimeSum = crimeProperties.reduce((sum, prop) => {
                          return (
                            sum +
                            (fullArticle[prop as keyof Article] === 1 ? 1 : 0)
                          );
                        }, 0);

                        crimes += crimeSum;
                      }
                    }
                  });
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
  }, [
    articles,
    articlesMap,
    filters.quartieri,
    filters?.dates?.startDate,
    filters?.dates?.endDate,
    quartieri
  ]);

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
        Object.keys(weights).some((weight: string) => weights![weight]) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="text-base font-bold">Weights and scaling:</p>
            {minmax && <Badge variant="default">MINMAX SCALED</Badge>}
            {weights?.num_of_articles && (
              <Badge variant="default">NO. OF ARTICLES</Badge>
            )}
            {weights?.num_of_people && (
              <Badge variant="default">NO. OF PEOPLE</Badge>
            )}
          </div>
        )}
      {data && barDataset && crimesByType && (
        <div className="flex flex-col gap-4 xl:flex-row">
          <Card className="bg-accent w-full xl:w-1/2">
            <CardHeader>
              <CardTitle>Crime index per neighborhood</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={
                  {
                    crimeIndex: {
                      label: minmax ? "Scaled crime index" : "Crime index",
                      color: "var(--primary)"
                    }
                  } satisfies ChartConfig
                }
                className="min-h-[400px] w-full">
                <BarChart
                  accessibilityLayer={true}
                  data={barDataset}
                  margin={{ bottom: 80, left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey={minmax ? "crime_index_scalato" : "crime_index"}
                    fill="var(--primary)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="bg-accent w-full xl:w-1/2">
            <CardHeader>
              <CardTitle>Most common crimes in Bari</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={
                  crimesByType?.reduce((acc, crime, index) => {
                    acc[crime.label as string] = {
                      label: crime.label as string,
                      color: colors[index % colors.length]
                    };
                    return acc;
                  }, {} as ChartConfig) || {}
                }
                className="min-h-[400px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Pie
                    data={crimesByType || []}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}>
                    {crimesByType?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
      {articles && (
        <Card className="bg-accent mt-4">
          <CardHeader>
            <CardTitle>Evolution of crimes in Bari by year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 xl:flex-row">
              <Card className="w-full xl:flex-1">
                <CardHeader>
                  <CardTitle className="text-base">
                    Crimes and Articles by Year
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={
                      {
                        crimes: {
                          label: "Crime Articles",
                          color: "var(--primary)"
                        },
                        articles: {
                          label: "Total Articles",
                          color: "var(--chart-2)"
                        }
                      } satisfies ChartConfig
                    }
                    className="min-h-[400px] w-full">
                    <LineChart
                      data={crimesByYear || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend
                        onMouseEnter={(e) =>
                          setHoveredLine(e.dataKey as string)
                        }
                        onMouseLeave={() => setHoveredLine(null)}
                      />
                      <Line
                        type="monotone"
                        dataKey="crimes"
                        stroke="var(--primary)"
                        strokeWidth={hoveredLine === "crimes" ? 6 : 4}
                        strokeOpacity={
                          hoveredLine && hoveredLine !== "crimes" ? 0.2 : 1
                        }
                        dot={{ fill: "var(--primary)", r: 4 }}
                        onMouseEnter={() => setHoveredLine("crimes")}
                        onMouseLeave={() => setHoveredLine(null)}
                      />
                      <Line
                        type="monotone"
                        dataKey="articles"
                        stroke="var(--chart-2)"
                        strokeWidth={hoveredLine === "articles" ? 6 : 4}
                        strokeOpacity={
                          hoveredLine && hoveredLine !== "articles" ? 0.2 : 1
                        }
                        dot={{ fill: "var(--chart-2)", r: 4 }}
                        onMouseEnter={() => setHoveredLine("articles")}
                        onMouseLeave={() => setHoveredLine(null)}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="w-full xl:flex-1">
                <CardHeader>
                  <CardTitle className="text-base">
                    Crimes by Year and Neighborhood
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={Object.keys(keyToLabels).reduce(
                      (acc, key, index) => {
                        acc[key] = {
                          label: keyToLabels[key],
                          color: colors[index % colors.length]
                        };
                        return acc;
                      },
                      {} as ChartConfig
                    )}
                    className="min-h-[250px] w-full">
                    <LineChart
                      data={crimesByYearQuartiere || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend
                        onMouseEnter={(e) =>
                          setHoveredLine(e.dataKey as string)
                        }
                        onMouseLeave={() => setHoveredLine(null)}
                      />
                      {Object.keys(keyToLabels).map((key, index) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={colors[index % colors.length]}
                          strokeWidth={hoveredLine === key ? 5 : 3}
                          strokeOpacity={
                            hoveredLine && hoveredLine !== key ? 0.2 : 1
                          }
                          dot={false}
                          onMouseEnter={() => setHoveredLine(key)}
                          onMouseLeave={() => setHoveredLine(null)}
                        />
                      ))}
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
export default Plots;

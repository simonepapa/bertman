import ChoroplethLegend from "../components/ChoroplethLegend";
import ChoroplethMap from "../components/ChoroplethMap";
import DashboardLeft from "../components/DashboardLeft";
import InfoCard from "../components/InfoCard";
import Plots from "../components/Plots";
import useFetchArticles from "../helpers/hooks/useFetchArticles";
import { Filters, InfoQuartiere } from "../types/global";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { GeoJsonObject } from "geojson";
import { LatLngExpression } from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

function Dashboard() {
  const [filters, setFilters] = useState<Filters>({
    crimes: {
      omicidio: 1,
      omicidio_colposo: 1,
      omicidio_stradale: 1,
      tentato_omicidio: 1,
      furto: 1,
      rapina: 1,
      violenza_sessuale: 1,
      aggressione: 1,
      spaccio: 1,
      truffa: 1,
      estorsione: 1,
      contrabbando: 1,
      associazione_di_tipo_mafioso: 1
    },
    quartieri: {
      "bari-vecchia_san-nicola": 1,
      carbonara: 1,
      carrassi: 1,
      "ceglie-del-campo": 1,
      japigia: 1,
      liberta: 1,
      loseto: 1,
      madonnella: 1,
      murat: 1,
      "palese-macchie": 1,
      picone: 1,
      "san-paolo": 1,
      "san-pasquale": 1,
      "santo-spirito": 1,
      stanic: 1,
      "torre-a-mare": 1,
      "san-girolamo_fesca": 1
    },
    weights: {
      num_of_articles: 1,
      num_of_people: 0
    },
    scaling: {
      minmax: 1
    },
    dates: {
      startDate: null,
      endDate: null
    }
  });
  const [tile, setTile] = useState<string>(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  );
  const [palette, setPalette] = useState<string>("red");
  const [info, setInfo] = useState<InfoQuartiere>({
    name: "",
    crime_index: null,
    total_crimes: null,
    population: 0,
    crimes: [],
    weights: {
      num_of_articles: false,
      num_of_people: false
    },
    minmax: true
  });
  const [data, setData] = useState<GeoJsonObject | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [tab, setTab] = useState<number>(0);
  const [legendValues, setLegendValues] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { articles } = useFetchArticles(setIsLoading, false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const position: LatLngExpression = [41.117143, 16.871871];

  const handleChangeStartDate = (newDate: Dayjs | null) => {
    setStartDate(newDate);
    setEndDate(dayjs());
  };

  const handleResetDate = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const queryParams = [];

      const selectedCrimes = Object.keys(filters.crimes)
        .filter((crime) => filters.crimes[crime] === 1)
        .join(",");
      queryParams.push(`crimes=${selectedCrimes}`);
      const selectedQuartieri = Object.keys(filters.quartieri)
        .filter((quartiere) => filters.quartieri[quartiere] === 1)
        .join(",");
      queryParams.push(`quartieri=${selectedQuartieri}`);

      if (startDate) {
        queryParams.push(
          `startDate=${dayjs(startDate).format("YYYY-MM-DD HH:mm:ss")}`
        );
      }
      if (endDate) {
        queryParams.push(
          `endDate=${dayjs(endDate).format("YYYY-MM-DD HH:mm:ss")}`
        );
      }
      queryParams.push(
        `${filters?.weights.num_of_articles === 1 ? "weightsForArticles=true" : "weightsForArticles=false"}`
      );
      queryParams.push(
        `${filters?.weights.num_of_people === 1 ? "weightsForPeople=true" : "weightsForPeople=false"}`
      );
      queryParams.push(
        `${filters?.scaling.minmax === 1 ? "minmaxScaler=true" : "minmaxScaler=false"}`
      );
      const queryString = queryParams.join("&");

      const response = await fetch(
        `http://127.0.0.1:5000/get-data?${queryString}`
      );

      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData);

        // Create legend
        const crimeIndexes: number[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (jsonData as any)?.features.forEach((item: any) => {
          crimeIndexes.push(
            jsonData.minmaxScaler === "true"
              ? item.properties.crime_index_scalato
              : item.properties.crime_index
          );
        });
        const minCrime = Math.min(...crimeIndexes);
        const maxCrime = Math.max(...crimeIndexes);
        const step = (maxCrime - minCrime) / 8;
        setLegendValues(
          Array.from({ length: 8 }, (_, i) =>
            parseFloat((minCrime + i * step).toFixed(2))
          )
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setInfo((prevState: any) => ({
          ...prevState,
          weights: {
            num_of_articles: jsonData.weightsForArticles === "true",
            num_of_people: jsonData.weightsForPeople === "true"
          },
          minmax: jsonData.minmaxScaler === "true"
        }));
      } else {
        // eslint-disable-next-line no-console
        console.error("Response error", response.status);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Request error", error);
    }

    setIsLoading(false);
  }, [
    endDate,
    filters.crimes,
    filters.quartieri,
    filters?.scaling.minmax,
    filters?.weights.num_of_articles,
    filters?.weights.num_of_people,
    startDate
  ]);

  useEffect(() => {
    if (startDate === null) {
      setEndDate(null);
    }
  }, [startDate]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-8 xl:flex-row xl:gap-0">
      <div className="relative h-fit w-full p-4 xl:min-h-screen xl:w-[25%] xl:pr-0">
        <DashboardLeft
          palette={palette}
          setPalette={setPalette}
          tile={tile}
          setTile={setTile}
          filters={filters}
          setFilters={setFilters}
          fetchData={fetchData}
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleChangeStartDate={handleChangeStartDate}
          handleResetDate={handleResetDate}
        />
      </div>
      <div
        className={`relative w-full px-4 xl:min-h-screen xl:w-[75%] xl:px-0 ${tab === 0 ? "h-[800px]" : "h-fit"}`}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="Map and plots"
          variant="fullWidth"
          sx={{
            my: 2,
            "& button": {
              fontWeight: 700
            }
          }}>
          <Tab disabled={isLoading} label="Map" {...a11yProps(0)} />
          <Tab disabled={isLoading} label="Plots" {...a11yProps(1)} />
        </Tabs>
        {tab === 0 && (
          <div className="relative h-full w-full bg-[#262626]">
            <ArrowCircleUpIcon
              className="!sticky !top-8 !left-2 !z-[10500] !h-12 !w-12 !text-white xl:!hidden"
              onClick={scrollToTop}
            />
            <InfoCard
              name={info.name}
              crime_index={info.crime_index}
              crimes={info.crimes}
              weights={info.weights || null}
              population={info.population}
              minmax={info.minmax}
            />
            {isLoading ? (
              <CircularProgress className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            ) : (
              <MapContainer
                className="h-full w-full"
                center={position}
                maxBoundsViscosity={1.0}
                zoom={12}
                scrollWheelZoom={true}>
                <TileLayer url={tile} />
                <ChoroplethMap
                  setInfo={setInfo}
                  data={data}
                  color={palette}
                  weights={info.weights || null}
                  minmax={info.minmax}
                  legendValues={legendValues}
                />
              </MapContainer>
            )}
            <ChoroplethLegend palette={palette} legendValues={legendValues} />
          </div>
        )}
        {tab === 1 && data && (
          <Plots
            data={data}
            weights={info.weights || null}
            minmax={info.minmax}
            articles={articles}
            filters={filters}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </div>
    </div>
  );
}
export default Dashboard;

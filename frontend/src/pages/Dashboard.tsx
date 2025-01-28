import ChoroplethLegend from "../components/ChoroplethLegend";
import ChoroplethMap from "../components/ChoroplethMap";
import DashboardLeft from "../components/DashboardLeft";
import InfoCard from "../components/InfoCard";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { CircularProgress } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { GeoJsonObject } from "geojson";
import { LatLngExpression } from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

function Dashboard() {
  const [filters, setFilters] = useState<{
    [key: string]: { [key: string]: number };
  }>({
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
    crimes: []
  });
  const [data, setData] = useState<GeoJsonObject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

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

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const endpoint =
        startDate === null
          ? `http://127.0.0.1:5000/get-data?crimes=${Object.keys(filters.crimes)
              .filter((crime) => filters.crimes[crime] === 1)
              .join(",")}&quartieri=${Object.keys(filters.quartieri)
              .filter((quartiere) => filters.quartieri[quartiere] === 1)
              .join(",")}`
          : `http://127.0.0.1:5000/get-data?crimes=${Object.keys(filters.crimes)
              .filter((crime) => filters.crimes[crime] === 1)
              .join(",")}&quartieri=${Object.keys(filters.quartieri)
              .filter((quartiere) => filters.quartieri[quartiere] === 1)
              .join(
                ","
              )}&startDate=${dayjs(startDate).format("YYYY-MM-DD HH:mm:ss")}&endDate=${dayjs(endDate).format("YYYY-MM-DD HH:mm:ss")}`;

      const response = await fetch(endpoint);

      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData);
      } else {
        console.error("Response error", response.status);
      }
    } catch (error) {
      console.error("Request error", error);
    }

    setIsLoading(false);
  }, [endDate, filters.crimes, filters.quartieri, startDate]);

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
      <div className="h-fit w-full p-4 xl:min-h-screen xl:w-[25%]">
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
      <div className="relative h-[800px] w-full bg-[#262626] xl:min-h-screen xl:w-[75%]">
        <ArrowCircleUpIcon
          className="!sticky !top-8 !left-2 !h-12 !w-12 !text-white xl:!hidden"
          onClick={scrollToTop}
        />
        <InfoCard
          name={info.name}
          crime_index={info.crime_index}
          crimes={info.crimes}
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
            <ChoroplethMap setInfo={setInfo} data={data} color={palette} />
          </MapContainer>
        )}
        <ChoroplethLegend palette={palette} />
      </div>
    </div>
  );
}
export default Dashboard;

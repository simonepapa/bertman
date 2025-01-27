import InfoCard from "../components/ui/InfoCard";
import { CircularProgress } from "@mui/material";
import { Feature, GeoJsonObject } from "geojson";
import {
  GeoJSONOptions,
  LatLngExpression,
  Layer,
  LeafletMouseEvent
} from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

function Dashboard() {
  const [info, setInfo] = useState<{
    name: string;
    crime_index: number | null;
    total_crimes: number | null;
    crimes: {
      crime: string;
      index: number;
      frequency: number;
    }[];
  }>({
    name: "",
    crime_index: null,
    total_crimes: null,
    crimes: []
  });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const position: LatLngExpression = [41.117143, 16.871871];

  function getColor(d: number) {
    return d > 80
      ? "#7f0000"
      : d > 70
        ? "#b30000"
        : d > 60
          ? "#d7301f"
          : d > 50
            ? "#ef6548"
            : d > 40
              ? "#fc8d59"
              : d > 30
                ? "#fdbb84"
                : d > 20
                  ? "#fdd49e"
                  : d > 10
                    ? "#fee8c8"
                    : "#fff7ec";
  }

  const style = (feature: Feature) => {
    return {
      fillColor: getColor(feature.properties?.crime_index_normalizzato_pesato),
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "2",
      fillOpacity: 0.5
    };
  };

  const highlightFeature = (e: LeafletMouseEvent) => {
    const allCrimes = e.target.feature.properties.crimini;
    const crimes = Object.keys(allCrimes).map((crimine) => {
      return {
        crime: crimine,
        index: allCrimes[crimine].crime_index_normalizzato,
        frequency: allCrimes[crimine].frequenza
      };
    });

    setInfo({
      name: e.target.feature.properties.name,
      crime_index: e.target.feature.properties.crime_index_normalizzato_pesato,
      total_crimes: e.target.feature.properties.crimini_totali,
      crimes: crimes
    });

    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7
    });
  };
  /*resets our state i.e no properties should be displayed when a feature is not clicked or hovered over */
  const resetHighlight = (e: LeafletMouseEvent) => {
    setInfo({
      name: "",
      crime_index: null,
      total_crimes: null,
      crimes: []
    });

    e.target.setStyle(style(e.target.feature));
  };

  const onEachFeature = (_feature: Feature, layer: Layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("http://127.0.0.1:5000/get-data");

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
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col xl:flex-row">
      <div className="h-[400px] w-full bg-[black] xl:min-h-screen xl:w-[25%]"></div>
      <div className="relative h-[800px] w-full bg-[#262626] xl:min-h-screen xl:w-[75%]">
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
            <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" />
            {data && (
              <GeoJSON
                data={data as GeoJsonObject}
                style={style as GeoJSONOptions}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
export default Dashboard;

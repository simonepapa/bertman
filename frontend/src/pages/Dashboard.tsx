import ChoroplethMap from "../components/ChoroplethMap";
import InfoCard from "../components/ui/InfoCard";
import { CircularProgress } from "@mui/material";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

function Dashboard() {
  const [info, setInfo] = useState<InfoQuartiere>({
    name: "",
    crime_index: null,
    total_crimes: null,
    crimes: []
  });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const position: LatLngExpression = [41.117143, 16.871871];

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
            <ChoroplethMap setInfo={setInfo} data={data} />
          </MapContainer>
        )}
      </div>
    </div>
  );
}
export default Dashboard;

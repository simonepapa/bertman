import ChoroplethMap from "../components/ChoroplethMap";
import PaletteDisplay from "../components/PaletteDisplay";
import TileDisplay from "../components/TileDisplay";
import InfoCard from "../components/ui/InfoCard";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from "@mui/material";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

function Dashboard() {
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

  const handleTileChange = (style: string) => {
    setTile(style);
  };

  const handlePaletteChange = (color: string) => {
    setPalette(color);
  };

  return (
    <div className="flex flex-col gap-8 xl:flex-row xl:gap-0">
      <div className="h-fit w-full p-4 xl:min-h-screen xl:w-[25%]">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold">Map style</h2>
          <FormControl>
            <label id="tiles-palette-label" className="text-lg font-medium">
              Tiles palette
            </label>
            <RadioGroup
              row={true}
              aria-labelledby="tiles-palette-label"
              name="row-radio-buttons-group">
              <FormControlLabel
                checked={palette === "red"}
                value="red"
                control={<Radio />}
                label={<PaletteDisplay palette="red" />}
                onClick={() => handlePaletteChange("red")}
              />
              <FormControlLabel
                checked={palette === "blue"}
                value="blue"
                control={<Radio />}
                label={<PaletteDisplay palette="blue" />}
                onClick={() => handlePaletteChange("blue")}
              />
              <FormControlLabel
                checked={palette === "green"}
                value="green"
                control={<Radio />}
                label={<PaletteDisplay palette="green" />}
                onClick={() => handlePaletteChange("green")}
              />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <label
              id="tiles-palette-label"
              className="mb-2 text-lg font-medium">
              Tile style
            </label>
            <RadioGroup
              row={true}
              aria-labelledby="tiles-palette-label"
              name="row-radio-buttons-group"
              className="gap-2">
              <FormControlLabel
                checked={
                  tile === "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
                value="base"
                control={<Radio />}
                label={<TileDisplay style="base" />}
                onClick={() =>
                  handleTileChange(
                    "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  )
                }
              />
              <FormControlLabel
                checked={
                  tile ===
                  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                }
                value="dark"
                control={<Radio />}
                label={<TileDisplay style="dark" />}
                onClick={() =>
                  handleTileChange(
                    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  )
                }
              />
              <FormControlLabel
                checked={
                  tile ===
                  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                }
                value="light"
                control={<Radio />}
                label={<TileDisplay style="light" />}
                onClick={() =>
                  handleTileChange(
                    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  )
                }
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
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
            <TileLayer url={tile} />
            <ChoroplethMap setInfo={setInfo} data={data} color={palette} />
          </MapContainer>
        )}
      </div>
    </div>
  );
}
export default Dashboard;

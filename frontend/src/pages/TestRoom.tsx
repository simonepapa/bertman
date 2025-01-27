import Test from "../components/Test";
import data from "../data/quartieri.json";
import { Feature, GeoJsonObject } from "geojson";
import {
  GeoJSONOptions,
  LatLngExpression,
  Layer,
  LeafletMouseEvent
} from "leaflet";
import { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

function Home() {
  const [info, setInfo] = useState<{
    name: string;
    crime_index_normalizzato_pesato: string | number;
    crimini_totali: string | number;
  }>({
    name: "",
    crime_index_normalizzato_pesato: "",
    crimini_totali: ""
  });

  const position: LatLngExpression = [41.117143, 16.871871];

  function getColor(d: number) {
    return d > 50
      ? "#800026"
      : d > 40
        ? "#BD0026"
        : d > 30
          ? "#E31A1C"
          : d > 20
            ? "#FC4E2A"
            : d > 10
              ? "#FD8D3C"
              : d > 5
                ? "#FEB24C"
                : d > 1
                  ? "#FED976"
                  : "#FFEDA0";
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
    setInfo({
      name: e.target.feature.properties.name,
      crime_index_normalizzato_pesato:
        e.target.feature.properties.crime_index_normalizzato_pesato,
      crimini_totali: e.target.feature.properties.crimini_totali
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
      crime_index_normalizzato_pesato: "",
      crimini_totali: ""
    });

    e.target.setStyle(style(e.target.feature));
  };

  const onEachFeature = (_feature: Feature, layer: Layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    });
  };

  return (
    <div>
      <div className="h-[1000px] w-[800px]">
        <Test info={info} />
        <MapContainer
          className="h-[1000px]"
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
      </div>
    </div>
  );
}
export default Home;

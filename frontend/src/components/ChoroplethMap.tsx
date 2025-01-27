import { Feature, GeoJsonObject } from "geojson";
import { GeoJSONOptions, Layer, LeafletMouseEvent } from "leaflet";
import { Dispatch, SetStateAction } from "react";
import { GeoJSON, useMap } from "react-leaflet";

type Props = {
  setInfo: Dispatch<SetStateAction<InfoQuartiere>>;
  data: GeoJsonObject | null;
};

function ChoroplethMap({ setInfo, data }: Props) {
  const map = useMap();

  console.log(data);

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

    layer.bringToFront();
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

  const zoomToFeature = (e: LeafletMouseEvent) => {
    map.fitBounds(e.target.getBounds());
  };

  const onEachFeature = (_feature: Feature, layer: Layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  };

  if (data)
    return (
      <GeoJSON
        data={data as GeoJsonObject}
        style={style as GeoJSONOptions}
        onEachFeature={onEachFeature}
      />
    );
}
export default ChoroplethMap;

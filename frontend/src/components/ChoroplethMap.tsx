import { Feature, GeoJsonObject } from "geojson";
import { GeoJSONOptions, Layer, LeafletMouseEvent } from "leaflet";
import { Dispatch, SetStateAction, useCallback } from "react";
import { GeoJSON, useMap } from "react-leaflet";

type Props = {
  setInfo: Dispatch<SetStateAction<InfoQuartiere>>;
  data: GeoJsonObject | null;
  color: string;
  weights: { [key: string]: string } | null;
};

function ChoroplethMap({ setInfo, data, color, weights }: Props) {
  const map = useMap();

  const getColor = useCallback(
    (d: number) => {
      if (color === "red") {
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
      } else if (color === "blue") {
        return d > 80
          ? "#023858"
          : d > 70
            ? "#045a8d"
            : d > 60
              ? "#0570b0"
              : d > 50
                ? "#3690c0"
                : d > 40
                  ? "#74a9cf"
                  : d > 30
                    ? "#a6bddb"
                    : d > 20
                      ? "#d0d1e6"
                      : d > 10
                        ? "#ece7f2"
                        : "#fff7fb";
      } else if (color === "green") {
        return d > 80
          ? "#00441b"
          : d > 70
            ? "#006d2c"
            : d > 60
              ? "#238b45"
              : d > 50
                ? "#41ae76"
                : d > 40
                  ? "#66c2a4"
                  : d > 30
                    ? "#99d8c9"
                    : d > 20
                      ? "#ccece6"
                      : d > 10
                        ? "#e5f5f9"
                        : "#f7fcfd";
      }
    },
    [color]
  );

  const style = useCallback(
    (feature: Feature) => {
      return {
        fillColor: getColor(feature.properties?.crime_index_scalato),
        weight: 1,
        opacity: 1,
        color: "white",
        dashArray: "2",
        fillOpacity: 0.5
      };
    },
    [getColor]
  );

  const highlightFeature = useCallback(
    (e: LeafletMouseEvent) => {
      let crimes: Crime[] = [];

      const allCrimes = e.target.feature.properties.crimini;
      if (allCrimes !== undefined) {
        crimes = Object.keys(allCrimes).map((crimine) => {
          return {
            crime: crimine,
            index: (
              Math.round(
                (allCrimes[crimine].crime_index + Number.EPSILON) * 100
              ) / 100
            ).toFixed(2),
            frequency: allCrimes[crimine].frequenza
          };
        });
      } else {
        crimes = [
          {
            crime: "aggressione",
            index: 0,
            frequency: 0
          },
          {
            crime: "associazione_di_tipo_mafioso",
            index: 0,
            frequency: 0
          },
          {
            crime: "contrabbando",
            index: 0,
            frequency: 0
          },
          {
            crime: "estorsione",
            index: 0,
            frequency: 0
          },
          {
            crime: "furto",
            index: 0,
            frequency: 0
          },
          {
            crime: "omicidio",
            index: 0,
            frequency: 0
          },
          {
            crime: "omicidio_colposo",
            index: 0,
            frequency: 0
          },
          {
            crime: "omicidio_stradale",
            index: 0,
            frequency: 0
          },
          {
            crime: "rapina",
            index: 0,
            frequency: 0
          },
          {
            crime: "spaccio",
            index: 0,
            frequency: 0
          },
          {
            crime: "tentato_omicidio",
            index: 0,
            frequency: 0
          },
          {
            crime: "truffa",
            index: 0,
            frequency: 0
          },
          {
            crime: "violenza_sessuale",
            index: 0,
            frequency: 0
          }
        ];
      }

      setInfo({
        name: e.target.feature.properties.name,
        crime_index: e.target.feature.properties.crime_index_scalato,
        total_crimes: e.target.feature.properties.crimini_totali,
        population: e.target.feature.properties.population,
        crimes: crimes,
        ...(weights && {
          weights: weights
        })
      });

      const layer = e.target;
      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7
      });

      layer.bringToFront();
    },
    [setInfo, weights]
  );

  const resetHighlight = useCallback(
    (e: LeafletMouseEvent) => {
      setInfo({
        name: "",
        crime_index: null,
        total_crimes: null,
        population: 0,
        crimes: [],
        ...(weights && {
          weights: weights
        })
      });

      e.target.setStyle(style(e.target.feature));
    },
    [setInfo, style, weights]
  );

  const zoomToFeature = useCallback(
    (e: LeafletMouseEvent) => {
      map.fitBounds(e.target.getBounds());
    },
    [map]
  );

  const onEachFeature = useCallback(
    (_feature: Feature, layer: Layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      });
    },
    [highlightFeature, resetHighlight, zoomToFeature]
  );

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

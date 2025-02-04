import { Crime, InfoQuartiere } from "../types/global";
import { Feature, GeoJsonObject } from "geojson";
import { GeoJSONOptions, Layer, LeafletMouseEvent } from "leaflet";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { GeoJSON, useMap } from "react-leaflet";

type Props = {
  setInfo: Dispatch<SetStateAction<InfoQuartiere>>;
  data: GeoJsonObject | null;
  color: string;
  weights: { [key: string]: boolean } | null;
  minmax: boolean;
  legendValues: number[];
};

function ChoroplethMap({
  setInfo,
  data,
  color,
  weights,
  minmax,
  legendValues
}: Props) {
  const map = useMap();

  const colorScales: { [key: string]: string[] } = useMemo(
    () => ({
      red: [
        "#7f0000",
        "#b30000",
        "#d7301f",
        "#ef6548",
        "#fc8d59",
        "#fdbb84",
        "#fdd49e",
        "#fee8c8",
        "#fff7ec"
      ],
      blue: [
        "#023858",
        "#045a8d",
        "#0570b0",
        "#3690c0",
        "#74a9cf",
        "#a6bddb",
        "#d0d1e6",
        "#ece7f2",
        "#fff7fb"
      ],
      green: [
        "#00441b",
        "#006d2c",
        "#238b45",
        "#41ae76",
        "#66c2a4",
        "#99d8c9",
        "#ccece6",
        "#e5f5f9",
        "#f7fcfd"
      ]
    }),
    []
  );

  const getColor = useCallback(
    (d: number) => {
      for (let i = 0; i < legendValues.length - 1; i++) {
        if (d >= legendValues[i] && d < legendValues[i + 1]) {
          return colorScales[color][colorScales[color].length - 1 - i];
        }
      }

      return colorScales[color][0];
    },
    [color, colorScales, legendValues]
  );

  const style = useCallback(
    (feature: Feature) => {
      return {
        fillColor: getColor(
          minmax
            ? feature.properties?.crime_index_scalato
            : feature.properties?.crime_index
        ),
        weight: 1,
        opacity: 1,
        color: "white",
        dashArray: "2",
        fillOpacity: 0.5
      };
    },
    [getColor, minmax]
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
        crime_index: minmax
          ? e.target.feature.properties.crime_index_scalato
          : e.target.feature.properties.crime_index,
        total_crimes: e.target.feature.properties.crimini_totali,
        population: e.target.feature.properties.population,
        crimes: crimes,
        ...(weights && {
          weights: weights
        }),
        minmax: minmax
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
    [minmax, setInfo, weights]
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
        }),
        minmax: minmax
      });

      e.target.setStyle(style(e.target.feature));
    },
    [minmax, setInfo, style, weights]
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

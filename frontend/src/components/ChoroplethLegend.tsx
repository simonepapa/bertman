import { colorizeSquare } from "../helpers/utils";

type Props = {
  palette: string;
  legendValues: number[];
};

function ChoroplethLegend({ palette, legendValues }: Props) {
  return (
    <div className="legend-card grid grid-cols-3 gap-2 xl:grid-cols-1">
      {[...legendValues].reverse().map((value: number, index: number) => (
        <div className="flex items-center gap-2" key={value}>
          <div
            className="h-4 w-4"
            style={{ backgroundColor: colorizeSquare(index, palette) }}></div>
          <p>
            {index === 0
              ? `> ${value}`
              : `(${legendValues[legendValues.length - index]}, ${legendValues[legendValues.length - 1 - index]})`}
          </p>
        </div>
      ))}
    </div>
  );
}
export default ChoroplethLegend;

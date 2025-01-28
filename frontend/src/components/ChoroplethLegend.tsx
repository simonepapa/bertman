import { colorizeSquare } from "../helpers/utils";

type Props = {
  palette: string;
};

function ChoroplethLegend({ palette }: Props) {
  return (
    <div className="legend-card grid grid-cols-3 gap-2 xl:grid-cols-1">
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4"
          style={{ backgroundColor: colorizeSquare(0, palette) }}></div>
        <p>(80,100]</p>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4"
          style={{ backgroundColor: colorizeSquare(1, palette) }}></div>
        <p>(70,80]</p>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4"
          style={{ backgroundColor: colorizeSquare(2, palette) }}></div>
        <p>(60-70]</p>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4"
          style={{ backgroundColor: colorizeSquare(3, palette) }}></div>
        <p>(50-60]</p>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4"
          style={{ backgroundColor: colorizeSquare(4, palette) }}></div>
        <p>(40-50]</p>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4"
          style={{ backgroundColor: colorizeSquare(5, palette) }}></div>
        <p>(30-40]</p>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4"
          style={{ backgroundColor: colorizeSquare(6, palette) }}></div>
        <p>(20-30]</p>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4"
          style={{ backgroundColor: colorizeSquare(7, palette) }}></div>
        <p>(10-20]</p>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4"
          style={{ backgroundColor: colorizeSquare(8, palette) }}></div>
        <p>[0-10)</p>
      </div>
    </div>
  );
}
export default ChoroplethLegend;

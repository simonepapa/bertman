type Props = {
  palette: string;
};

function PaletteDisplay({ palette }: Props) {
  const colorizeSquare = (index: number) => {
    let colors: string[] = [];

    if (palette === "red") {
      colors = [
        "#7f0000",
        "#b30000",
        "#d7301f",
        "#ef6548",
        "#fc8d59",
        "#fdbb84",
        "#fdd49e",
        "#fee8c8",
        "#fff7ec"
      ];
    } else if (palette === "blue") {
      colors = [
        "#023858",
        "#045a8d",
        "#0570b0",
        "#3690c0",
        "#74a9cf",
        "#a6bddb",
        "#d0d1e6",
        "#ece7f2",
        "#fff7fb"
      ];
    } else if (palette === "green") {
      colors = [
        "#00441b",
        "#006d2c",
        "#238b45",
        "#41ae76",
        "#66c2a4",
        "#99d8c9",
        "#ccece6",
        "#e5f5f9",
        "#f7fcfd"
      ];
    }

    return colors[index];
  };

  return (
    <div className="flex flex-col">
      <div
        className="h-4 w-4"
        style={{ backgroundColor: "colorizeSquare(8)" }}></div>
      <div
        className="h-4 w-4"
        style={{ backgroundColor: colorizeSquare(7) }}></div>
      <div
        className="h-4 w-4"
        style={{ backgroundColor: colorizeSquare(6) }}></div>
      <div
        className="h-4 w-4"
        style={{ backgroundColor: colorizeSquare(5) }}></div>
      <div
        className="h-4 w-4"
        style={{ backgroundColor: colorizeSquare(4) }}></div>
      <div
        className="h-4 w-4"
        style={{ backgroundColor: colorizeSquare(3) }}></div>
      <div
        className="h-4 w-4"
        style={{ backgroundColor: colorizeSquare(2) }}></div>
      <div
        className="h-4 w-4"
        style={{ backgroundColor: colorizeSquare(1) }}></div>
      <div
        className="h-4 w-4"
        style={{ backgroundColor: colorizeSquare(0) }}></div>
    </div>
  );
}
export default PaletteDisplay;

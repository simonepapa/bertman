type Props = {
  style: string;
};

function TileDisplay({ style }: Props) {
  return (
    <div
      className="h-[128px] w-[128px] bg-center bg-no-repeat"
      style={{ backgroundImage: `url(img/${style}_tile.png)` }}></div>
  );
}
export default TileDisplay;

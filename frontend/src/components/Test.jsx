function Test({ info }) {
  return (
    <div className="custom-info absolute h-[200px] w-[200px]">
      Ciao
      <ul>
        <li>{info.name}</li>
        <li>{info.crime_index_normalizzato_pesato}</li>
        <li>{info.crimini_totali}</li>
      </ul>
    </div>
  );
}
export default Test;

import { useEffect, useState } from "react";

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/get-data?quartieri=san-paolo,japigia"
        );

        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData);
        } else {
          console.error("Response error", response.status);
        }
      } catch (error) {
        console.error("Request error", error);
      }
    };

    fetchData();
  }, []);

  console.log(data);

  return <div>Home</div>;
}
export default Home;

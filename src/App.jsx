import "./App.css";
import { useEffect, useRef, useState } from "react";
import Sequencer1 from "./assets/components/Sequencer1";

export default function App() {
  const [freqData, setFreqData] = useState([]);
  const [indexData, setIndexData] = useState([]);
  const [presetData, setPresetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indexArray, setIndexArray] = useState();
  const freqIdRef = useRef(0);
  const [freqObj, setFreqObj] = useState();
  const defaultFreqData = useRef(null);
  const indexIdRef = useRef(0);
  const indexObjRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //get default freq from user 1
        const defaultFreqResponse = await fetch(
          `http://localhost:8888/wp-json/multiplier-api/v1/freq-arrays/1`
        );
        if (!defaultFreqResponse.ok)
          throw new Error(
            `Default frequency array request Error. status: ${defaultFreqResponse.status}`
          );
        const defaultFreqJSON = await defaultFreqResponse.json();
        defaultFreqData.current = defaultFreqJSON;
        //get user id for current user
        const userResponse = await fetch(
          "http://localhost:8888/wp-json/wp/v2/users"
        );
        if (!userResponse.ok)
          throw new Error(
            `User data request error. status: ${userResponse.status}`
          );
        const userData = await userResponse.json();
        //get freq arrays for current user
        const freqResponse = await fetch(
          `http://localhost:8888/wp-json/multiplier-api/v1/freq-arrays/${userData[0].id}`
        );
        if (!freqResponse.ok)
          throw new Error(
            `User frequency arrays request error! status: ${freqResponse.status}`
          );
        const freqArrJSON = await freqResponse.json();
        setFreqData(freqArrJSON);
        //get index arrays for current user
        const indexResponse = await fetch(
          `http://localhost:8888/wp-json/multiplier-api/v1/index-arrays/${userData[0].id}`
        );
        if (!indexResponse.ok)
          throw new Error(
            `User index array request error! status: ${indexResponse.status}`
          );
        const indexArrJSON = await indexResponse.json();
        setIndexData(indexArrJSON);
        console.log(`upper: ${indexData}`);
        //get presets for current user
        const presetResponse = await fetch(
          `http://localhost:8888/wp-json/multiplier-api/v1/presets/${userData[0].id}`
        );
        if (!presetResponse.ok)
          throw new Error(
            `User presets request error! status: ${presetResponse.status}`
          );
        const presetArrJSON = await presetResponse.json();
        setPresetData(presetArrJSON);
        console.log(presetData);
        //calculate freq array after data loads
        if (defaultFreqJSON.length > 0) {
          const initialId = defaultFreqJSON[0].array_id;
          freqIdRef.current = initialId;
          setFreqObj(filterData(defaultFreqJSON, initialId, "array_id"));
          // createFreqArray();
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelect = (e) => {
    freqIdRef.current = e.target.value;
    if (e.target.value > 1) {
      setFreqObj(filterData(freqData, freqIdRef.current, "array_id"));
    } else {
      setFreqObj(
        filterData(defaultFreqData.current, freqIdRef.current, "array_id")
      );
    }
    //console.log(filterData(freqData, freqIdRef.current, 'array_id'));
    createFreqArray();
  };

  const filterData = (dataArr, id, key) => {
    const o = dataArr.filter((obj) => obj[key] === id);
    return o[0];
  };

  const createFreqArray = () => {
    const arr = [];
    const obj = freqObj;
    for (let i = 1.0; i < 9; i++) {
      arr.push(obj.base_freq * i * obj.multiplier);
    }
    return arr;
  };

  return (
    <>
      <h1>Multiplier API Dev</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {freqData.map((item) => (
          <li key={item.array_id}>
            Preset: {item.array_id}, Base Frequency: {item.base_freq},
            Multiplier: {item.multiplier}
          </li>
        ))}
      </ul>
      <label htmlFor="freqId">Frequency Array:</label>
      <select
        ref={freqIdRef}
        name="freqId"
        id="freqId"
        onChange={handleSelect}
        style={{ marginLeft: "10px" }}
      >
        <option value={1}>DEFAULT</option>
        {freqData.map(
          (item) =>
            item.array_id > 1 && (
              <option key={item.array_id} value={item.array_id}>
                {item.array_name}
              </option>
            )
        )}
      </select>
      <p>
        <span style={{ fontWeight: "bold" }}>In Hertz: </span>
        {freqObj ? createFreqArray().join(", ") : "Loading frequency array..."}
      </p>

      <p>Preset Data: </p>

      {indexData[0] && <p> Index Array: {indexData[0].index_array}</p>}
    </>
  );
}

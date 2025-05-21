import "./App.css";
import { useEffect, useRef, useState } from "react";
import Sequencer1 from "./components/Sequencer1";
import FreqArray from "./components/FreqArray";
import IndexArray from "./components/IndexArray";
import PresetArray from "./components/PresetArray";

export default function App() {
  const [freqData, setFreqData] = useState([]);
  const [indexData, setIndexData] = useState([]);
  const [presetData, setPresetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const freqIdRef = useRef(0);
  const [freqObj, setFreqObj] = useState();
  const indexIdRef = useRef(0);
  const [indexObj, setIndexObj] = useState();
  const presetIdRef = useRef(0);
  const [presetObj, setPresetObj] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //get freq arrays for user 1
        const freqResponse = await fetch(
          `http://localhost:8888/wp-json/multiplier-api/v1/freq-arrays/1`
        );
        if (!freqResponse.ok)
          throw new Error(
            `User frequency arrays request error! status: ${freqResponse.status}`
          );
        const freqArrJSON = await freqResponse.json();
        setFreqData(freqArrJSON);
        //get index arrays for current user
        const indexResponse = await fetch(
          `http://localhost:8888/wp-json/multiplier-api/v1/index-arrays/1`
        );
        if (!indexResponse.ok)
          throw new Error(
            `User index array request error! status: ${indexResponse.status}`
          );
        const indexArrJSON = await indexResponse.json();
        setIndexData(indexArrJSON);
        //get presets for current user
        const presetResponse = await fetch(
          `http://localhost:8888/wp-json/multiplier-api/v1/presets/1`
        );
        if (!presetResponse.ok)
          throw new Error(
            `User presets request error! status: ${presetResponse.status}`
          );
        const presetArrJSON = await presetResponse.json();
        setPresetData(presetArrJSON);
        //calculate freq array after data loads
        if (freqArrJSON.length > 0) {
          const initialId = freqArrJSON[0].array_id;
          freqIdRef.current = initialId;
          setFreqObj(filterData(freqArrJSON, initialId, "array_id"));
        }
        if (indexArrJSON.length > 0) {
          indexIdRef.current = "1";
          setIndexObj(filterData(indexArrJSON, indexIdRef.current, "array_id"));
        }
        if (presetArrJSON.length > 0) {
          presetIdRef.current = "1";
          setPresetObj(
            filterData(presetArrJSON, presetIdRef.current, "preset_id")
          );
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFreqSelect = (e) => {
    freqIdRef.current = e.target.value;
    setFreqObj(filterData(freqData, freqIdRef.current, "array_id"));
  };

  const handleIndexSelect = (e) => {
    indexIdRef.current = e.target.value;
    setIndexObj(filterData(indexData, indexIdRef.current, "array_id"));
  };

  const handlePresetSelect = (e) => {
    presetIdRef.current = e.target.value;
    setPresetObj(filterData(presetData, presetIdRef.current, "preset_id"));
  };

  const filterData = (data, id, key) => {
    const o = data.filter((obj) => obj[key] === id);
    console.log(o[0]);
    return o[0];
  };

  return (
    <>
      <h1>Multiplier API Dev</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <FreqArray
        freqData={freqData}
        freqIdRef={freqIdRef}
        handleSelect={handleFreqSelect}
        freqObj={freqObj}
      />

      <IndexArray
        indexData={indexData}
        indexIdRef={indexIdRef}
        handleSelect={handleIndexSelect}
        indexObj={indexObj}
      />

      <PresetArray
        presetData={presetData}
        presetIdRef={presetIdRef}
        handleSelect={handlePresetSelect}
        presetObj={presetObj}
      />
    </>
  );
}

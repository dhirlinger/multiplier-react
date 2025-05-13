import "./App.css";
import { useEffect, useRef, useState } from "react";
import Sequencer1 from "./assets/components/Sequencer1";

export default function App() {
 
 const [freqData, setFreqData] = useState([]);
 const [indexData, setIndexData] = useState([]);
 const [presetData, setPresetData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [freqArray, setFreqArray] = useState();
 const [indexArray, setIndexArray] = useState();
 const freqIdRef = useRef(0);
 const freqObjRef = useRef(null);
 const defaultFreqData = useRef(null);
 const indexIdRef = useRef(0);
 const indexObjRef = useRef(null);
 
 useEffect(() => {
  const fetchData = async () => {
    try {
      //get default freq from user 1
      const defaultFreqResponse = await fetch(`http://localhost:8888/wp-json/multiplier-api/v1/freq-arrays/1`);
      if (!defaultFreqResponse.ok) throw new Error(`Default frequency array request Error. status: ${defaultFreqResponse.status}`)
      const defaultFreqJSON = await defaultFreqResponse.json();
      defaultFreqData.current = defaultFreqJSON;
      //get user id for current user
      const userResponse = await fetch('http://localhost:8888/wp-json/wp/v2/users');
      if (!userResponse.ok) throw new Error(`User data request error. status: ${userResponse.status}`);
      const userData = await userResponse.json();
      //get freq arrays for current user
      const freqResponse = await fetch(`http://localhost:8888/wp-json/multiplier-api/v1/freq-arrays/${userData[0].id}`);
      if (!freqResponse.ok) throw new Error(`User frequency arrays request error! status: ${freqResponse.status}`);
      const freqArrJSON = await freqResponse.json();
      setFreqData(freqArrJSON);
      //get index arrays for current user
      const indexResponse = await fetch(`http://localhost:8888/wp-json/multiplier-api/v1/index-arrays/${userData[0].id}`);
      if (!indexResponse.ok) throw new Error(`User index array request error! status: ${indexResponse.status}`);
      const indexArrJSON = await indexResponse.json();
      setIndexData(indexArrJSON);
      //get presets for current user
      const presetResponse = await fetch(`http://localhost:8888/wp-json/multiplier-api/v1/presets/${userData[0].id}`);
      if (!presetResponse.ok) throw new Error(`User presets request error! status: ${presetResponse.status}`);
      const presetArrJSON = await presetResponse.json();
      setPresetData(presetArrJSON);

      //calculate freq array after data loads
      if (defaultFreqJSON.length > 0) {
        const initialId = defaultFreqJSON[0].array_id;
        freqIdRef.current = initialId;
        freqObjRef.current = filterData(defaultFreqJSON, initialId, 'array_id');
        createFreqArray();
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
    freqObjRef.current = filterData(freqData, freqIdRef.current, 'array_id');
  } else {
    freqObjRef.current = filterData(defaultFreqData.current, freqIdRef.current, 'array_id');
  }
  //console.log(filterData(freqData, freqIdRef.current, 'array_id'));
  createFreqArray();
}

const filterData = (dataArr, id, key) => {
	const o = dataArr.filter(obj => obj[key] === id);
  return o[0];
}

const createFreqArray = () => {
  const arr = [];
  const obj = freqObjRef.current;
    for(let i = 1.0; i < 9; i++){
      arr.push(obj.base_freq * i * obj.multiplier);
    }
    setFreqArray(arr);
}

//console.log(`index data: ${indexData}`);
//console.log(`preset data: ${presetData}`);

  return (
    <>
      <h1>Multiplier API Dev</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>} 
      <ul>
        {freqData.map(item => (
          <li key={item.array_id}>Preset: {item.array_id}, Base Frequency: {item.base_freq}, Multiplier: {item.multiplier}</li>
          
        ))}
      </ul>
      <label htmlFor="freqId">Frequency Array:</label>
  <select ref={freqIdRef} name="freqId" id="freqId" onChange={handleSelect} style={{marginLeft: "10px"}}>
    <option value={1}>DEFAULT</option>
    {freqData.map(item => 
    item.array_id > 1 && (
      <option key={item.array_id} value={item.array_id}>{item.array_name}</option>
    ))}
    </select>
    <p><span style={{fontWeight: "bold"}}>In Hertz: </span>{freqArray ? freqArray.join(', ') : 'Loading frequency array...'}</p>
    <p>Index Array: </p>
    <p>Preset Data: </p>
      
    </>
  );
}

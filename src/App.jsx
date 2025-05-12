import "./App.css";
import { useEffect, useRef, useState } from "react";
import Sequencer1 from "./assets/components/Sequencer1";

export default function App() {
 
 const [data, setData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [freqArray, setFreqArray] = useState();
 const freqIdRef = useRef(0);
 const freqObjRef = useRef(null);
 //const currentFreqArrData = useRef(null);
 
 useEffect(() => {
  const fetchData = async () => {
    try {
      const initResponse = await fetch('http://localhost:8888/wp-json/wp/v2/users');
      if (!initResponse.ok) throw new Error(`Initial HHTP error. status: ${initResponse.status}`);
      const userData = await initResponse.json();
      const response = await fetch(`http://localhost:8888/wp-json/multiplier-api/v1/freq-arrays/${userData[0].id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);

      //calculate freq array after data loads
      if (json.length > 0) {
        const initialId = json[0].array_id;
        freqIdRef.current = initialId;
        freqObjRef.current = filterData(json, initialId, 'array_id');
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
  freqObjRef.current = filterData(data, freqIdRef.current, 'array_id');
  console.log(filterData(data, freqIdRef.current, 'array_id'));
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
  return (
    <>
      <h1>Multiplier API Dev</h1>
      {loading && '<p>Loading...</p>'}
      {error && <p>Error: {error.message}</p>} 
      <ul>
        {data.map(item => (
          <li key={item.array_id}>Preset: {item.array_id}, Base Frequency: {item.base_freq}, Multiplier: {item.multiplier}</li>
          
        ))}
      </ul>
      <label htmlFor="freqId">Frequency Array:</label>
  <select ref={freqIdRef} name="freqId" id="freqId" onChange={handleSelect} style={{marginLeft: "10px"}}>
    <option value={1}>DEFAULT</option>
    {data.map(item => 
    item.array_id > 1 && (
      <option key={item.array_id} value={item.array_id}>{item.array_name}</option>
    ))}
    </select>
    <p><span style={{fontWeight: "bold"}}>In Hertz: </span>{freqArray ? freqArray.join(', ') : 'Loading frequency array...'}</p>
   
      
    </>
  );
}

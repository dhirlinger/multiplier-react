import "./App.css";
import { useEffect, useRef, useState } from "react";
import FreqArray from "./components/FreqArray";
import IndexArray from "./components/IndexArray";
import PresetArray from "./components/PresetArray";
import WaveShapeSelect from "./components/WaveShapeSelect";
import SeqArrInput from "./components/SeqArrInput";
import SeqVoice from "./assets/SeqVoice";
import LowPassFilter from "./components/LowPassFilter";

export default function App() {
  //preset + rest api related vars
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
  const loginStatusRef = useRef([]);
  //audio api + sequencer related vars
  const [waveshape, setWaveshape] = useState("square");
  const seqArrayRef = useRef([]);
  const seqInstance = useRef(null);
  const [seqTempo, setSeqTempo] = useState("600");
  const [duration, setDuration] = useState("0.05");
  const [lowPassFreq, setLowPassFreq] = useState("15000");
  const [lowPassQ, setLowPassQ] = useState("0");
  const [seqIsPlaying, setSeqIsPlaying] = useState(false);
  const [base, setBase] = useState("110");
  const [multiplier, setMultiplier] = useState("2");
  const [index, setIndex] = useState();
  const [seqVoiceArr, setSeqVoiceArr] = useState();
  const [statusCode, setStatusCode] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //get freq arrays for user 1
        const freqResponse = await fetch(
          `http://192.168.1.195:8888/wp-json/multiplier-api/v1/freq-arrays/1`
        );
        if (!freqResponse.ok)
          throw new Error(
            `User frequency arrays request error! status: ${freqResponse.status}`
          );
        const freqArrJSON = await freqResponse.json();
        setFreqData(freqArrJSON);
        //get index arrays for current user
        const indexResponse = await fetch(
          `http://192.168.1.195:8888/wp-json/multiplier-api/v1/index-arrays/1`
        );
        if (!indexResponse.ok)
          throw new Error(
            `User index array request error! status: ${indexResponse.status}`
          );
        const indexArrJSON = await indexResponse.json();
        setIndexData(indexArrJSON);
        //get presets for current user
        const presetResponse = await fetch(
          `http://192.168.1.195:8888/wp-json/multiplier-api/v1/presets/1`
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
        // if (indexArrJSON.length > 0) {
        //   indexIdRef.current = "1";
        //   setIndexObj(filterData(indexArrJSON, indexIdRef.current, "array_id"));
        // }
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

  useEffect(() => {
    console.log(window.MultiplierAPI); // check if it exists
    if (!window.MultiplierAPI) return;

    fetch(window.MultiplierAPI.restUrl + "multiplier-api/v1/login-status", {
      method: "GET",
      credentials: "include",
      headers: {
        "X-WP-Nonce": window.MultiplierAPI.nonce,
      },
    })
      .then((res) => res.json())
      .then((data) => () => {
        loginStatusRef.current = data;
      })
      .catch((err) => console.error(err));

    console.log("Login Status:", loginStatusRef.current);
  }, []);

  useEffect(() => {
    freqObj && setBase(freqObj.base_freq);
    freqObj && setMultiplier(freqObj.multiplier);
  }, [freqObj]);

  //preset + rest api related func's
  const handleFreqSelect = (e) => {
    freqIdRef.current = e.target.value;
    setFreqObj(filterData(freqData, freqIdRef.current, "array_id"));
  };

  const handleIndexSelect = (e) => {
    indexIdRef.current = e.target.value;
    setIndexObj(filterData(indexData, indexIdRef.current, "array_id"));
  };

  const handlePresetSelect = (e) => {
    console.log(e);
    if (e != null) {
      presetIdRef.current = e.target.value;
      setPresetObj(filterData(presetData, presetIdRef.current, "preset_id"));
      setFreqObj(filterData(freqData, presetObj.freq_array_id, "array_id"));
      setIndexObj(filterData(indexData, presetObj.index_array_id, "array_id"));
      setWaveshape(presetObj.waveshape);
      setDuration(presetObj.duration);
      setLowPassFreq(presetObj.lowpass_freq);
      setLowPassQ(presetObj.lowpass_q);
    }
  };

  const refreshFreqObj = () => {
    setBase(freqObj.base_freq);
    setMultiplier(freqObj.multiplier);
  };

  const refreshIndexObj = () => {
    if (indexObj) {
      const refreshedObj = { ...indexObj };
      seqArrayRef.current = refreshedObj.index_array.split(",");
      console.log("refresh IO: " + JSON.stringify(refreshedObj));
      setIndexObj(refreshedObj);
    }
    // const refreshedId = indexIdRef.current;
    // setIndexObj(filterData(indexData, refreshedId, "array_id"));
  };

  const filterData = (data, id, key) => {
    const o = data.filter((obj) => obj[key] === id);
    console.log(`filterData: ${JSON.stringify(o[0])}`);
    return o[0];
  };

  //audio api + sequencer related func's
  useEffect(() => {
    if (indexObj) {
      seqArrayRef.current = indexObj.index_array.split(",");
      console.log(`indexObj useEff seqArr = ${seqArrayRef.current}`);
    }
  }, [indexObj]);

  useEffect(() => {
    seqInstance.current = new SeqVoice(600);
    seqInstance.current.onBeatCallback = (beatNumber) => {
      setIndex(beatNumber);
    };
    seqInstance.current.statusCallback = (code) => {
      setStatusCode(code);
      if (code === 0) setSeqIsPlaying(false);
    };
  }, []);

  // useEffect(() => {
  //   seqInstance.current.onBeatCallback = (beatNumber) => {
  //     // setIndex(beatNumber);
  //     if (onIndexChange) {
  //       onIndexChange(beatNumber);
  //     }
  //   };
  // }, [onIndexChange]);

  useEffect(() => {
    seqInstance.current.arrCallback = (array) => {
      setSeqVoiceArr([...array]);
    };
  }, []);

  useEffect(() => {
    if (seqTempo > 99 && seqTempo < 1001) {
      seqInstance.current.tempo = seqTempo;
    }
  }, [seqTempo]);

  useEffect(() => {
    seqInstance.current.noteLength = Number(duration);
  }, [duration]);

  useEffect(() => {
    seqInstance.current.shape = waveshape;
  }, [waveshape]);

  useEffect(() => {
    seqInstance.current.lowPassFreq = lowPassFreq;
  }, [lowPassFreq]);

  useEffect(() => {
    seqInstance.current.qValue = lowPassQ;
  }, [lowPassQ]);

  useEffect(() => {
    seqInstance.current.base = base;
  }, [base]);

  useEffect(() => {
    seqInstance.current.multiplier = multiplier;
  }, [multiplier]);

  useEffect(() => {
    seqInstance.current.arrayHold = seqArrayRef.current;
    console.log(`seqIns Arr: ${seqArrayRef.current}`);
  }, [indexObj]);

  const handleClick = () => {
    setSeqIsPlaying(!seqIsPlaying);
    seqInstance.current.startStop(seqArrayRef.current);
  };

  const handleShapeChange = (event) => {
    setWaveshape(event.target.value);
  };

  const getStatus = () => {
    switch (statusCode) {
      case 0:
        return "Index Array is Empty";
      case 1:
        return "OK";
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: "0", marginTop: "0" }}>Multiplier:</h1>
      <p style={{ marginTop: "0" }}>
        Multiplier is a step sequencer. There are 8 frequencies contained in the
        frequency array. Sequence the order of the those values and change those
        values by changing the base frequency and multiplier values. The base
        frequency is multiplied by each position number (index) in the array to
        create the frequency array. However, the first value is the base value
        itself, and the second is the base x multiplier only (except if
        multiplier = 1), and the third through eight are valued at 2-7
        respectively.
      </p>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <PresetArray
        presetData={presetData}
        presetIdRef={presetIdRef}
        handleSelect={handlePresetSelect}
        presetObj={presetObj}
      />

      <FreqArray
        freqData={freqData}
        freqIdRef={freqIdRef}
        handleSelect={handleFreqSelect}
        freqObj={freqObj}
        base={base}
        setBase={setBase}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        refreshFreqObj={refreshFreqObj}
        presetObj={presetObj}
      />

      <WaveShapeSelect waveshape={waveshape} handleChange={handleShapeChange} />

      <IndexArray
        indexData={indexData}
        indexIdRef={indexIdRef}
        handleSelect={handleIndexSelect}
        indexObj={indexObj}
        refreshIndexObj={refreshIndexObj}
      />

      <SeqArrInput arrIndex={0} seqArrayRef={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={1} seqArrayRef={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={2} seqArrayRef={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={3} seqArrayRef={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={4} seqArrayRef={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={5} seqArrayRef={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={6} seqArrayRef={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={7} seqArrayRef={seqArrayRef} indexObj={indexObj} />

      <div>
        <span style={{ width: "50px" }}>tempo: </span>
        <input
          style={{ marginTop: "10px", marginRight: "10px", width: "50px" }}
          type="number"
          value={seqTempo}
          onChange={(e) => {
            const tempo = e.target.value;
            setSeqTempo(tempo);
          }}
        ></input>
        <span style={{ width: "100px" }}>duration: </span>
        <input
          type="range"
          max="1.0"
          min="0.05"
          step="0.05"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <span style={{ width: "50px" }}>{Number(duration).toFixed(2)}</span>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleClick}>
          {seqIsPlaying ? "Stop" : "Play Seq"}
        </button>
      </div>
      <LowPassFilter
        value={lowPassFreq}
        setValue={setLowPassFreq}
        qValue={lowPassQ}
        setQValue={setLowPassQ}
      />
      <p>{index}</p>
      <p>seqVoiceArr: {seqVoiceArr}</p>
      <p>{getStatus()}</p>
    </>
  );
}

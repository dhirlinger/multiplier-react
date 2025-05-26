import "./App.css";
import { useEffect, useRef, useState } from "react";
import FreqArray from "./components/FreqArray";
import IndexArray from "./components/IndexArray";
import PresetArray from "./components/PresetArray";
import WaveShapeSelect from "./components/WaveShapeSelect";
import SeqArrInput from "./components/SeqArrInput";
import SeqVoice from "./assets/SeqVoice";
import LowPassFilter from "./components/LowPassFilter";
import BaseMultiplier from "./components/BaseMultiplier";

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
    }
  };

  const filterData = (data, id, key) => {
    const o = data.filter((obj) => obj[key] === id);
    console.log(o[0]);
    return o[0];
  };

  //audio api + sequencer related func's
  useEffect(() => {
    if (indexObj) {
      seqArrayRef.current = indexObj.index_array.split(",");
    }
  }, [indexObj]);

  useEffect(() => {
    seqInstance.current = new SeqVoice(600);
    seqInstance.current.onBeatCallback = (beatNumber) => {
      setIndex(beatNumber);
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

  const handleClick = () => {
    setSeqIsPlaying(!seqIsPlaying);
    seqInstance.current.startStop(seqArrayRef.current);
  };

  const handleShapeChange = (event) => {
    setWaveshape(event.target.value);
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

      <PresetArray
        presetData={presetData}
        presetIdRef={presetIdRef}
        handleSelect={handlePresetSelect}
        presetObj={presetObj}
      />

      <h2 style={{ marginBottom: "0", marginTop: "0" }}>Sequencer:</h2>
      <p style={{ marginTop: "0" }}>
        There are 8 frequency values accessable from the frequency slider.
        Sequence up to 8 positions on the slider (1-8). Enter 0 for a rest in
        the sequence. Empty boxes will result in a shorter sequence.
      </p>

      <WaveShapeSelect waveshape={waveshape} handleChange={handleShapeChange} />

      <IndexArray
        indexData={indexData}
        indexIdRef={indexIdRef}
        handleSelect={handleIndexSelect}
        indexObj={indexObj}
      />

      <SeqArrInput arrIndex={0} array={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={1} array={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={2} array={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={3} array={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={4} array={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={5} array={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={6} array={seqArrayRef} indexObj={indexObj} />
      <SeqArrInput arrIndex={7} array={seqArrayRef} indexObj={indexObj} />

      <BaseMultiplier
        base={base}
        setBase={setBase}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
      />

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
    </>
  );
}

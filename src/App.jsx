import "./App.css";
import { useEffect, useRef, useState } from "react";
import FreqArray from "./components/FreqArray";
import IndexArray from "./components/IndexArray";
import PresetArray from "./components/PresetArray";
import WaveShapeSelect from "./components/WaveShapeSelect";
import SeqArrInput from "./components/SeqArrInput";
import SeqVoice from "./assets/SeqVoice";
import LowPassFilter from "./components/LowPassFilter";
import {
  presetDefault,
  freqArrDefault,
  indexArrDefault,
} from "./assets/default";

export default function App() {
  //preset + rest api related vars
  const [freqData, setFreqData] = useState([]);
  const [indexData, setIndexData] = useState([]);
  const [presetData, setPresetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //const freqIdRef = useRef(0);
  const [freqId, setFredId] = useState();
  const [freqObj, setFreqObj] = useState();
  //const indexIdRef = useRef(0);
  const [indexId, setIndexId] = useState();
  const [indexObj, setIndexObj] = useState();
  const [indexPresetName, setIndexPresetName] = useState();
  const presetIdRef = useRef(0);
  const [presetObj, setPresetObj] = useState();
  const loginStatusRef = useRef({});
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
    // check if it exists
    if (window.MultiplierAPI) {
      //get login-status data
      console.log(`first nonce: ${window.MultiplierAPI.nonce}`);
      fetch(window.MultiplierAPI.restUrl + "multiplier-api/v1/login-status", {
        method: "GET",
        credentials: "include",
        headers: {
          "X-WP-Nonce": window.MultiplierAPI.nonce,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          loginStatusRef.current = data;
          console.log("ref:", loginStatusRef.current);
          //get index array, freq array, and preset data
          fetchPresetData();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      fetchPresetData();
    }
  }, []);

  const fetchPresetData = async () => {
    //for development assign userID to 1 if there is no user_id
    const userID = loginStatusRef.current.user_id
      ? loginStatusRef.current.user_id
      : 1;
    console.log(`user: ${userID}`);
    try {
      //get freq arrays for user 1
      const freqResponse = await fetch(
        `http://192.168.1.195:8888/wp-json/multiplier-api/v1/freq-arrays/${userID}`
      );
      if (!freqResponse.ok)
        throw new Error(
          `User frequency arrays request error! status: ${freqResponse.status}`
        );
      const freqArrJSON = await freqResponse.json();
      //if there are no presets for this user freqData = freqArrDefault
      freqArrJSON.array_id
        ? setFreqData(freqArrJSON)
        : setFreqData(freqArrDefault);
      //get index arrays for current user
      const indexResponse = await fetch(
        `http://192.168.1.195:8888/wp-json/multiplier-api/v1/index-arrays/${userID}`
      );
      if (!indexResponse.ok)
        throw new Error(
          `User index array request error! status: ${indexResponse.status}`
        );
      const indexArrJSON = await indexResponse.json();
      setIndexData(indexArrJSON);
      //get presets for current user
      const presetResponse = await fetch(
        `http://192.168.1.195:8888/wp-json/multiplier-api/v1/presets/${userID}`
      );
      if (!presetResponse.ok)
        throw new Error(
          `User presets request error! status: ${presetResponse.status}`
        );
      const presetArrJSON = await presetResponse.json();
      setPresetData(presetArrJSON);
      //calculate freq array after data loads if there is data
      if (freqArrJSON.length > 0) {
        const initialId = freqArrJSON[0].array_id;
        //freqIdRef.current = initialId;
        setFredId(initialId);
        setFreqObj(filterData(freqArrJSON, initialId, "array_id"));
        //otherwise setFreqObj (ie load preset) from 1st array of freqArrDefault
      } else {
        freqArrDefault &&
          setFreqObj(filterData(freqArrDefault, "1", "array_id"));
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  //add default presets to data arrays function
  const addDefault = (dataArr, defaultArr) => {
    defaultArr.map((preset) => {
      dataArr.unshift(preset);
    });
  };
  //add default presets to data arrays - this is only called if the user has data
  useEffect(() => {
    if (!loginStatusRef.current.user_id === 1) {
      addDefault(indexData, indexArrDefault);
      addDefault(freqData, freqArrDefault);
      addDefault(presetData, presetDefault);
    }
  }, [indexData, freqData, presetData]);

  useEffect(() => {
    freqObj && setBase(freqObj.base_freq);
    freqObj && setMultiplier(freqObj.multiplier);
  }, [freqObj]);

  //preset + rest api related func's
  const handleFreqSelect = (e) => {
    //freqIdRef.current = e.target.value;
    setFredId(e.target.value);
    setFreqObj(filterData(freqData, e.target.value, "array_id"));
  };

  const handleIndexSelect = (e) => {
    //indexIdRef.current = e.target.value;
    setIndexId(e.target.value);
    setIndexObj(filterData(indexData, e.target.value, "array_id"));
  };

  const handlePresetSelect = (e) => {
    console.log(e);
    if (e != null) {
      presetIdRef.current = e.target.value;
      const selectedObj = filterData(
        presetData,
        presetIdRef.current,
        "preset_id"
      );
      setPresetObj(selectedObj);
      setFreqObj(filterData(freqData, selectedObj.freq_array_id, "array_id"));
      setFredId(selectedObj.freq_array_id);
      //indexIdRef.current = selectedObj.index_array_id;
      setIndexId(selectedObj.index_array_id);
      setIndexObj(
        filterData(indexData, selectedObj.index_array_id, "array_id")
      );
      setWaveshape(selectedObj.params_json.wave_shape);
      setDuration(selectedObj.params_json.duration);
      setLowPassFreq(selectedObj.params_json.lowpass_freq);
      setLowPassQ(selectedObj.params_json.lowpass_q);
      setSeqTempo(selectedObj.params_json.tempo);
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
      setIndexObj(refreshedObj);
    }
  };

  const refreshPresetObj = () => {
    if (presetObj) {
      const selectedObj = { ...presetObj };
      setPresetObj(selectedObj);
      setWaveshape(selectedObj.params_json.wave_shape);
      setDuration(selectedObj.params_json.duration);
      setLowPassFreq(selectedObj.params_json.lowpass_freq);
      setLowPassQ(selectedObj.params_json.lowpass_q);
      setSeqTempo(selectedObj.params_json.tempo);
      // if presetObj contains freq arr id make necessary copies for synchronous freq array updates
      if (selectedObj.freq_array_id) {
        //freqIdRef.current = selectedObj.freq_array_id;
        setFredId(selectedObj.freq_array_id);
        const refreshedFreqObj = filterData(
          freqData,
          selectedObj.freq_array_id,
          "array_id"
        );
        setFreqObj(refreshedFreqObj);
        setBase(refreshedFreqObj.base_freq);
        setMultiplier(refreshedFreqObj.multiplier);
      }
      // if presetObj contains index array id create refreshedIndexObj update seqArrayRef and reset indexObj
      if (selectedObj.index_array_id) {
        console.log(`ind arr: ${selectedObj.index_array_id}`);
        const refreshedIndexObj = filterData(
          indexData,
          selectedObj.index_array_id,
          "array_id"
        );
        seqArrayRef.current = refreshedIndexObj.index_array.split(",");
        setIndexObj({ ...refreshedIndexObj });
        setIndexId(selectedObj.index_array_id);
      }
    }
  };

  const filterData = (data, id, key) => {
    const o = data.filter((obj) => obj[key] === id);
    console.log(`filterData: ${JSON.stringify(o[0])}`);
    return o[0];
  };

  const saveIndexPreset = async () => {
    if (!loginStatusRef.current.logged_in) {
      alert("You must login via patreon to access this feature");
      return;
    } else {
      // console.log(seqArrayRef.current);
      console.log(window.MultiplierAPI.nonce);
      try {
        const url = `${window.MultiplierAPI.restUrl}multiplier-api/v1/index-arrays/`;
        const data = JSON.stringify({
          index_array: seqArrayRef.current.join(),
          array_name: indexPresetName,
          preset_number: 2,
          user_id: loginStatusRef.current.user_id,
        });
        console.log(data);
        const response = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: {
            "X-WP-Nonce": window.MultiplierAPI.nonce,
            "Content-Type": "application/json",
          },
          body: data,
        });
        const result = await response.json();
        console.log("Success:", result);
      } catch (error) {
        console.log(`User post index array preset error! status: ${error}`);
      }
    }
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

  //save this function for visual sync later
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
  // status codes/messages from SeqVoice.js
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

      {!loginStatusRef.current.logged_in && (
        <p
          style={{
            marginBottom: "5px",
            marginTop: "5px",
            backgroundColor: "#630c0cff",
            color: "#fafafaff",
          }}
        >
          To save and recall your own presets and to use MIDI functionality you
          must be a member of
          <b>
            {" "}
            <a
              href="https://www.patreon.com/user?u=90105560&amp;utm_source=http%3A%2F%2Flocalhost%3A8888%2Fpatreon-test-post%2F&amp;utm_medium=patreon_wordpress_plugin&amp;utm_campaign=14548621&amp;utm_term=&amp;utm_content=creator_profile_link_in_text_over_interface"
              target="_blank"
            >
              Doug’s Patreon
            </a>{" "}
            at $3{" "}
          </b>{" "}
          or more.{" "}
          <a
            href="http://localhost:8888/patreon-flow/?patreon-unlock-post=8"
            target="_blank"
          >
            Unlock with Patreon
          </a>{" "}
          Already a qualifying Patreon member?{" "}
          <a
            href="http://localhost:8888/patreon-flow/?patreon-login=yes&amp;patreon-final-redirect=http%3A%2F%2Flocalhost%3A8888%2Fpatreon-test-post"
            rel="nofollow"
          >
            Refresh
          </a>{" "}
          to access this content.
        </p>
      )}

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
        refreshPresetObj={refreshPresetObj}
      />

      <FreqArray
        freqData={freqData}
        //freqIdRef={freqIdRef}
        freqId={freqId}
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
        //indexIdRef={indexIdRef}
        indexId={indexId}
        handleSelect={handleIndexSelect}
        indexObj={indexObj}
        refreshIndexObj={refreshIndexObj}
        indexPresetName={indexPresetName}
        setIndexPresetName={setIndexPresetName}
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
      <button onClick={saveIndexPreset}>Save Index Array</button>
    </>
  );
}

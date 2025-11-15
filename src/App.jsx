import "./App.css";
import { useEffect, useRef, useState } from "react";
import FreqArray from "./components/FreqArray";
import IndexArray from "./components/IndexArray";
import WaveShapeSelect from "./components/WaveShapeSelect";
import SeqArrInput from "./components/SeqArrInput";
import SeqVoice from "./assets/SeqVoice";
import LowPassFilter from "./components/LowPassFilter";
import {
  presetDefault,
  freqArrDefault,
  indexArrDefault,
} from "./assets/default";
import PresetUI from "./components/PresetUI";
import PatreonBanner from "./components/PatreonBanner";
import AppDescription from "./components/AppDescription";
import { normalizePresets, filterData } from "./assets/helpers";
import useFetch from "./hooks/useFetch";

export default function App() {
  //preset + rest api related vars
  const [freqData, setFreqData] = useState([]);
  const [indexData, setIndexData] = useState([]);
  const [presetData, setPresetData] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  //const freqIdRef = useRef(0);
  const [freqId, setFreqId] = useState();
  const [freqObj, setFreqObj] = useState();

  //const indexIdRef = useRef(0);
  const [indexId, setIndexId] = useState();
  const [indexObj, setIndexObj] = useState();
  const [indexPresetName, setIndexPresetName] = useState("");
  const [indexPresetNum, setIndexPresetNum] = useState("");
  const presetIdRef = useRef(0);
  const [globalPresetNum, setGlobalPresetNum] = useState("");
  const [globalPresetName, setGlobalPresetName] = useState("");
  const [freqPresetNum, setFreqPresetNum] = useState("");
  const [freqPresetName, setFreqPresetName] = useState("");
  const [presetObj, setPresetObj] = useState();
  const loginStatusRef = useRef({});
  const baseMultiplierParamsRef = useRef({});

  // initialize hook
  const { get, post, del, loading, error } = useFetch(
    window.MultiplierAPI?.restUrl || "http://192.168.1.195:8888/wp-json/",
    window.MultiplierAPI?.nonce || ""
  );

  //preset ui input text control
  const [globalInputRecalled, setGlobalInputRecalled] = useState(false);
  const [freqInputRecalled, setFreqInputRecalled] = useState(false);
  const [indexInputRecalled, setIndexInputRecalled] = useState(false);
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

  let userSettings = {};

  useEffect(() => {
    const init = async () => {
      try {
        if (window.MultiplierAPI) {
          const data = await get("multiplier-api/v1/login-status");
          loginStatusRef.current = data; // ✅ now properly defined
        }
      } catch (err) {
        console.error(err);
      } finally {
        fetchPresetData();
      }
    };
    init();
  }, []);

  const fetchPresetData = async () => {
    const userID = loginStatusRef.current.user_id || null;
    console.log(`user: ${userID}`);
    if (userID === null) {
      setFreqData(freqArrDefault);
      setIndexData(indexArrDefault);
      setPresetData(presetDefault);
      setLocalLoading(false);
      return;
    }
    try {
      const freqArrJSON = await get(`multiplier-api/v1/freq-arrays/${userID}`);
      //if there are no presets for this user freqData = freqArrDefault
      freqArrJSON[0].array_id
        ? setFreqData(freqArrJSON)
        : setFreqData(freqArrDefault);
      //get index arrays for current user
      const indexArrJSON = await get(
        `multiplier-api/v1/index-arrays/${userID}`
      );
      setIndexData(indexArrJSON);
      //get presets for current user
      const presetArrJSON = await get(`multiplier-api/v1/presets/${userID}`);
      const normalizedGlobal = normalizePresets(presetArrJSON);
      setPresetData(normalizedGlobal);
      const normalizedFreqData = normalizePresets(freqArrJSON);
      //calculate freq array after data loads if there is data
      if (freqArrJSON.length > 0) {
        const initialId = freqArrJSON[0].array_id;
        //freqIdRef.current = initialId;
        setFreqId(initialId);
        setFreqObj(filterData(normalizedFreqData, initialId, "array_id"));
        //otherwise setFreqObj (ie load preset) from 1st array of freqArrDefault
      } else {
        freqArrDefault &&
          setFreqObj(filterData(normalizedFreqData, "1", "array_id"));
      }
    } catch (e) {
      setLocalError(e);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    userSettings = {};
  });

  useEffect(() => {
    freqObj && setBase(freqObj.base_freq);
    freqObj && setMultiplier(freqObj.multiplier);
  }, [freqObj]);

  //preset + rest api related func's

  let freqHandlerParams = {};

  useEffect(() => {
    freqHandlerParams.obj = freqObj;
    freqHandlerParams.presetNum = freqPresetNum;
    freqHandlerParams.refreshObj = refreshFreqObj;
    freqHandlerParams.data = freqData;
    freqHandlerParams.setId = setFreqId;
    (freqHandlerParams.preset_id = "array_id"),
      (freqHandlerParams.setObj = setFreqObj);
    freqHandlerParams.filterData = filterData;
  }, [freqObj, freqPresetNum, freqObj, freqData, freqId]);

  const handleFreqSelect = () => {
    if (freqObj && Number(freqObj.preset_number) === freqPresetNum) {
      refreshFreqObj();
      return;
    }

    const findByPresetNum = freqData.find(
      (item) => item && Number(item.preset_number) === freqPresetNum
    );

    if (findByPresetNum === undefined) {
      alert("EMPTY PRESET");
      return;
    } else {
      setFreqId(findByPresetNum.array_id);
      const selectedObj = filterData(
        freqData,
        findByPresetNum.array_id,
        "array_id"
      );
      console.log(`sel: ${JSON.stringify(selectedObj)}`);
      setFreqObj(selectedObj);
    }
  };

  const handleIndexSelect = () => {
    //indexIdRef.current = e.target.value;
    if (indexObj && Number(indexObj.preset_number) === indexPresetNum) {
      refreshIndexObj();
      return;
    }
    const findByPresetNum = indexData.find(
      (item) => item && Number(item.preset_number) === indexPresetNum
    );
    if (findByPresetNum === undefined) {
      alert("EMPTY PRESET");
      return;
    } else {
      setIndexId(findByPresetNum.array_id);
      const selectedObj = filterData(
        indexData,
        findByPresetNum.array_id,
        "array_id"
      );
      console.log(`sel: ${JSON.stringify(selectedObj)}`);
      setIndexObj(selectedObj);
    }
    // }
  };
  // setIndexId(e.target.value);
  // setIndexObj(filterData(indexData, e.target.value, "array_id"));

  const handlePresetSelect = () => {
    //if (e != null) {
    if (presetObj && Number(presetObj.preset_number) === globalPresetNum) {
      refreshPresetObj();
      return;
    }
    const findByPresetNum = presetData.find(
      (item) => item && Number(item.preset_number) === globalPresetNum
    );
    if (findByPresetNum === undefined) {
      alert("EMPTY PRESET");
      return;
    } else {
      presetIdRef.current = findByPresetNum.preset_id;
      const selectedObj = filterData(
        presetData,
        presetIdRef.current,
        "preset_id"
      );
      console.log(`sel: ${JSON.stringify(selectedObj)}`);
      setPresetObj(selectedObj);
      //setGlobalPresetName(selectedObj.name);
      // const selectedFreqObj = filterData(
      //   freqData,
      //   selectedObj.freq_array_id,
      //   "array_id"
      // );
      // console.log(`sel freq: ${JSON.stringify(selectedFreqObj)}`);
      // setFreqObj(selectedFreqObj);
      // setFreqId(selectedObj.freq_array_id);
      // setFreqPresetNum(Number(selectedFreqObj.preset_number));
      // //setFreqPresetName(selectedFreqObj.name);
      // setFreqInputRecalled(true);
      // setIndexId(selectedObj.index_array_id);
      // setIndexObj(
      //   filterData(indexData, selectedObj.index_array_id, "array_id")
      // );
      setWaveshape(selectedObj.params_json.wave_shape);
      setDuration(selectedObj.params_json.duration);
      setLowPassFreq(selectedObj.params_json.lowpass_freq);
      setLowPassQ(selectedObj.params_json.lowpass_q);
      setSeqTempo(selectedObj.params_json.tempo);
    }
    // }
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
      // if (selectedObj.freq_array_id) {
      //   //freqIdRef.current = selectedObj.freq_array_id;
      //   setFreqId(selectedObj.freq_array_id);
      //   const refreshedFreqObj = filterData(
      //     freqData,
      //     selectedObj.freq_array_id,
      //     "array_id"
      //   );
      //setFreqObj(refreshedFreqObj);
      //setFreqPresetNum(Number(refreshedFreqObj.preset_number));
      //setFreqInputRecalled(true);
      // setBase(refreshedFreqObj.base_freq);
      // setMultiplier(refreshedFreqObj.multiplier);

      // if presetObj contains index array id create refreshedIndexObj update seqArrayRef and reset indexObj
      // if (selectedObj.index_array_id) {
      //   console.log(`ind arr: ${selectedObj.index_array_id}`);
      //   const refreshedIndexObj = filterData(
      //     indexData,
      //     selectedObj.index_array_id,
      //     "array_id"
      //   );
      //   seqArrayRef.current = refreshedIndexObj.index_array.split(",");
      //   setIndexObj({ ...refreshedIndexObj });
      //   setIndexId(selectedObj.index_array_id);
      // }
    }
  };

  const save = async (path, saveJSON) => {
    const result = await post(`multiplier-api/v1/${path}`, saveJSON);
    const setFunctions = (path) => {
      const normalizedData = normalizePresets(result.updated_data);
      console.log(`norm: ${JSON.stringify(normalizedData)}`);
      if (path === "presets") {
        setPresetData(normalizedData);
        setGlobalInputRecalled(true);
      } else if (path === "freq-arrays") {
        setFreqData(normalizedData);
        setFreqInputRecalled(true);
      } else if (path === "index-arrays") {
        setIndexData(normalizedData);
        setIndexInputRecalled(true);
      }
    };
    setFunctions(path);
  };

  const saveGlobalPreset = () => {
    if (!loginStatusRef.current.logged_in) {
      alert("You must login via patreon to access this feature");
      return;
    } else {
      if (globalPresetNum < 1 || globalPresetNum > 50) {
        alert("Preset Number must be 1-50");
        return;
      } else {
        const findByPresetNum = presetData.find(
          (item) => item && Number(item.preset_number) === globalPresetNum
        );

        const globalSaveJSON = {
          name: globalPresetName,
          preset_number: globalPresetNum,
          user_id: loginStatusRef.current.user_id,
          params_json: {
            tempo: seqTempo,
            duration: duration,
            lowpass_q: lowPassQ,
            wave_shape: waveshape,
            lowpass_freq: lowPassFreq,
          },
        };

        if (findByPresetNum === undefined) {
          save("presets", globalSaveJSON);
          return;
        } else {
          if (
            confirm(
              `Overwrite Preset ${globalPresetNum} with ${globalPresetName}?`
            )
          ) {
            save("presets", globalSaveJSON);
          } else {
            return;
          }
        }
      }
    }
  };

  const saveFreqPreset = () => {
    if (!loginStatusRef.current.logged_in) {
      alert("You must login via patreon to access this feature");
      return;
    } else {
      if (freqPresetNum < 1 || freqPresetNum > 50) {
        alert("Preset Number must be 1-50");
        return;
      } else {
        const findByPresetNum = freqData.find(
          (item) => item && Number(item.preset_number) === freqPresetNum
        );

        const freqSaveJSON = {
          name: freqPresetName,
          preset_number: freqPresetNum,
          base_freq: base,
          multiplier: multiplier,
          user_id: loginStatusRef.current.user_id,
          params_json: {
            base_max: baseMultiplierParamsRef.current.base_max,
            base_min: baseMultiplierParamsRef.current.base_min,
            base_step: baseMultiplierParamsRef.current.base_step,
            multiplier_min: baseMultiplierParamsRef.current.multiplier_min,
            multiplier_max: baseMultiplierParamsRef.current.multiplier_max,
            multiplier_step: baseMultiplierParamsRef.current.multiplier_step,
          },
        };

        console.log(JSON.stringify(freqSaveJSON));

        if (findByPresetNum === undefined) {
          save("freq-arrays", freqSaveJSON);
          return;
        } else {
          if (
            confirm(`Overwrite Preset ${freqPresetNum} with ${freqPresetName}?`)
          ) {
            save("freq-arrays", freqSaveJSON);
          } else {
            return;
          }
        }
      }
    }
  };

  const saveIndexPreset = async () => {
    if (!loginStatusRef.current.logged_in) {
      alert("You must login via patreon to access this feature");
      return;
    } else {
      if (indexPresetNum < 1 || indexPresetNum > 50) {
        alert("Preset Number must be 1-50");
        return;
      } else {
        const findByPresetNum = indexData.find(
          (item) => item && Number(item.preset_number) === indexPresetNum
        );

        const indexSaveJSON = {
          index_array: seqArrayRef.current.join(),
          name: indexPresetName,
          preset_number: indexPresetNum,
          user_id: loginStatusRef.current.user_id,
        };

        if (findByPresetNum === undefined) {
          save("index-arrays", indexSaveJSON);
          return;
        } else {
          if (
            confirm(
              `Overwrite Preset ${indexPresetNum} with ${indexPresetName}?`
            )
          ) {
            save("index-arrays", indexSaveJSON);
          } else {
            return;
          }
        }
      }
    }
  };

  const deleteGlobalPreset = async () => {
    if (!loginStatusRef.current.logged_in) {
      alert("You must login via patreon to access this feature");
      return;
    }
    if (globalPresetNum === undefined) {
      alert("Please select a preset to delete!");
      return;
    }
    if (confirm(`Delete Preset ${globalPresetNum}: ${globalPresetName}?`)) {
      const findByPresetNum = presetData.find(
        (item) => item && Number(item.preset_number) === globalPresetNum
      );

      const result = await del(
        `multiplier-api/v1/presets/delete/${findByPresetNum.preset_id}`
      );
      console.log("Result:", result);
      const normalizedGlobal = normalizePresets(result.updated_data);
      setPresetData(normalizedGlobal);
    }
  };

  const deleteFreqPreset = async () => {
    if (!loginStatusRef.current.logged_in) {
      alert("You must login via patreon to access this feature");
      return;
    }
    if (freqPresetNum === undefined) {
      alert("Please select a preset to delete!");
      return;
    }
    if (confirm(`Delete Preset ${freqPresetNum}: ${freqPresetName}?`)) {
      const findByPresetNum = freqData.find(
        (item) => item && Number(item.preset_number) === freqPresetNum
      );

      const result = await del(
        `multiplier-api/v1/freq-arrays/delete/${findByPresetNum.array_id}`
      );
      console.log("Result:", result);
      const normalizedData = normalizePresets(result.updated_data);
      setFreqData(normalizedData);
    }
  };

  const deleteIndexPreset = async () => {
    return;
  };

  // useEffect(() => {
  //   freqData.sort((a, b) => a.preset_number - b.preset_number);
  // }, [freqData]);

  // useEffect(() => {
  //   presetData.sort((a, b) => a.preset_number - b.preset_number);
  // }, [presetData]);

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
    <div className="flex flex-col max-w-sm min-w-xs items-center justify-center m-auto min-h-96 p-2">
      <PatreonBanner loginStatusRef={loginStatusRef} />

      <AppDescription />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <PresetUI
        data={presetData}
        presetNum={globalPresetNum}
        presetName={globalPresetName}
        setPresetNum={setGlobalPresetNum}
        setPresetName={setGlobalPresetName}
        recallPreset={handlePresetSelect}
        savePreset={saveGlobalPreset}
        deletePreset={deleteGlobalPreset}
        inputRecalled={globalInputRecalled}
        setInputRecalled={setGlobalInputRecalled}
        category={"Global"}
      />

      <PresetUI
        data={freqData}
        presetNum={freqPresetNum}
        presetName={freqPresetName}
        setPresetNum={setFreqPresetNum}
        setPresetName={setFreqPresetName}
        recallPreset={handleFreqSelect}
        savePreset={saveFreqPreset}
        deletePreset={deleteFreqPreset}
        inputRecalled={freqInputRecalled}
        setInputRecalled={setFreqInputRecalled}
        category={"Frequency Array"}
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
        baseMultiplierParamsRef={baseMultiplierParamsRef}
      />

      <WaveShapeSelect waveshape={waveshape} handleChange={handleShapeChange} />

      <PresetUI
        data={indexData}
        presetNum={indexPresetNum}
        presetName={indexPresetName}
        setPresetNum={setIndexPresetNum}
        setPresetName={setIndexPresetName}
        recallPreset={handleIndexSelect}
        savePreset={saveIndexPreset}
        deletePreset={deleteIndexPreset}
        inputRecalled={indexInputRecalled}
        setInputRecalled={setIndexInputRecalled}
        category={"Index Array"}
      />

      {/* <IndexArray
        indexData={indexData}
        //indexIdRef={indexIdRef}
        indexId={indexId}
        handleSelect={handleIndexSelect}
        indexObj={indexObj}
        refreshIndexObj={refreshIndexObj}
        indexPresetName={indexPresetName}
        setIndexPresetName={setIndexPresetName}
        indexPresetNum={indexPresetNum}
        setIndexPresetNum={setIndexPresetNum}
      /> */}
      <div className="flex">
        <SeqArrInput
          arrIndex={0}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
        />
        <SeqArrInput
          arrIndex={1}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
        />
        <SeqArrInput
          arrIndex={2}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
        />
        <SeqArrInput
          arrIndex={3}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
        />
        <SeqArrInput
          arrIndex={4}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
        />
        <SeqArrInput
          arrIndex={5}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
        />
        <SeqArrInput
          arrIndex={6}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
        />
        <SeqArrInput
          arrIndex={7}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
        />
      </div>

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
          min="0.01"
          step="0.01"
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
      {/* <p>{JSON.stringify(indexData)}</p> */}
    </div>
  );
}

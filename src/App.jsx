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
import { recall } from "./assets/handlers";

export default function App() {
  //preset + rest api related vars
  const [freqData, setFreqData] = useState([]);
  const [indexData, setIndexData] = useState([]);
  const [presetData, setPresetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  //preset ui input text control
  const [globalInputRecalled, setGlobalInputRecalled] = useState(false);
  const [freqInputRecalled, setFreqInputRecalled] = useState(false);
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
      : null;
    console.log(`user: ${userID}`);
    if (userID === null) {
      setFreqData(freqArrDefault);
      setIndexData(indexArrDefault);
      setPresetData(presetDefault);
      setLoading(false);
      return;
    }
    try {
      //get freq arrays for user 1
      const freqResponse = await fetch(
        `http://192.168.1.195:8888/wp-json/multiplier-api/v1/freq-arrays/${userID}`
        //`http://localhost:8888/wp-json/multiplier-api/v1/freq-arrays/${userID}`
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
        //`http://localhost:8888/wp-json/multiplier-api/v1/index-arrays/${userID}`
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
        //`http://localhost:8888/wp-json/multiplier-api/v1/presets/${userID}`
      );
      if (!presetResponse.ok)
        throw new Error(
          `User presets request error! status: ${presetResponse.status}`
        );
      const presetArrJSON = await presetResponse.json();
      //console.log(`data: ${JSON.stringify(presetArrJSON)}`);
      const normalizedGlobal = normalizePresets(presetArrJSON);
      //addEmptyPresets(normalizedGlobal);
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
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  //add default presets to data arrays function
  // const addDefault = (dataArr, defaultArr) => {
  //   defaultArr.map((preset) => {
  //     dataArr.unshift(preset);
  //   });
  // };
  //add default presets to data arrays if there is no user id
  // useEffect(() => {
  //   if (!loginStatusRef.current.user_id) {
  //     addDefault(indexData, indexArrDefault);
  //     addDefault(freqData, freqArrDefault);
  //     addDefault(presetData, presetDefault);
  //   }
  // }, [indexData, freqData, presetData]);

  useEffect(() => {
    freqObj && setBase(freqObj.base_freq);
    freqObj && setMultiplier(freqObj.multiplier);
  }, [freqObj]);

  //preset + rest api related func's
  const normalizePresets = (arr, num = 50, key = "preset_number") => {
    const filled = Array(num).fill(null);
    arr.forEach((item) => {
      const slot = item[key]; // usually 1–50
      if (slot >= 1 && slot <= num) {
        filled[slot - 1] = item;
      }
    });
    return filled;
  };

  // const addEmptyPresets = (arr) => {
  //   const presetNums = [];
  //   arr.forEach((item) => {
  //     if (item !== null) {
  //       presetNums.push(item.preset_number);
  //     }
  //   });
  //   for (let i = 1; i < 51; i++) {
  //     if (!presetNums.includes(i.toString())) {
  //       const firstNull = arr.findIndex((item) => item === null);
  //       if (firstNull !== -1) {
  //         arr[firstNull] = {
  //           preset_number: i.toString(),
  //           name: "EMPTY",
  //           params_json: {},
  //           index_array_id: null,
  //           freq_array_id: null,
  //           user_id: loginStatusRef.current.user_id
  //             ? loginStatusRef.current.user_id
  //             : null,
  //         };
  //       }
  //     }
  //   }
  // };

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

  const handleIndexSelect = (e) => {
    //indexIdRef.current = e.target.value;
    setIndexId(e.target.value);
    setIndexObj(filterData(indexData, e.target.value, "array_id"));
  };

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
      setFreqObj(filterData(freqData, selectedObj.freq_array_id, "array_id"));
      setFreqId(selectedObj.freq_array_id);
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
      if (selectedObj.freq_array_id) {
        //freqIdRef.current = selectedObj.freq_array_id;
        setFreqId(selectedObj.freq_array_id);
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
    const o = data.filter((obj) => obj && obj[key] === id);
    //console.log(`filterData: ${JSON.stringify(o[0])}`);
    return o[0];
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

        const globalSaveJSON = JSON.stringify({
          name: globalPresetName,
          preset_number: globalPresetNum,
          index_array_id: indexId,
          freq_array_id: freqId,
          user_id: loginStatusRef.current.user_id,
          params_json: {
            tempo: seqTempo,
            duration: duration,
            lowpass_q: lowPassQ,
            wave_shape: waveshape,
            lowpass_freq: lowPassFreq,
            base_max: baseMultiplierParamsRef.current.base_max,
            base_min: baseMultiplierParamsRef.current.base_min,
            base_step: baseMultiplierParamsRef.current.base_step,
            multiplier_min: baseMultiplierParamsRef.current.multiplier_min,
            multiplier_max: baseMultiplierParamsRef.current.multiplier_max,
            multiplier_step: baseMultiplierParamsRef.current.multiplier_step,
          },
        });

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

  const save = async (path, saveJSON) => {
    try {
      const url = `${window.MultiplierAPI.restUrl}multiplier-api/v1/${path}`;
      const data = saveJSON;
      //console.log(`data: ${data}`);
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
      console.log("Result:", result);
      const setFunctions = (path) => {
        if (path === "presets") {
          const normalizedGlobal = normalizePresets(result.updated_data);
          setPresetData(normalizedGlobal);
          setGlobalInputRecalled(true);
        }
      };
      setFunctions(path);
    } catch (error) {
      console.log(`User post preset error! status: ${error}`);
    }
  };

  const saveFreqPreset = () => {
    return;
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
      try {
        const url = `${window.MultiplierAPI.restUrl}multiplier-api/v1/presets/delete/${findByPresetNum.preset_id}`;
        const response = await fetch(url, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-WP-Nonce": window.MultiplierAPI.nonce,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        console.log("Result:", result);
        const normalizedGlobal = normalizePresets(result.updated_data);
        setPresetData(normalizedGlobal);
      } catch (error) {
        console.log(`delete global preset error! status: ${error}`);
      }
    }
  };

  const saveIndexPreset = async () => {
    if (!loginStatusRef.current.logged_in) {
      alert("You must login via patreon to access this feature");
      return;
    } else {
      try {
        const url = `${window.MultiplierAPI.restUrl}multiplier-api/v1/index-arrays/`;
        const data = JSON.stringify({
          index_array: seqArrayRef.current.join(),
          name: indexPresetName,
          preset_number: indexPresetNum,
          user_id: loginStatusRef.current.user_id,
        });
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
        setIndexData([...result.updated_data]);
        //sortArr(indexData, setIndexData);
      } catch (error) {
        console.log(`User post index array preset error! status: ${error}`);
      }
    }
  };

  const deleteFreqPreset = () => {
    return;
  };

  //keep data in order by preset_number
  const sortArr = (data, setData) => {
    const sortedArr = [...data];
    sortedArr.sort((a, b) => a.preset_number - b.preset_number);
    setData(sortedArr);
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

      <IndexArray
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
      />
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

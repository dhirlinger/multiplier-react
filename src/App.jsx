import "./App.css";
import { useEffect, useRef, useState } from "react";
import FreqArray from "./components/FreqArray";
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
import {
  normalizePresets,
  filterData,
  findByPresetNum,
  scaleMidiExp,
  scaleMidiToStep,
  scaleMidiToSteppedFloat,
} from "./assets/helpers";
import useFetch from "./hooks/useFetch";
import ConfirmOverlay from "./components/ConfirmOverlay";
import MidiMappingOverlay from "./components/MidiMappingOverlay";
import usePresetActions from "./hooks/usePresetActions";
import MidiTest from "./components/MidiTest";
import { MidiProvider } from "./context/MidiContext";
import IndexColumnSlider from "./components/IndexColumnSlider";
import IndexArraySliders from "./components/IndexArraySliders";

export default function App() {
  //preset + rest api related vars
  const [freqData, setFreqData] = useState([]);
  const [indexData, setIndexData] = useState([]);
  const [presetData, setPresetData] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [freqObj, setFreqObj] = useState();
  const [indexObj, setIndexObj] = useState();
  const [indexPresetName, setIndexPresetName] = useState("");
  const [indexPresetNum, setIndexPresetNum] = useState("");
  const [globalPresetNum, setGlobalPresetNum] = useState("");
  const [globalPresetName, setGlobalPresetName] = useState("");
  const [freqPresetNum, setFreqPresetNum] = useState("");
  const [freqPresetName, setFreqPresetName] = useState("");
  const [presetObj, setPresetObj] = useState();
  const loginStatusRef = useRef({ logged_in: false, user_id: null });
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
  const [bpm, setBpm] = useState("120");
  const [subdivision, setSubdivision] = useState("4");
  const [duration, setDuration] = useState("0.05");
  const [lowPassFreq, setLowPassFreq] = useState("15000");
  const [lowPassQ, setLowPassQ] = useState("0");
  const [seqIsPlaying, setSeqIsPlaying] = useState(false);
  const [base, setBase] = useState("110");
  const [multiplier, setMultiplier] = useState("2");
  const [index, setIndex] = useState();
  const [seqVoiceArr, setSeqVoiceArr] = useState();
  const [statusCode, setStatusCode] = useState(1);
  //global preset checkboxes
  const [globalFreqRecall, setGlobalFreqRecall] = useState(true);
  const [globalIndexRecall, setGlobalIndexRecall] = useState(true);
  //confirm overlay display toggle w ref obj for dynamic props
  const [displayConfirm, setDisplayConfirm] = useState(false);
  const confirmPropsRef = useRef({}); //preset num, name, action(str), filler(str)[ with/:], handler
  //`${action} Preset ${num}${filler} ${name}?`
  const [displayMidiMapping, setDisplayMidiMapping] = useState(false);
  const [midiMappingCategory, setMidiMappingCategory] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.MultiplierAPI) {
          const data = await get("multiplier-api/v1/login-status");
          loginStatusRef.current = data;
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

  // for usePresetActions
  const freqDataRef = useRef(freqData);
  const indexDataRef = useRef(indexData);
  const presetDataRef = useRef(presetData);

  useEffect(() => {
    freqDataRef.current = freqData;
  }, [freqData]);

  useEffect(() => {
    indexDataRef.current = indexData;
  }, [indexData]);

  useEffect(() => {
    presetDataRef.current = presetData;
  }, [presetData]);

  useEffect(() => {
    freqObj && setBase(freqObj.base_freq);
    freqObj && setMultiplier(freqObj.multiplier);
  }, [freqObj]);

  //preset + rest api related func's

  let freqHandlerParams = {};

  useEffect(() => {
    freqHandlerParams.obj = freqObj;
    freqHandlerParams.presetNum = freqPresetNum;
    // freqHandlerParams.refreshObj = refreshFreqObj;
    freqHandlerParams.data = freqData;
    (freqHandlerParams.preset_id = "array_id"),
      (freqHandlerParams.setObj = setFreqObj);
    freqHandlerParams.filterData = filterData;
  }, [freqObj, freqPresetNum, freqObj, freqData]);

  useEffect(() => {
    if (!globalInputRecalled) return;
    if (!presetObj || !presetObj.params_json) return;

    const p = presetObj.params_json;

    p.wave_shape && setWaveshape(p.wave_shape);
    p.duration && setDuration(p.duration);
    p.lowpass_freq && setLowPassFreq(p.lowpass_freq);
    p.lowpass_q && setLowPassQ(p.lowpass_q);
    p.bpm && setBpm(p.bpm);
    p.subdivision && setSubdivision(p.subdivision);
    if (presetObj.freq_json && globalFreqRecall) {
      setBase(presetObj.freq_json.base_freq);
      setMultiplier(presetObj.freq_json.multiplier);
      freqInputRecalled && setFreqInputRecalled(false);
    }
    if (presetObj.index_array && globalIndexRecall) {
      seqArrayRef.current = presetObj.index_array.split(",");
      indexInputRecalled && setIndexInputRecalled(false);
    }
  }, [globalInputRecalled, presetObj]);

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
      const findBy = findByPresetNum(presetData, globalPresetNum);

      const currentObj = filterData(presetData, findBy.preset_id, "preset_id");

      const selectedObj = { ...currentObj };
      setPresetObj(selectedObj);
    }
  };

  const freqActions = usePresetActions({
    refreshObj: refreshFreqObj,
    dataRef: freqDataRef,
    setData: setFreqData,
    setObj: setFreqObj,
    idField: "array_id",
    setInputRecalled: setFreqInputRecalled,
    setDisplayConfirm,
    savePath: "freq-arrays",
    deletePath: "freq-arrays/delete",
    buildSaveJSON: () => ({
      name: freqPresetName,
      preset_number: freqPresetNum,
      base_freq: base,
      multiplier: multiplier,
      user_id: loginStatusRef.current.user_id,
      params_json: { ...baseMultiplierParamsRef.current },
    }),
    post,
    del,
    loginStatusRef,
    confirmPropsRef,
  });

  const indexActions = usePresetActions({
    refreshObj: refreshIndexObj,
    dataRef: indexDataRef,
    setData: setIndexData,
    setObj: setIndexObj,
    idField: "array_id",
    setInputRecalled: setIndexInputRecalled,
    setDisplayConfirm,
    savePath: "index-arrays",
    deletePath: "index-arrays/delete",
    buildSaveJSON: () => ({
      index_array: seqArrayRef.current.join(),
      name: indexPresetName,
      preset_number: indexPresetNum,
      user_id: loginStatusRef.current.user_id,
    }),
    post,
    del,
    loginStatusRef,
    confirmPropsRef,
  });

  const globalPresetActions = usePresetActions({
    refreshObj: refreshPresetObj,
    dataRef: presetDataRef,
    setData: setPresetData,
    setObj: setPresetObj,
    idField: "preset_id",
    setInputRecalled: setGlobalInputRecalled,
    setDisplayConfirm,
    savePath: "presets",
    deletePath: "presets/delete",
    buildSaveJSON: () => ({
      name: globalPresetName,
      preset_number: globalPresetNum,
      user_id: loginStatusRef.current.user_id,
      params_json: {
        bpm: bpm,
        subdivision: subdivision,
        duration: duration,
        lowpass_q: lowPassQ,
        wave_shape: waveshape,
        lowpass_freq: lowPassFreq,
      },
      freq_json: {
        base_freq: base,
        multiplier: multiplier,
        base_max: baseMultiplierParamsRef.current.base_max,
        base_min: baseMultiplierParamsRef.current.base_min,
        base_step: baseMultiplierParamsRef.current.base_step,
        multiplier_min: baseMultiplierParamsRef.current.multiplier_min,
        multiplier_max: baseMultiplierParamsRef.current.multiplier_max,
        multiplier_step: baseMultiplierParamsRef.current.multiplier_step,
      },
      index_array: seqArrayRef.current.join(),
    }),
    post,
    del,
    loginStatusRef,
    confirmPropsRef,
  });

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
    const effectiveBPM = bpm * subdivision;
    if (effectiveBPM >= 100 && effectiveBPM <= 1800) {
      seqInstance.current.tempo = effectiveBPM;
    }
  }, [bpm, subdivision]);

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
  }, [indexObj, presetObj]);

  const toggleSequencer = () => {
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

  // MIDI action mapping
  const midiActions = {
    start_stop: () => toggleSequencer(),

    subdivision_recall: ({ value }) => setSubdivision(value),
    subdivision_list_up: () => {
      // TODO: Navigate up in subdivision list
      console.log("Subdivision list up");
    },
    subdivision_list_down: () => {
      // TODO: Navigate down in subdivision list
      console.log("Subdivision list down");
    },

    preset_recall: ({ category, presetNum }) => {
      if (category === "global_preset") {
        globalPresetActions.handleSelect(presetNum, presetObj?.preset_number);
        const findBy = findByPresetNum(presetData, presetNum);
        setGlobalPresetNum(presetNum);
        setGlobalPresetName(findBy?.name || "-EMPTY-");
        setGlobalInputRecalled(true);
      } else if (category === "freq_preset") {
        freqActions.handleSelect(presetNum, freqObj?.preset_number);
        const findBy = findByPresetNum(freqData, presetNum);
        setFreqPresetNum(presetNum);
        setFreqPresetName(findBy?.name || "-EMPTY-");
        setFreqInputRecalled(true);
      } else if (category === "index_preset") {
        indexActions.handleSelect(presetNum, indexObj?.preset_number);
        const findBy = findByPresetNum(indexData, presetNum);
        setIndexPresetNum(presetNum);
        setIndexPresetName(findBy?.name || "-Empty-");
        setIndexInputRecalled(true);
      }
    },

    preset_list_up: ({ category }) => {
      // TODO: Navigate up in preset list
      console.log("Preset list up:", category);
    },
    preset_list_down: ({ category }) => {
      // TODO: Navigate down in preset list
      console.log("Preset list down:", category);
    },
    preset_list_random: ({ category }) => {
      // TODO: Random from preset list
      console.log("Preset list random:", category);
    },

    multiplier_cc: ({ value }) => {
      // TODO: Map CC value (0-127) to multiplier range
      console.log("Multiplier CC:", value);
    },
    base_cc: ({ value }) => {
      // TODO: Map CC value to base range
      console.log("Base CC:", value);
    },
    duration_cc: ({ value }) => {
      setDuration(scaleMidiToSteppedFloat(value, 0.01, 1));
      console.log("Duration CC:", value);
    },
    lowpass_freq_cc: ({ value }) => {
      setLowPassFreq(scaleMidiExp(value, 500, 15000));
      console.log("LowPass Freq CC:", value);
    },
    lowpass_q_cc: ({ value }) => {
      setLowPassQ(scaleMidiToStep(value, 0, 22));
      console.log("LowPass Q CC:", value);
    },

    index_input_cc: ({ index, value }) => {
      // TODO: Map CC value to index array input
      console.log(`Index input ${index} CC:`, value);
    },
  };

  const handleMidiAction = (action) => {
    console.log("MIDI Action received:", action);
    midiActions[action.type]?.(action);
  };

  return (
    <MidiProvider onMidiAction={handleMidiAction}>
      <div className="flex flex-col max-w-sm min-w-xs items-center justify-center m-auto min-h-96 p-2">
        <PatreonBanner loginStatusRef={loginStatusRef} />

        <MidiTest />

        <AppDescription />
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}

        <PresetUI
          data={presetData}
          presetNum={globalPresetNum}
          presetName={globalPresetName}
          setPresetNum={setGlobalPresetNum}
          setPresetName={setGlobalPresetName}
          recallPreset={globalPresetActions.handleSelect}
          savePreset={globalPresetActions.confirmSave}
          deletePreset={globalPresetActions.confirmDelete}
          inputRecalled={globalInputRecalled}
          setInputRecalled={setGlobalInputRecalled}
          category={"Global"}
          globalFreqRecall={globalFreqRecall}
          setGlobalFreqRecall={setGlobalFreqRecall}
          globalIndexRecall={globalIndexRecall}
          setGlobalIndexRecall={setGlobalIndexRecall}
          obj={presetObj}
          setMidiMappingCategory={setMidiMappingCategory}
          setDisplayMidiMapping={setDisplayMidiMapping}
        />

        <PresetUI
          data={freqData}
          presetNum={freqPresetNum}
          presetName={freqPresetName}
          setPresetNum={setFreqPresetNum}
          setPresetName={setFreqPresetName}
          recallPreset={freqActions.handleSelect}
          savePreset={freqActions.confirmSave}
          deletePreset={freqActions.confirmDelete}
          inputRecalled={freqInputRecalled}
          setInputRecalled={setFreqInputRecalled}
          category={"Frequency Array"}
          obj={freqObj}
          setMidiMappingCategory={setMidiMappingCategory}
          setDisplayMidiMapping={setDisplayMidiMapping}
        />

        <FreqArray
          freqData={freqData}
          freqObj={freqObj}
          base={base}
          setBase={setBase}
          multiplier={multiplier}
          setMultiplier={setMultiplier}
          refreshFreqObj={refreshFreqObj}
          presetObj={presetObj}
          baseMultiplierParamsRef={baseMultiplierParamsRef}
          globalFreqRecall={globalFreqRecall}
        />

        <WaveShapeSelect
          waveshape={waveshape}
          handleChange={handleShapeChange}
        />

        <PresetUI
          data={indexData}
          presetNum={indexPresetNum}
          presetName={indexPresetName}
          setPresetNum={setIndexPresetNum}
          setPresetName={setIndexPresetName}
          recallPreset={indexActions.handleSelect}
          savePreset={indexActions.confirmSave}
          deletePreset={indexActions.confirmDelete}
          inputRecalled={indexInputRecalled}
          setInputRecalled={setIndexInputRecalled}
          category={"Index Array"}
          obj={indexObj}
          setMidiMappingCategory={setMidiMappingCategory}
          setDisplayMidiMapping={setDisplayMidiMapping}
        />

        <ConfirmOverlay
          confirmProps={confirmPropsRef}
          displayConfirm={displayConfirm}
          onClose={() => {
            setDisplayConfirm(false);
          }}
        />

        <MidiMappingOverlay
          displayMidiMapping={displayMidiMapping}
          onClose={() => setDisplayMidiMapping(false)}
          category={midiMappingCategory || "global_preset"}
        />

        <IndexArraySliders
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
        />
        {/* <div className="flex">
          <SeqArrInput
            arrIndex={0}
            seqArrayRef={seqArrayRef}
            indexObj={indexObj}
            presetObj={presetObj}
            globalIndexRecall={globalIndexRecall}
          />
          <SeqArrInput
            arrIndex={1}
            seqArrayRef={seqArrayRef}
            indexObj={indexObj}
            presetObj={presetObj}
            globalIndexRecall={globalIndexRecall}
          />
          <SeqArrInput
            arrIndex={2}
            seqArrayRef={seqArrayRef}
            indexObj={indexObj}
            presetObj={presetObj}
            globalIndexRecall={globalIndexRecall}
          />
          <SeqArrInput
            arrIndex={3}
            seqArrayRef={seqArrayRef}
            indexObj={indexObj}
            presetObj={presetObj}
            globalIndexRecall={globalIndexRecall}
          />
          <SeqArrInput
            arrIndex={4}
            seqArrayRef={seqArrayRef}
            indexObj={indexObj}
            presetObj={presetObj}
            globalIndexRecall={globalIndexRecall}
          />
          <SeqArrInput
            arrIndex={5}
            seqArrayRef={seqArrayRef}
            indexObj={indexObj}
            presetObj={presetObj}
            globalIndexRecall={globalIndexRecall}
          />
          <SeqArrInput
            arrIndex={6}
            seqArrayRef={seqArrayRef}
            indexObj={indexObj}
            presetObj={presetObj}
            globalIndexRecall={globalIndexRecall}
          />
          <SeqArrInput
            arrIndex={7}
            seqArrayRef={seqArrayRef}
            indexObj={indexObj}
            presetObj={presetObj}
            globalIndexRecall={globalIndexRecall}
          />
        </div> */}

        <div>
          <div>
            <label>BPM: </label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              style={{ marginTop: "10px", marginRight: "10px", width: "60px" }}
            />
            <label> Subdivision: </label>
            <input
              type="number"
              min="1"
              max="16"
              value={subdivision}
              onChange={(e) => setSubdivision(e.target.value)}
              className={
                bpm * subdivision >= 100 && bpm * subdivision <= 1800
                  ? "text-inherit"
                  : "text-mix"
              }
              style={{ width: "50px" }}
            />
          </div>
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
          <button onClick={toggleSequencer}>
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
      </div>
    </MidiProvider>
  );
}

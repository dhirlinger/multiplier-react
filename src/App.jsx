import "./App.css";
import { useEffect, useRef, useState, useCallback } from "react";
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
import { normalizePresets, filterData } from "./assets/helpers";
import useFetch from "./hooks/useFetch";
import ConfirmOverlay from "./components/ConfirmOverlay";
import MidiMappingOverlay from "./components/MidiMappingOverlay";
import usePresetActions from "./hooks/usePresetActions";
import { MidiProvider } from "./context/MidiContext";
import IndexArraySliders from "./components/IndexArraySliders";
import Toggle from "./components/Toggle";
import StickyBottomControls from "./components/StickyBottomControls";
import Tempo from "./components/Tempo";
import Duration from "./components/Duration";
import useMidiActions from "./hooks/useMidiActions";

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
    window.MultiplierAPI?.nonce || "",
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

  // Display state for high-frequency audio parameters (for UI rendering)
  const [duration, setDuration] = useState("0.05");
  const [lowPassFreq, setLowPassFreq] = useState("15000");
  const [lowPassQ, setLowPassQ] = useState("0");
  const [base, setBase] = useState("110");
  const [multiplier, setMultiplier] = useState("2");

  // Ref for instant audio updates (bypasses React re-render cycle)
  const audioParamsRef = useRef({
    base: 110,
    multiplier: 2,
    duration: 0.05,
    lowPassFreq: 15000,
    lowPassQ: 0,
  });

  //for index UI midi mapping
  const updateIndexMidiRef = useRef([]);

  const [seqIsPlaying, setSeqIsPlaying] = useState(false);
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

  // Sequencer update mode: 'immediate' or 'next_loop'
  const [updateMode, setUpdateMode] = useState("immediate");
  // Sequencer play mode: 'loop' or 'one-shot'
  const [playMode, setPlayMode] = useState("loop");

  //For midi navigation of preset and subdivisions lists
  const [presetLists, setPresetLists] = useState({
    global_preset: [],
    freq_preset: [],
    index_preset: [],
  });

  const [subdivisionList, setSubdivisionList] = useState([]);

  const [cursorInTextBox, setCursorInTextBox] = useState(false);

  //for midi CRUD w MidiContext & MidiOverlay -> MidiPresetUI
  const [loggedIn, setLoggedIn] = useState(false);

  //for batching
  const pendingDisplayUpdates = useRef({});
  const frameRequested = useRef(false);

  // frame callback - processes all pending display updates at once
  const flushDisplayUpdates = useCallback(() => {
    const pending = pendingDisplayUpdates.current;

    if (pending.base !== undefined) setBase(pending.base);
    if (pending.multiplier !== undefined) setMultiplier(pending.multiplier);
    if (pending.duration !== undefined) setDuration(pending.duration);
    if (pending.lowPassFreq !== undefined) setLowPassFreq(pending.lowPassFreq);
    if (pending.lowPassQ !== undefined) setLowPassQ(pending.lowPassQ);

    // Clear pending updates and flag
    pendingDisplayUpdates.current = {};
    frameRequested.current = false;
  }, []);

  /**
   * update audio parameters instantly without waiting for React re-render.
   * Updates in order: ref (instant) → seqInstance (instant audio) → state (display update)
   * @param {string} param - Parameter name: 'base' | 'multiplier' | 'duration' | 'lowPassFreq' | 'lowPassQ'
   * @param {number|string} value - The new value
   */
  const setAudioParam = useCallback(
    (param, value) => {
      const numValue = Number(value);

      // 1. Update ref instantly (no re-render)
      audioParamsRef.current[param] = numValue;

      // 2. Update seqInstance instantly (immediate audio change)
      if (seqInstance.current) {
        switch (param) {
          case "base":
            if (value && value !== "") {
              seqInstance.current.base = numValue;
            }
            break;
          case "multiplier":
            seqInstance.current.multiplier = numValue;
            break;
          case "duration":
            seqInstance.current.noteLength = numValue;
            break;
          case "lowPassFreq":
            seqInstance.current.lowPassFreq = numValue;
            break;
          case "lowPassQ":
            seqInstance.current.qValue = numValue;
            break;
        }
      }

      // 3. Queue display update (batched to animation frame)
      pendingDisplayUpdates.current[param] = value;

      if (!frameRequested.current) {
        frameRequested.current = true;
        requestAnimationFrame(flushDisplayUpdates);
      }
    },
    [flushDisplayUpdates],
  );

  useEffect(() => {
    const init = async () => {
      try {
        if (window.MultiplierAPI) {
          const data = await get("multiplier-api/v1/login-status");
          loginStatusRef.current = data;
          if (data?.logged_in) setLoggedIn(true);
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
        `multiplier-api/v1/index-arrays/${userID}`,
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

  // Update audio params when freqObj changes (preset recall)
  useEffect(() => {
    if (freqObj) {
      setAudioParam("base", freqObj.base_freq);
      setAudioParam("multiplier", freqObj.multiplier);
    }
  }, [freqObj, setAudioParam]);

  //preset + rest api related func's

  let freqHandlerParams = {};

  useEffect(() => {
    freqHandlerParams.obj = freqObj;
    freqHandlerParams.presetNum = freqPresetNum;
    // freqHandlerParams.refreshObj = refreshFreqObj;
    freqHandlerParams.data = freqData;
    ((freqHandlerParams.preset_id = "array_id"),
      (freqHandlerParams.setObj = setFreqObj));
    freqHandlerParams.filterData = filterData;
  }, [freqObj, freqPresetNum, freqObj, freqData]);

  // Global preset recall - uses setAudioParam for high-frequency params
  useEffect(() => {
    if (!globalInputRecalled) return;
    if (!presetObj || !presetObj.params_json) return;

    const p = presetObj.params_json;

    p.wave_shape && setWaveshape(p.wave_shape);
    // Use setAudioParam for high-frequency audio params (instant update)
    p.duration && setAudioParam("duration", p.duration);
    p.lowpass_freq && setAudioParam("lowPassFreq", p.lowpass_freq);
    p.lowpass_q && setAudioParam("lowPassQ", p.lowpass_q);
    p.bpm && setBpm(p.bpm);
    p.subdivision && setSubdivision(p.subdivision);
    if (presetObj.freq_json && globalFreqRecall) {
      setAudioParam("base", presetObj.freq_json.base_freq);
      setAudioParam("multiplier", presetObj.freq_json.multiplier);
      freqInputRecalled && setFreqInputRecalled(false);
    }
    if (presetObj.index_array && globalIndexRecall) {
      const newArray = presetObj.index_array.split(",");
      seqArrayRef.current = newArray;
      // Use updateArray to properly handle playback position
      if (seqInstance.current) {
        seqInstance.current.arrayHold = newArray;
      }
      indexInputRecalled && setIndexInputRecalled(false);
    }
  }, [globalInputRecalled, presetObj, setAudioParam]);

  useEffect(() => {
    console.log(`num: ${globalPresetNum} id: ${presetObj?.preset_id}`);
  });

  const refreshFreqObj = () => {
    setAudioParam("base", freqObj.base_freq);
    setAudioParam("multiplier", freqObj.multiplier);
  };

  const refreshIndexObj = () => {
    if (indexObj) {
      const refreshedObj = { ...indexObj };
      const newArray = refreshedObj.index_array.split(",");
      seqArrayRef.current = newArray;
      // Use updateArray to properly handle playback position
      if (seqInstance.current) {
        seqInstance.current.arrayHold = newArray;
      }
      setIndexObj(refreshedObj);
    }
  };

  const refreshPresetObj = () => {
    console.log("refresh called");
    if (presetObj) {
      //const findBy = findByPresetNum(presetData, globalPresetNum);

      //const currentObj = filterData(presetData, findBy.preset_id, "preset_id");
      const currentObj = filterData(
        presetData,
        presetObj.preset_id,
        "preset_id",
      );
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
      const newArray = indexObj.index_array.split(",");
      seqArrayRef.current = newArray;
      // Use updateArray to properly handle playback position
      if (seqInstance.current) {
        seqInstance.current.arrayHold = newArray;
      }
    }
  }, [indexObj]);

  // Initialize SeqVoice with initial audio param values from ref
  useEffect(() => {
    seqInstance.current = new SeqVoice(600);
    seqInstance.current.onBeatCallback = (beatNumber) => {
      setIndex(beatNumber);
    };
    seqInstance.current.statusCallback = (code) => {
      setStatusCode(code);
      //if (code === 0) setSeqIsPlaying(false);
      seqInstance.current.seqStopCallback = (message) => {
        if (message === "stop") {
          setSeqIsPlaying(false);
        }
      };
    };
    // Initialize seqInstance with current audioParamsRef values
    seqInstance.current.base = audioParamsRef.current.base;
    seqInstance.current.multiplier = audioParamsRef.current.multiplier;
    seqInstance.current.noteLength = audioParamsRef.current.duration;
    seqInstance.current.lowPassFreq = audioParamsRef.current.lowPassFreq;
    seqInstance.current.qValue = audioParamsRef.current.lowPassQ;
  }, []);

  // Sync update mode with SeqVoice instance
  useEffect(() => {
    if (seqInstance.current) {
      seqInstance.current.setUpdateMode(updateMode);
    }
  }, [updateMode]);

  //Sync play mode with SeqVoice instance
  useEffect(() => {
    if (seqInstance.current) {
      seqInstance.current.setPlayMode(playMode);
    }
  }, [playMode]);
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

  // BPM/subdivision - infrequent updates, OK to use useEffect
  useEffect(() => {
    const effectiveBPM = bpm * subdivision;
    if (effectiveBPM >= 20 && effectiveBPM <= 1800) {
      seqInstance.current.tempo = effectiveBPM;
    }
  }, [bpm, subdivision]);

  useEffect(() => {
    seqInstance.current.shape = waveshape;
  }, [waveshape]);

  useEffect(() => {
    seqInstance.current.arrayHold = seqArrayRef.current;
    console.log(`seqIns Arr: ${seqArrayRef.current}`);
  }, [indexObj, presetObj]);

  // wrap this in useCallBack
  const toggleSequencer = useCallback(() => {
    if (playMode === "one-shot" && seqIsPlaying === true) {
      seqInstance.current.startStop(seqArrayRef.current);
    } else {
      setSeqIsPlaying(!seqIsPlaying);
      seqInstance.current.startStop(seqArrayRef.current);
    }
  }, [seqIsPlaying]);

  // const togglePlayMode = useCallback(() => {
  //   if (playMode === "loop") {
  //     setPlayMode("one-shot");
  //   } else {
  //     setPlayMode("loop");
  //   }
  // }, [playMode]);

  const handleShapeChange = (event) => {
    setWaveshape(event.target.value);
  };

  // Handler for update mode toggle
  const handleUpdateModeChange = (mode) => {
    setUpdateMode(mode);
  };

  const handleUpdatePlayModeChange = (mode) => {
    setPlayMode(mode);
  };

  // Function to update array via SeqVoice.updateArray() - pass to child components
  const updateSeqArray = (newArray) => {
    seqArrayRef.current = newArray;
    if (seqInstance.current) {
      seqInstance.current.arrayHold = newArray;
    }
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!cursorInTextBox && e.key === " ") {
        e.preventDefault(); // stops page scroll
        toggleSequencer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSequencer, cursorInTextBox]);

  const { midiActions } = useMidiActions({
    toggleSequencer,
    setAudioParam,
    setWaveshape,
    subdivision,
    setSubdivision,
    presetLists,
    subdivisionList,
    globalPresetActions,
    freqActions,
    indexActions,
    presetData,
    freqData,
    indexData,
    presetObj,
    freqObj,
    indexObj,
    setGlobalPresetNum,
    setGlobalPresetName,
    setGlobalInputRecalled,
    setFreqPresetNum,
    setFreqPresetName,
    setFreqInputRecalled,
    setIndexPresetNum,
    setIndexPresetName,
    setIndexInputRecalled,
    globalPresetNum,
    freqPresetNum,
    indexPresetNum,
    updateIndexMidiRef,
    baseMultiplierParamsRef,
  });

  const handleMidiAction = (action) => {
    console.log("MIDI Action received:", action);
    midiActions[action.type]?.(action);
  };

  return (
    <MidiProvider
      onMidiAction={handleMidiAction}
      presetLists={presetLists} // local
      setPresetLists={setPresetLists} // local
      subdivisionList={subdivisionList}
      setSubdivisionList={setSubdivisionList}
      loginStatusRef={loginStatusRef}
      loggedIn={loggedIn}
    >
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
          setCursorInTextBox={setCursorInTextBox}
        />
        <div className="bg-maxbg mt-1 mb-1">
          {/*text-xs py-0.5 px-2 absolute top-0.5 right-1.25 border-pink-800 border bg-pink-600*/}
          <div className="flex justify-between items-center">
            <p className="text-sm ml-2 font-bold">Synth</p>
            <button
              className="text-xs py-0.5 px-2 border-pink-800 border bg-pink-600 mt-1 mr-2"
              onClick={() => {
                setMidiMappingCategory("synth/freq_params");
                setDisplayMidiMapping(true);
              }}
            >
              MAP
            </button>
          </div>
          <WaveShapeSelect
            waveshape={waveshape}
            handleChange={handleShapeChange}
          />

          {/* Duration now receives setAudioParam for instant updates */}
          <Duration duration={duration} setAudioParam={setAudioParam} />

          {/* LowPassFilter now receives setAudioParam for instant updates */}
          <LowPassFilter
            value={lowPassFreq}
            qValue={lowPassQ}
            setAudioParam={setAudioParam}
          />
        </div>

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
          setCursorInTextBox={setCursorInTextBox}
        />

        {/* FreqArray now receives setAudioParam for instant updates */}
        <FreqArray
          freqData={freqData}
          freqObj={freqObj}
          base={base}
          multiplier={multiplier}
          setAudioParam={setAudioParam}
          refreshFreqObj={refreshFreqObj}
          presetObj={presetObj}
          baseMultiplierParamsRef={baseMultiplierParamsRef}
          globalFreqRecall={globalFreqRecall}
          setMidiMappingCategory={setMidiMappingCategory}
          setDisplayMidiMapping={setDisplayMidiMapping}
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
          setCursorInTextBox={setCursorInTextBox}
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
          activeView={midiMappingCategory || "global_preset"}
          setActiveView={setMidiMappingCategory}
          loginStatusRef={loginStatusRef}
          setCursorInTextBox={setCursorInTextBox}
        />
        <div className="w-full flex justify-between items-center">
          <p className="text-sm ml-2 font-bold">Index Array</p>
          <button
            className="text-xs py-0.5 px-2 border-pink-800 border bg-pink-600 mt-1 mr-2"
            onClick={() => {
              setMidiMappingCategory("index_params");
              setDisplayMidiMapping(true);
            }}
          >
            MAP
          </button>
        </div>
        {/* Update Mode Toggle */}
        <div className="w-full flex gap-0.5 text-sm mt-1 mb-1 pt-1 pb-1 border-[0.5px] border-pink-500/90 bg-maxbg">
          <Toggle
            handleChange={handleUpdateModeChange}
            paramMode={updateMode}
            id="mode"
            param1={"immediate"}
            param2={"next_loop"}
          />
        </div>

        <IndexArraySliders
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          updateSeqArray={updateSeqArray}
          updateIndexMidiRef={updateIndexMidiRef}
        />
        {/* Play Mode Toggle */}
        <div className="w-full flex gap-0.5 text-sm mt-1 mb-1 pt-1 pb-1 border-[0.5px] border-pink-500/90 bg-maxbg">
          <Toggle
            handleChange={handleUpdatePlayModeChange}
            paramMode={playMode}
            id="playMode"
            param1={"loop"}
            param2={"one-shot"}
          />
        </div>

        <Tempo
          bpm={bpm}
          setBpm={setBpm}
          subdivision={subdivision}
          setSubdivision={setSubdivision}
          setDisplayMidiMapping={setDisplayMidiMapping}
          setMidiMappingCategory={setMidiMappingCategory}
        />

        <StickyBottomControls
          toggleSequencer={toggleSequencer}
          seqIsPlaying={seqIsPlaying}
          getStatus={getStatus}
          setMidiMappingCategory={setMidiMappingCategory}
          setDisplayMidiMapping={setDisplayMidiMapping}
          playMode={playMode}
        />
      </div>
    </MidiProvider>
  );
}

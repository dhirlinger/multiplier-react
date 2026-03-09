import { useEffect, useRef } from "react";
import { Arrow } from "./Icon";
import PreviewPresetParameters from "./PreviewPresetParameters";
import RecallCheckbox from "./RecallCheckbox";
import { findByPresetNum } from "../assets/helpers";

export default function PresetUI({
  data,
  presetNum,
  setPresetNum,
  presetName,
  setPresetName,
  recallPreset,
  savePreset,
  deletePreset,
  inputRecalled,
  setInputRecalled,
  category, //Global, Index Array, Frequency Array
  globalFreqRecall,
  setGlobalFreqRecall,
  globalIndexRecall,
  setGlobalIndexRecall,
  obj,
  handleMidiSelect,
  setCursorInTextBox,
}) {
  const findByPresetNumRef = useRef();

  const getMidiCategory = () => {
    if (category === "Index Array") {
      return "index_preset";
    }
    if (category === "Frequency Array") {
      return "freq_preset";
    }
    if (category === "Global") {
      return "global_preset";
    }
  };

  const midiCategory = getMidiCategory();

  const getColorClasses = () => {
    if (category === "Index Array") {
      return {
        border: "tw:border-pink-500/90",
        text: "tw:text-pink-500/90",
        selectedBorder: "tw:border-[#6DD7FF]",
        selectedText: "tw:text-[#6DD7FF]",
      };
    }
    if (category === "Frequency Array") {
      return {
        border: "tw:border-cyan-500",
        text: "tw:text-cyan-500",
        selectedBorder: "tw:border-pink-500",
        selectedText: "tw:text-pink-500",
      };
    }
    return {
      border: "tw:border-[#E6A60D]",
      text: "tw:text-[#E6A60D]",
      selectedBorder: "tw:border-[#6DD7FF]",
      selectedText: "tw:text-[#6DD7FF]",
    };
  };

  const colors = getColorClasses();

  useEffect(() => {
    findByPresetNumRef.current = data.find(
      (item) => item && Number(item.preset_number) === presetNum,
    );
  }, [presetNum, data]);

  //update preset name when preset number is updated
  useEffect(() => {
    if (presetNum === "" || presetNum === null) return;

    if (findByPresetNumRef.current === undefined) {
      setPresetName("-EMPTY-");
    } else {
      setPresetName(findByPresetNumRef.current.name || "");
    }
  }, [presetNum, data, setPresetName]);

  const handlePresetNum = (e) => {
    const value = e.target.value;
    // allow empty string
    if (!value) {
      setPresetNum("");
      return;
    }
    if (/^(?:[1-9]|[1-4][0-9]|50)$/.test(value)) {
      //recallPreset(e);
      setInputRecalled(false);
      setPresetNum(Number(value));
    }
  };

  const handlePresetNameChange = (e) => {
    const value = e.target.value;
    if (value === "-EMPTY-") {
      alert("-EMPTY- is a forbidden preset name.");
      return;
    }
    setPresetName(value);
  };

  const handleRightArrow = () => {
    setInputRecalled(false);
    setPresetNum((prev) => {
      if (prev === "" || prev >= 50) {
        return 1;
      } else {
        return prev + 1;
      }
    });
  };

  const handleLeftArrow = () => {
    setInputRecalled(false);
    setPresetNum((prev) => {
      if (prev === "" || prev <= 1) {
        return 50;
      } else {
        return prev - 1;
      }
    });
  };

  const handleFreqRecall = (e) => {
    setGlobalFreqRecall(e.target.checked);
  };

  const handleIndexRecall = (e) => {
    setGlobalIndexRecall(e.target.checked);
  };

  const divId = () => {
    if (category === "Index Array") {
      return {
        grid: "index-grid",
        container: "index-container",
      };
    }
    if (category === "Frequency Array") {
      return {
        grid: "frequency-grid",
        container: "frequency-container",
      };
    } else {
      return { grid: "global-grid", container: "global-container" };
    }
  };

  return (
    <>
      <div
        className="tw:text-4xl tw:text-center tw:max-w-sm tw:min-w-xs"
        id={divId().container}
      >
        <h3 className="tw:m-1.5">
          {/* ${category === "freq_preset" && "tw:text-sm"} */}
          <span className={`tw:bg-maxbg tw:px-1.5 tw:md:text-2xl`}>
            {category} Preset
          </span>
        </h3>
        <div
          className={`tw:flex tw:max-w-sm tw:min-w-xs tw:flex-wrap tw:justify-between tw:mb-1.5`}
        >
          <button
            className={`${colors.border} round`}
            onClick={() => {
              recallPreset(presetNum, obj?.preset_number);
            }}
          >
            RECALL
          </button>
          <button
            className={`${colors.border} round`}
            onClick={() => {
              savePreset(presetNum, presetName);
            }}
          >
            SAVE
          </button>
          <button
            className="round tw:border-red-600 tw:text-red-600"
            onClick={() => deletePreset(presetNum, presetName)}
          >
            DELETE
          </button>
          <button
            className={`${colors.border} round`}
            onClick={() => handleMidiSelect(midiCategory)}
          >
            MIDI
          </button>

          {/* GLOBAL CHECKBOXES */}
          {category === "Global" && (
            <div className="tw:flex tw:text-xs tw:text-transform: tw:uppercase">
              <RecallCheckbox
                stateRecall={globalFreqRecall}
                handleChange={handleFreqRecall}
                text={"recall freq params"}
              />
              <RecallCheckbox
                stateRecall={globalIndexRecall}
                handleChange={handleIndexRecall}
                text={"recall index array"}
              />
            </div>
          )}

          <div
            className={`tw:flex tw:mt-1 ${midiCategory === "freq_preset" ? "tw:md:mt-5" : ""}`}
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className={`preset-num tw:w-1/6 tw:aspect-square tw:border ${
                colors.border
              } tw:text-xl placeholder:tw:text-xl tw:text-center ${
                inputRecalled ? "tw:text-inherit" : "tw:text-mix"
              }`}
              placeholder="50"
              //min={1}
              max={50}
              maxLength={2}
              value={presetNum}
              onChange={handlePresetNum}
              //onInput={handleInput}
            ></input>
            <button
              className={`tw:flex tw:items-center tw:w-1/6 tw:aspect-square tw:p-0 tw:border ${colors.border} ${colors.text}`}
              onClick={handleLeftArrow}
            >
              <Arrow />
            </button>
            <input
              type="text"
              className={`preset-name tw:w-1/2 tw:border ${
                colors.border
              } tw:text-xl placeholder:tw:text-xl tw:text-center ${
                inputRecalled ? "tw:text-inherit" : "tw:text-mix"
              }`}
              placeholder="PRESET NAME"
              value={presetName}
              onChange={handlePresetNameChange}
              onFocus={() => setCursorInTextBox(true)}
              onBlur={() => setCursorInTextBox(false)}
              maxLength={15}
            ></input>
            <button
              className={`tw:flex tw:items-center tw:w-1/6 tw:aspect-square tw:p-0 tw:border ${colors.border} ${colors.text} tw:scale-x-[-1]`}
              onClick={handleRightArrow}
            >
              <Arrow />
            </button>
          </div>
        </div>
        <PreviewPresetParameters
          findByPresetNumRef={findByPresetNumRef}
          category={category}
          colors={colors}
        />
        {/*preset grid*/}
        <div
          className="tw:grid tw:grid-cols-10 tw:gap-0.5 tw:mt-2 tw:w-full"
          id={divId().grid}
        >
          {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => {
            const preset = findByPresetNum(data, num);
            const isCurrentPreset = num === presetNum;
            const gridClass =
              isCurrentPreset && preset
                ? `${colors.selectedBorder} ${colors.selectedText}`
                : isCurrentPreset && !preset
                  ? `${colors.selectedBorder} text-mix`
                  : preset
                    ? colors.border
                    : `${colors.border} tw:text-mix`;

            return (
              <button
                key={num}
                onClick={() => {
                  setPresetNum(num);
                  if (preset) {
                    recallPreset(num, obj?.preset_number);
                    setInputRecalled(true);
                  } else {
                    setInputRecalled(false);
                  }
                }}
                className={`
        tw:aspect-square tw:p-0 tw:text-xs tw:font-medium
        ${gridClass}
        tw:border hover:tw:bg-stone-700
      `}
                style={{ fontSize: "10px" }}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

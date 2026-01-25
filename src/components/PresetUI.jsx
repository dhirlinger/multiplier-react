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
  category,
  globalFreqRecall,
  setGlobalFreqRecall,
  globalIndexRecall,
  setGlobalIndexRecall,
  obj,
  setDisplayMidiMapping,
  setMidiMappingCategory,
}) {
  const findByPresetNumRef = useRef();

  const getColorClasses = () => {
    if (category === "Index Array") {
      return {
        border: "border-pink-500/90",
        text: "text-pink-500/90",
        selectedBorder: "border-[#6DD7FF]",
        selectedText: "text-[#6DD7FF]",
      };
    }
    if (category === "Frequency Array") {
      return {
        border: "border-cyan-500",
        text: "text-cyan-500",
        selectedBorder: "border-pink-500",
        selectedText: "text-pink-500",
      };
    }
    return {
      border: "border-[#E6A60D]",
      text: "text-[#E6A60D]",
      selectedBorder: "border-[#6DD7FF]",
      selectedText: "text-[#6DD7FF]",
    };
  };

  const colors = getColorClasses();

  useEffect(() => {
    findByPresetNumRef.current = data.find(
      (item) => item && Number(item.preset_number) === presetNum,
    );
    console.log(`findBy: ${JSON.stringify(findByPresetNumRef.current)}`);
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
      <div className="text-4xl text-center" id={divId().container}>
        <h3 className="m-1.5">
          <span className="bg-maxbg px-1.5">{category} Preset</span>
        </h3>
        <div className="flex max-w-sm min-w-xs flex-wrap justify-between mb-1.5">
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
            className="round border-red-600 text-red-600"
            onClick={() => deletePreset(presetNum, presetName)}
          >
            DELETE
          </button>
          <button
            className={`${colors.border} round`}
            onClick={() => {
              setDisplayMidiMapping(true);
              setMidiMappingCategory(category.toLowerCase().replace(" ", "_"));
            }}
          >
            MIDI
          </button>

          {/* GLOBAL CHECKBOXES */}
          {category === "Global" && (
            <div className="flex text-xs text-transform: uppercase">
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

          <div className="flex mt-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className={`preset-num w-1/6 aspect-square border ${
                colors.border
              } text-xl placeholder:text-xl text-center ${
                inputRecalled ? "text-inherit" : "text-mix"
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
              className={`flex items-center w-1/6 aspect-square p-0 border ${colors.border} ${colors.text}`}
              onClick={handleLeftArrow}
            >
              <Arrow />
            </button>
            <input
              type="text"
              className={`preset-name w-1/2 border ${
                colors.border
              } text-xl placeholder:text-xl text-center ${
                inputRecalled ? "text-inherit" : "text-mix"
              }`}
              placeholder="PRESET NAME"
              value={presetName}
              onChange={handlePresetNameChange}
              maxLength={15}
            ></input>
            <button
              className={`flex items-center w-1/6 aspect-square p-0 border ${colors.border} ${colors.text} scale-x-[-1]`}
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
          className="grid grid-cols-10 gap-0.5 mt-2 w-full"
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
                    : `${colors.border} text-mix`;

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
        aspect-square p-0 text-xs font-medium
        ${gridClass}
        border hover:bg-stone-700
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

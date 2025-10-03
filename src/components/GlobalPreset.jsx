import { useEffect, useRef, useState } from "react";
import { Arrow } from "./Icon";

export default function GlobalPreset({
  presetData,
  globalPresetNum,
  setGlobalPresetNum,
  globalPresetName,
  setGlobalPresetName,
  handlePresetSelect,
  saveGlobalPreset,
  deleteGlobalPreset,
  inputRecalled,
  setInputRecalled,
}) {
  //parameters view
  const [paramsVisible, setParamsVisible] = useState(false);

  const findByPresetNumRef = useRef();

  useEffect(() => {
    findByPresetNumRef.current = presetData.find(
      (item) => item && Number(item.preset_number) === globalPresetNum
    );
  }, [globalPresetNum, presetData]);

  //update preset name when preset number is updated
  useEffect(() => {
    if (globalPresetNum === "" || globalPresetNum === null) return;

    if (findByPresetNumRef.current === undefined) {
      setGlobalPresetName("-EMPTY-");
    } else {
      setGlobalPresetName(findByPresetNumRef.current.name);
    }
  }, [globalPresetNum, presetData]);

  const handlePresetNum = (e) => {
    const value = e.target.value;
    // allow empty string
    if (!value) {
      setGlobalPresetNum("");
      return;
    }
    if (/^(?:[1-9]|[1-4][0-9]|50)$/.test(value)) {
      //handlePresetSelect(e);
      setInputRecalled(false);
      setGlobalPresetNum(Number(value));
      console.log(`pre num: ${Number(value)}`);
    }
  };

  const handlePresetNameChange = (e) => {
    const value = e.target.value;
    if (value === "-EMPTY-") {
      alert("-EMPTY- is a forbidden preset name.");
      return;
    }
    setGlobalPresetName(value);
  };

  const handleRightArrow = () => {
    setInputRecalled(false);
    setGlobalPresetNum((prev) => {
      if (prev === "" || prev >= 50) {
        return 1;
      } else {
        return prev + 1;
      }
    });
  };

  const handleLeftArrow = () => {
    setInputRecalled(false);
    setGlobalPresetNum((prev) => {
      if (prev === "" || prev <= 1) {
        return 50;
      } else {
        return prev - 1;
      }
    });
  };

  return (
    <>
      <div className="text-4xl text-center">
        <h3 className="m-1.5">
          <span className="bg-maxbg px-1.5">Global Preset</span>
        </h3>
        <div className="flex max-w-sm min-w-xs flex-wrap justify-between mb-1.5">
          <button
            className="round"
            onClick={() => {
              setInputRecalled(true);
              handlePresetSelect();
            }}
          >
            RECALL
          </button>
          <button className="round" onClick={saveGlobalPreset}>
            SAVE
          </button>
          <button
            className="round border-red-600 text-red-600"
            onClick={deleteGlobalPreset}
          >
            DELETE
          </button>
          <button className="round">MIDI</button>
          <div className="flex mt-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className={`preset-num w-1/6 aspect-square border border-[#E6A60D] text-xl placeholder:text-xl text-center ${
                inputRecalled ? "text-inherit" : "text-mix"
              }`}
              placeholder="50"
              //min={1}
              max={50}
              maxLength={2}
              value={globalPresetNum}
              onChange={handlePresetNum}
              //onInput={handleInput}
            ></input>
            <button
              className="flex items-center w-1/6 aspect-square p-0 border border-[#E6A60D] text-[#E6A60D]"
              onClick={handleLeftArrow}
            >
              <Arrow />
            </button>
            <input
              type="text"
              className={`preset-name w-1/2 border border-[#E6A60D] text-xl placeholder:text-xl text-center ${
                inputRecalled ? "text-inherit" : "text-mix"
              }`}
              placeholder="PRESET NAME"
              value={globalPresetName}
              onChange={handlePresetNameChange}
              maxLength={15}
            ></input>
            <button
              className="flex items-center w-1/6 aspect-square p-0 border border-[#E6A60D] text-[#E6A60D] scale-x-[-1]"
              onClick={handleRightArrow}
            >
              <Arrow />
            </button>
          </div>
        </div>
        <div className="text-sm mb-1.5" style={{ overflowWrap: "anywhere" }}>
          <p
            className="cursor-pointer p-2.5 bg-maxbg border-solid border-[#E6A60D] border-[0.5px]"
            onClick={() => setParamsVisible(!paramsVisible)}
          >
            PRESET PARAMETERS
          </p>
          <p
            className={`${paramsVisible ? "block" : "hidden"} bg-maxbg py-1.5`}
          >
            {findByPresetNumRef.current === undefined
              ? "EMPTY PRESET"
              : Object.keys(findByPresetNumRef.current.params_json).map(
                  (key) => (
                    <span key={key} className="me-1">
                      | {key}:{" "}
                      {String(findByPresetNumRef.current.params_json[key])} |
                    </span>
                  )
                )}
          </p>
        </div>
      </div>
    </>
  );
}

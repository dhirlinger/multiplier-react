import { useEffect, useRef, useState } from "react";
import { Arrow } from "./Icon";

export default function GlobalPreset({
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
}) {
  //parameters view
  const [paramsVisible, setParamsVisible] = useState(false);

  const findByPresetNumRef = useRef();

  useEffect(() => {
    // console.log(`data: ${JSON.stringify(data)}`);
    findByPresetNumRef.current = data.find(
      (item) => item && Number(item.preset_number) === presetNum
    );
    console.log(`findBy: ${JSON.stringify(findByPresetNumRef.current)}`);
  }, [presetNum, data]);

  //update preset name when preset number is updated
  useEffect(() => {
    if (presetNum === "" || presetNum === null) return;

    if (findByPresetNumRef.current === undefined) {
      setPresetName("-EMPTY-");
    } else {
      setPresetName(findByPresetNumRef.current.name);
    }
  }, [presetNum, data]);

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
      console.log(`pre num: ${Number(value)}`);
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

  return (
    <>
      <div className="text-4xl text-center">
        <h3 className="m-1.5">
          <span className="bg-maxbg px-1.5">{category} Preset</span>
        </h3>
        <div className="flex max-w-sm min-w-xs flex-wrap justify-between mb-1.5">
          <button
            className="round"
            onClick={() => {
              setInputRecalled(true);
              recallPreset();
            }}
          >
            RECALL
          </button>
          <button className="round" onClick={savePreset}>
            SAVE
          </button>
          <button
            className="round border-red-600 text-red-600"
            onClick={deletePreset}
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
              value={presetNum}
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
              value={presetName}
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
        {category === "Global" && (
          <div className="text-sm mb-1.5" style={{ overflowWrap: "anywhere" }}>
            <p
              className="cursor-pointer p-2.5 bg-maxbg border-solid border-[#E6A60D] border-[0.5px]"
              onClick={() => setParamsVisible(!paramsVisible)}
            >
              PRESET PARAMETERS
            </p>
            <p
              className={`${
                paramsVisible ? "block" : "hidden"
              } bg-maxbg py-1.5`}
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
        )}
      </div>
    </>
  );
}

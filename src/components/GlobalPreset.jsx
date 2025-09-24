import { useEffect, useState } from "react";
import { Arrow } from "./Icon";

export default function GlobalPreset({
  presetData,
  globalPresetNum,
  setGlobalPresetNum,
  globalPresetName,
  setGlobalPresetName,
  handlePresetSelect,
}) {
  //input color control
  const [inputRecalled, setInputRecalled] = useState(false);
  const inputStyle = inputRecalled ? "text-mix" : "text-inherit";

  //update preset name when preset number is updated
  useEffect(() => {
    if (globalPresetNum === "" || globalPresetNum === null) return;

    const findByPresetNum = presetData.find(
      (item) => item && Number(item.preset_number) === globalPresetNum
    );

    if (findByPresetNum === undefined) {
      setGlobalPresetName("-EMPTY-");
    } else {
      setGlobalPresetName(findByPresetNum.name);
    }
  }, [globalPresetNum, presetData]);

  const handlePresetNumChange = () => {
    setInputRecalled(true);
    handlePresetNum();
  };

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

      //const presetNum = Number(value);

      //   const findByPresetNum = presetData.find(
      //     (item) => item && item.preset_number === value
      //   );
      //   console.log(`findBY: ${JSON.stringify(findByPresetNum)}`);
      //   if (findByPresetNum === undefined) {
      //     setGlobalPresetName("-EMPTY-");
      //     return;
      //   } else {
      //     setGlobalPresetName(findByPresetNum.name);
      //   }
    }
  };

  const handleRightArrow = () => {
    setGlobalPresetNum((prev) => {
      if (prev === "" || prev >= 50) {
        return 1;
      } else {
        return prev + 1;
      }
    });
  };

  const handleLeftArrow = () => {
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
          <span className="bg-maxbg">Global Preset</span>
        </h3>
        <div className="flex max-w-sm min-w-xs flex-wrap justify-between p-2">
          <button className="round" onClick={handlePresetSelect}>
            RECALL
          </button>
          <button className="round">SAVE</button>
          <button className="round border-red-600 text-red-600">DELETE</button>
          <button className="round">MIDI</button>
          <div className="flex mt-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className={
                "preset-num w-1/6 aspect-square border border-[#E6A60D] text-xl placeholder:text-xl placeholder:text-justify text-center ${inputStyle}"
              }
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
              className="preset-name w-1/2 border border-[#E6A60D] text-xl placeholder:text-xl text-center"
              placeholder="PRESET NAME"
              value={globalPresetName}
              onChange={(e) => setGlobalPresetName(e.target.value)}
            ></input>
            <button
              className="flex items-center w-1/6 aspect-square p-0 border border-[#E6A60D] text-[#E6A60D] scale-x-[-1]"
              onClick={handleRightArrow}
            >
              <Arrow />
            </button>
          </div>
        </div>
      </div>
      {/* <div className="max-w-sm">
        <p style={{ overflowWrap: "anywhere" }}>{JSON.stringify(presetData)}</p>
      </div> */}
    </>
  );
}

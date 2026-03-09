import BaseMultiplier from "./BaseMultiplier";
import {
  frequencyToMidi,
  midiNumberToNoteName,
} from "../assets/noteConversions";

export default function FreqArray({
  baseMultiplierParamsRef,
  freqObj,
  presetObj,
  base,
  multiplier,
  setAudioParam,
  globalFreqRecall,
  handleMidiSelect,
  setDisplayMidiMapping,
  setMidiMappingCategory,
}) {
  const createFreqArray = () => {
    const arr = [];
    const b = Number(base);
    const m = Number(multiplier);
    if (m === 1) {
      arr.push(formatDecimal(b, 3));
      for (let i = 2; i < 9; i++) {
        arr.push(formatDecimal(b * i * m, 3));
      }
    } else {
      arr.push(formatDecimal(b, 3));
      arr.push(formatDecimal(b * m, 3));
      for (let i = 2; i < 8; i++) {
        arr.push(formatDecimal(b * i * m, 3));
      }
    }
    return arr;
  };

  function formatDecimal(number, maxDecimalPlaces) {
    const strNum = String(number);
    if (strNum.includes(".")) {
      const parts = strNum.split(".");
      if (parts[1].length > maxDecimalPlaces) {
        return Number(number.toFixed(maxDecimalPlaces));
      }
    }
    return number;
  }

  return (
    <div className="tw:border-[.5px] tw:border-cyan-400 tw:bg-maxbg tw:p-2 tw:mt-2 tw:w-full">
      {/* <div className="tw:grid tw:grid-cols-2">
        <div>
          <span style={{ fontWeight: "bold" }}>Base Freq: </span>
          {base}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Multiplier: </span>
          {multiplier}
        </div>
      </div> */}
      <div>
        <div className="tw:w-1/2 tw:h-[.5px] tw:bg-cyan-400"></div>
        <div className="tw:h-[72.5px]">
          <span style={{ fontWeight: "bold" }}>In Hertz: </span>
          {base && multiplier
            ? createFreqArray().join(", ")
            : "set base and multiplier"}
        </div>
        <div className="tw:w-1/2 tw:h-[.5px] tw:bg-cyan-400"></div>
        <div className="tw:h-[48.5px]">
          {base && multiplier ? (
            <>
              <span style={{ fontWeight: "bold" }}>Nearest Note: </span>
              {createFreqArray()
                .map((item) => midiNumberToNoteName(frequencyToMidi(item)))
                .join(", ")}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="tw:w-1/2 tw:h-[.5px] tw:bg-cyan-400"></div>
      <BaseMultiplier
        base={base}
        multiplier={multiplier}
        setAudioParam={setAudioParam}
        freqObj={freqObj}
        presetObj={presetObj}
        paramsRef={baseMultiplierParamsRef}
        globalFreqRecall={globalFreqRecall}
        handleMidiSelect={handleMidiSelect}
        setMidiMappingCategory={setMidiMappingCategory}
        setDisplayMidiMapping={setDisplayMidiMapping}
      />
    </div>
  );
}

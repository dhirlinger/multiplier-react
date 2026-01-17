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
  setBase,
  multiplier,
  setMultiplier,
  globalFreqRecall,
}) {
  const createFreqArray = () => {
    const arr = [];
    if (multiplier === "1") {
      arr.push(formatDecimal(base, 3));

      for (let i = 2; i < 9; i++) {
        arr.push(formatDecimal(base * i * multiplier, 3));
      }
    } else {
      arr.push(formatDecimal(base, 3));
      arr.push(formatDecimal(base * multiplier, 3));
      for (let i = 2; i < 8; i++) {
        arr.push(formatDecimal(base * i * multiplier, 3));
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
    <div className="border-[.5px] border-cyan-400 bg-maxbg p-2 mt-2">
      {/* <div className="grid grid-cols-2">
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
        <div className="w-1/2 h-[.5px] bg-cyan-400"></div>
        <div className="h-[72.5px]">
          <span style={{ fontWeight: "bold" }}>In Hertz: </span>
          {base && multiplier
            ? createFreqArray().join(", ")
            : "set base and multiplier"}
        </div>
        <div className="w-1/2 h-[.5px] bg-cyan-400"></div>
        <div className="h-[48.5px]">
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
      <div className="w-1/2 h-[.5px] bg-cyan-400"></div>
      <BaseMultiplier
        base={base}
        setBase={setBase}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        freqObj={freqObj}
        presetObj={presetObj}
        paramsRef={baseMultiplierParamsRef}
        globalFreqRecall={globalFreqRecall}
      />
    </div>
  );
}

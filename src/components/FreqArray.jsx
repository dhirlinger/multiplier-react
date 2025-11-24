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
    <div style={{ border: "solid 1px", paddingTop: "10px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></div>
      <p>
        {freqObj && (
          <>
            <span style={{ fontWeight: "bold" }}>Base Frequency:</span>{" "}
            {freqObj.base_freq}
            <span style={{ fontWeight: "bold" }}> Multiplier:</span>{" "}
            {freqObj.multiplier}
          </>
        )}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>In Hertz: </span>
        {base && multiplier
          ? createFreqArray().join(", ")
          : "set base and multiplier"}
      </p>
      <p>
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
      </p>

      <BaseMultiplier
        base={base}
        setBase={setBase}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        freqObj={freqObj}
        presetObj={presetObj}
        paramsRef={baseMultiplierParamsRef}
      />
    </div>
  );
}

import BaseMultiplier from "./BaseMultiplier";
import { Refresh } from "./Icon";
import {
  frequencyToMidi,
  midiNumberToNoteName,
} from "../assets/noteConversions";

export default function FreqArray({
  freqData,
  baseMultiplierParamsRef,
  freqId,
  handleSelect,
  freqObj,
  base,
  setBase,
  multiplier,
  setMultiplier,
  refreshFreqObj,
  presetObj,
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
      >
        <label htmlFor="freqId" style={{ fontWeight: "bold" }}>
          Frequency Array:
        </label>
        <select
          //ref={freqIdRef}
          value={freqId}
          name="freqId"
          id="freqId"
          onChange={handleSelect}
          style={{ marginLeft: "10px" }}
        >
          {freqData.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <button className="refresh" onClick={refreshFreqObj}>
          <Refresh />
        </button>
      </div>
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
        {freqObj ? createFreqArray().join(", ") : "Loading frequency array..."}
      </p>
      <p>
        {freqObj ? (
          <>
            <span>Nearest Note: </span>
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
        presetObj={presetObj}
        paramsRef={baseMultiplierParamsRef}
      />
    </div>
  );
}

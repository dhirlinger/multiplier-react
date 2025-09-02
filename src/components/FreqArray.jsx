import BaseMultiplier from "./BaseMultiplier";
import { Refresh } from "./Icon";

export default function FreqArray({
  freqData,
  freqIdRef,
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
          ref={freqIdRef}
          name="freqId"
          id="freqId"
          onChange={handleSelect}
          onDoubleClick={(e) => {
            // let clicks = 1;
            console.log(e.target.value === freqIdRef.current);
            // Always call handleSelect on click, even if selection doesn't change
            // if (e.target.value === freqIdRef.current) {
            //   handleSelect(e);
            // }
          }}
          style={{ marginLeft: "10px" }}
        >
          {/* <option value={1}>DEFAULT</option> */}
          {freqData.map(
            (item) =>
              /* item.array_id > 1 && */(
                <option key={item.array_id} value={item.array_id}>
                  {item.array_name}
                </option>
              )
          )}
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
      <BaseMultiplier
        base={base}
        setBase={setBase}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        presetObj={presetObj}
      />
    </div>
  );
}

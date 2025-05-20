import React from "react";

export default function FreqArray({
  freqData,
  freqIdRef,
  handleSelect,
  freqObj,
}) {
  const createFreqArray = () => {
    const arr = [];
    const obj = freqObj;
    for (let i = 1.0; i < 9; i++) {
      arr.push(obj.base_freq * i * obj.multiplier);
    }
    return arr;
  };

  return (
    <div style={{ border: "solid 1px", paddingTop: "10px" }}>
      <label htmlFor="freqId" style={{ fontWeight: "bold" }}>
        Frequency Array:
      </label>
      <select
        ref={freqIdRef}
        name="freqId"
        id="freqId"
        onChange={handleSelect}
        style={{ marginLeft: "10px" }}
      >
        <option value={1}>DEFAULT</option>
        {freqData.map(
          (item) =>
            item.array_id > 1 && (
              <option key={item.array_id} value={item.array_id}>
                {item.array_name}
              </option>
            )
        )}
      </select>
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
    </div>
  );
}

import { useState } from "react";

export default function BaseMultiplier({
  base,
  setBase,
  multiplier,
  setMultiplier,
}) {
  const [multiplierMin, setMultiplierMin] = useState("0.1");
  const [multiplierMax, setMultiplierMax] = useState("10");
  const [multiplierStep, setMultiplierStep] = useState("0.1");

  const handleBaseChange = (e) => {
    let inputValue = e.target.value;

    // Only allow ints and floats
    //if (/^-?\d+(\.\d+)?$/.test(inputValue)) {
    //setBaseValue(inputValue);
    setBase(inputValue);
    //}
    // If input is invalid, do nothing (no update)
  };

  return (
    <div style={{ margin: "15px" }}>
      <label htmlFor="base">Base: </label>
      <input
        id="base"
        type="text" // use text to fully control input
        value={base}
        maxLength={10}
        style={{ width: "100px", fontSize: "36px" }}
        onChange={handleBaseChange}
      ></input>
      <input
        type="range"
        max="10000"
        min="40"
        step="10"
        value={base}
        onChange={(e) => setBase(e.target.value)}
      />
      <div>
        <span style={{ width: "100px" }}>Multiplier: </span>
        <input
          type="range"
          max={multiplierMax}
          min={multiplierMin}
          step={multiplierStep}
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
        />
        <span style={{ width: "50px" }}>{Number(multiplier).toFixed(3)}</span>
        <div>
          <label htmlFor="base">multiplier min: </label>
          <input
            id="multi-min"
            type="text" // use text to fully control input
            value={multiplierMin}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={(e) => setMultiplierMin(e.target.value)}
          ></input>
          <label htmlFor="base">multiplier max: </label>
          <input
            id="multi-max"
            type="text" // use text to fully control input
            value={multiplierMax}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={(e) => setMultiplierMax(e.target.value)}
          ></input>
          <label htmlFor="base">multiplier step: </label>
          <input
            id="multi-step"
            type="text" // use text to fully control input
            value={multiplierStep}
            // maxLength={10}
            style={{ width: "50px", fontSize: "14px" }}
            onChange={(e) => setMultiplierStep(e.target.value)}
          ></input>
        </div>
      </div>
    </div>
  );
}

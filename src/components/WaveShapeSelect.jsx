import React from "react";

export default function WaveShapeSelect({ waveshape, handleChange }) {
  return (
    <div style={{ marginTop: "20px", border: "solid 1px #666" }}>
      <input
        type="radio"
        value="sine"
        name="waveshape"
        id="sine"
        checked={waveshape === "sine"}
        onChange={handleChange}
      ></input>
      <label htmlFor="sine">sine</label>
      <input
        type="radio"
        value="triangle"
        name="waveshape"
        id="triangle"
        checked={waveshape === "triangle"}
        onChange={handleChange}
      ></input>
      <label htmlFor="triange">triangle</label>
      <input
        type="radio"
        value="square"
        name="waveshape"
        id="square"
        checked={waveshape === "square"}
        onChange={handleChange}
      ></input>
      <label htmlFor="square">square</label>
      <input
        type="radio"
        value="sawtooth"
        name="waveshape"
        id="sawtooth"
        checked={waveshape === "sawtooth"}
        onChange={handleChange}
      ></input>
      <label htmlFor="sawtooth">sawtooth</label>
    </div>
  );
}

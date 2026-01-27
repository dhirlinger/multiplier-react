import React from "react";

export default function WaveShapeSelect({ waveshape, handleChange }) {
  return (
    <div
      id="waveshape"
      className="grid grid-cols-4 gap-2 justify-center border-[.5px] border-[#E6A60D] mt-2 mb-2 p-2"
    >
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
      <label htmlFor="triangle">triangle</label>
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

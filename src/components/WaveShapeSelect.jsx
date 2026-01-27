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
      <label
        htmlFor="sine"
        className={`${waveshape === "sine" ? "border-cyan-500 text-cyan-500" : "border-[#E6A60D]"}`}
      >
        sine
      </label>
      <input
        type="radio"
        value="triangle"
        name="waveshape"
        id="triangle"
        checked={waveshape === "triangle"}
        onChange={handleChange}
      ></input>
      <label
        htmlFor="triangle"
        className={`${waveshape === "triangle" ? "border-cyan-500  text-cyan-500" : "border-[#E6A60D]"}`}
      >
        triangle
      </label>
      <input
        type="radio"
        value="square"
        name="waveshape"
        id="square"
        checked={waveshape === "square"}
        onChange={handleChange}
      ></input>
      <label
        htmlFor="square"
        className={`${waveshape === "square" ? "border-cyan-500  text-cyan-500" : "border-[#E6A60D]"}`}
      >
        square
      </label>
      <input
        type="radio"
        value="sawtooth"
        name="waveshape"
        id="sawtooth"
        checked={waveshape === "sawtooth"}
        onChange={handleChange}
      ></input>
      <label
        htmlFor="sawtooth"
        className={`${waveshape === "sawtooth" ? "border-cyan-500  text-cyan-500" : "border-[#E6A60D]"}`}
      >
        sawtooth
      </label>
    </div>
  );
}

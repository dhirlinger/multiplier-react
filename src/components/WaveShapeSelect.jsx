import React from "react";

export default function WaveShapeSelect({ waveshape, handleChange }) {
  return (
    <div
      id="waveshape"
      className="tw:grid tw:grid-cols-4 tw:gap-2 tw:justify-center tw:border-[.5px] tw:border-[#E6A60D] tw:mt-1 tw:mb-1 tw:p-2 tw:ml-1 tw:mr-1"
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
        className={`${waveshape === "sine" ? "tw:border-cyan-500 tw:text-cyan-500" : "tw:border-[#E6A60D]"}`}
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
        className={`${waveshape === "triangle" ? "tw:border-cyan-500  tw:text-cyan-500" : "tw:border-[#E6A60D]"}`}
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
        className={`${waveshape === "square" ? "tw:border-cyan-500  tw:text-cyan-500" : "tw:border-[#E6A60D]"}`}
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
        className={`${waveshape === "sawtooth" ? "tw:border-cyan-500  tw:text-cyan-500" : "tw:border-[#E6A60D]"}`}
      >
        sawtooth
      </label>
    </div>
  );
}

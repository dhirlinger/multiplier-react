import { useEffect, useState } from "react";
import { Arrow } from "./Icon";
import { capitalizeFirstLetter } from "../assets/helpers";

export default function BaseMultiplierUI({
  value,
  setValue,
  handleValueChange,
  min,
  max,
  step,
  setMin,
  setMax,
  setStep,
  category,
}) {
  const [stepOutOfBounds, setStepOutOfBounds] = useState();

  useEffect(() => {
    if (Number(step) > Number(max) - Number(min)) {
      setStepOutOfBounds(true);
    } else setStepOutOfBounds(false);
  }, [setStepOutOfBounds, min, max, step]);

  const getInputLimit = () => {
    if (category === "base") {
      return { stepMax: 11000, maxLimit: 22000 };
    }
    if (category === "multiplier") {
      return { stepMax: 1000, maxLimit: 10000 };
    }
  };

  const limits = getInputLimit();

  const handleUpArrow = () => {
    setValue((prev) => {
      const next = Number(prev) + Number(step);
      if (next <= max && next >= min) {
        return next;
      }
      return max;
    });
  };

  const handleDownArrow = () => {
    setValue((prev) => {
      const next = Number(prev) - Number(step);
      if (next <= max && next >= min) {
        return next;
      }
      return min;
    });
  };

  const outOfBoundsSliderStyle = `
    [&::-webkit-slider-runnable-track]:bg-stone-500 
    [&::-moz-range-track]:bg-stone-500 
    [&::-webkit-slider-thumb]:bg-stone-400
    [&::-moz-range-thumb]:bg-stone-400
    `;

  return (
    <>
      <div id={category}>
        <p className="block font-bold">{capitalizeFirstLetter(category)}</p>
        <div className="">
          <div className="flex items-center gap-2 mb-2">
            <button
              className={`flex items-center w-14 aspect-square p-0 border border-cyan-500/90 text-cyan-500/90 rotate-90`}
              onClick={handleUpArrow}
            >
              <Arrow />
            </button>
            <input
              id={category}
              type="text"
              value={value}
              maxLength={10}
              style={{ fontSize: "36px" }}
              className="w-38.75"
              onChange={handleValueChange}
            />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <button
              className={`flex items-center w-14 aspect-square p-0 border border-cyan-500/90 text-cyan-500/90 -rotate-90`}
              onClick={handleDownArrow}
            >
              <Arrow />
            </button>
            <input
              type="range"
              max={max}
              min={min}
              step={step}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`w-68 ${
                stepOutOfBounds ? outOfBoundsSliderStyle : ""
              }`}
            />
          </div>
        </div>
      </div>

      <div className="mb-2">
        <label htmlFor={`${category}-min`}>min: </label>
        <input
          id={`${category}-min`}
          type="text" // use text to fully control input
          value={min}
          // maxLength={10}
          style={{ width: "50px", fontSize: "14px" }}
          onChange={(e) => {
            let inputValue = e.target.value;
            setMin(inputValue);
          }}
        ></input>
        <label htmlFor={`${category}-max`}>max: </label>
        <input
          id={`${category}-max`}
          type="text" // use text to fully control input
          value={max}
          // maxLength={10}
          style={{ width: "50px", fontSize: "14px" }}
          onChange={(e) => {
            let inputValue = e.target.value;
            setMax(inputValue);
          }}
        ></input>
        <label htmlFor={`${category}-step`}>step: </label>
        <input
          id={`${category}-step`}
          type="text" // use text to fully control input
          value={step}
          // maxLength={10}
          style={{ width: "50px", fontSize: "14px" }}
          className={stepOutOfBounds ? "border-red-500 border" : "border-"}
          onChange={(e) => {
            let inputValue = e.target.value;
            if (
              Number(inputValue) <= limits.stepMax ||
              inputValue === "" ||
              inputValue === "."
            ) {
              setStep(inputValue);
            }
          }}
        ></input>
      </div>
    </>
  );
}

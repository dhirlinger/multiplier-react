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
  setMidiMappingCategory,
  setDisplayMidiMapping,
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

  // Arrow handlers compute the new value directly (no functional update)
  // This works with setAudioParam which expects a direct value
  const handleUpArrow = () => {
    const currentValue = Number(value);
    const stepValue = Number(step);
    const maxValue = Number(max);
    const minValue = Number(min);

    const next = currentValue + stepValue;
    if (next <= maxValue && next >= minValue) {
      setValue(next);
    } else {
      setValue(maxValue);
    }
  };

  const handleDownArrow = () => {
    const currentValue = Number(value);
    const stepValue = Number(step);
    const maxValue = Number(max);
    const minValue = Number(min);

    const next = currentValue - stepValue;
    if (next <= maxValue && next >= minValue) {
      setValue(next);
    } else {
      setValue(minValue);
    }
  };

  const outOfBoundsSliderStyle = `
    [&::-webkit-slider-runnable-track]:tw:bg-stone-500 
    [&::-moz-range-track]:tw:bg-stone-500 
    [&::-webkit-slider-thumb]:tw:bg-stone-400
    [&::-moz-range-thumb]:tw:bg-stone-400
    `;

  return (
    <>
      <div id={category}>
        <div className="tw:flex tw:justify-between tw:items-center">
          <p className="tw:block tw:font-bold">{capitalizeFirstLetter(category)}</p>
          {category === "base" && (
            <>
              <button
                className="tw:text-xs tw:py-0.5 tw:px-2 tw:border-pink-800 tw:border tw:bg-pink-600 tw:mt-1"
                onClick={() => {
                  setMidiMappingCategory("synth/freq_params");
                  setDisplayMidiMapping(true);
                }}
              >
                MAP
              </button>
            </>
          )}
        </div>
        <div className="">
          <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
            <button
              className={`tw:flex tw:items-center tw:w-14 tw:aspect-square tw:p-0 tw:border tw:border-cyan-500/90 tw:text-cyan-500/90 tw:rotate-90`}
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
              className="tw:w-38.75"
              onChange={handleValueChange}
            />
          </div>
          <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
            <button
              className={`tw:flex tw:items-center tw:w-14 tw:aspect-square tw:p-0 tw:border tw:border-cyan-500/90 tw:text-cyan-500/90 -tw:rotate-90`}
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
              className={`tw:w-68 ${
                stepOutOfBounds ? outOfBoundsSliderStyle : ""
              }`}
            />
          </div>
        </div>
      </div>

      <div className="tw:mb-2">
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

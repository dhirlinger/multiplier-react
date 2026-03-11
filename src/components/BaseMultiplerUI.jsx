import { useEffect, useState, useRef } from "react";
import { Arrow } from "./Icon";
import { capitalizeFirstLetter } from "../assets/helpers";
import {
  midiNoteToFrequency,
  noteNameToMidi,
  frequencyToMidi,
  midiNumberToNoteName,
  checkFrequencyWithin10Cents,
} from "../assets/noteConversions";

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
  handleMidiSelect,
}) {
  const [stepOutOfBounds, setStepOutOfBounds] = useState();
  const [noteError, setNoteError] = useState(null);
  const noteNameRef = useRef(null);

  const displayNoteName = (num) => {
    const checked = checkFrequencyWithin10Cents(num);
    if (checked === null) return "";
    return midiNumberToNoteName(frequencyToMidi(checked)) ?? "";
  };

  const updateNoteNameDisplay = (num) => {
    if (noteNameRef.current) {
      noteNameRef.current.value = displayNoteName(num);
    }
  };

  useEffect(() => {
    updateNoteNameDisplay(value);
  }, [value]);

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

  const handleNoteNameChange = (name) => {
    const containsNumber = /\d/.test(name);
    if (!containsNumber) return;

    const midi = noteNameToMidi(name, setNoteError);
    if (midi === null || isNaN(midi)) return;
    const freq = midiNoteToFrequency(midi);
    const maxValue = Number(max);
    const minValue = Number(min);
    if (freq <= maxValue && freq >= minValue) {
      setValue(freq);
      setNoteError(null);
    } else if (freq < minValue) {
      setNoteError("below min");
    } else if (freq > maxValue) {
      setNoteError("above max");
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
          <p className="tw:block tw:font-bold">
            {capitalizeFirstLetter(category)}
          </p>
          {category === "base" && (
            <>
              <button
                className="tw:text-xs tw:py-0.5 tw:px-2 tw:border-pink-800 tw:border tw:bg-pink-600 tw:mt-1"
                onClick={() => handleMidiSelect("synth/freq_params")}
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
              className="tw:w-38.75 tw:pl-1"
              onChange={(e) => {
                handleValueChange(e);
              }}
            />
            {category === "base" && (
              <>
                <input
                  id="noteName"
                  type="text"
                  ref={noteNameRef}
                  defaultValue=""
                  maxLength={4}
                  className={`tw:w-20 tw:text-[36px] tw:pl-1 tw:placeholder:text-xs tw:placeholder:align-middle ${
                    noteError === "out of range"
                      ? "tw:border-red-500 tw:border"
                      : ""
                  }`}
                  placeholder="NOTE NAME"
                  onChange={(e) => {
                    const raw = e.target.value;
                    const formatted =
                      raw.charAt(0).toUpperCase() + raw.slice(1);
                    e.target.value = formatted;
                    handleNoteNameChange(formatted);
                  }}
                />
              </>
            )}
          </div>
          <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
            <button
              className={`tw:flex tw:items-center tw:w-14 tw:aspect-square tw:p-0 tw:border tw:border-cyan-500/90 tw:text-cyan-500/90 tw:-rotate-90`}
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
          type="text"
          value={min}
          style={{ width: "50px", fontSize: "14px" }}
          className={
            noteError === "below min" ? "tw:border-red-500 tw:border" : ""
          }
          onChange={(e) => {
            setMin(e.target.value);
            setNoteError(null);
          }}
        />
        <label htmlFor={`${category}-max`}>max: </label>
        <input
          id={`${category}-max`}
          type="text"
          value={max}
          style={{ width: "50px", fontSize: "14px" }}
          className={
            noteError === "above max" ? "tw:border-red-500 tw:border" : ""
          }
          onChange={(e) => {
            setMax(e.target.value);
            setNoteError(null);
          }}
        />
        <label htmlFor={`${category}-step`}>step: </label>
        <input
          id={`${category}-step`}
          type="text"
          value={step}
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

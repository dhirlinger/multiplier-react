import { useState } from "react";
import { useMidiContext } from "../../context/MidiContext";

export default function SubdivisionListSection({ setInputRecalled }) {
  const { subdivisionList, setSubdivisionList } = useMidiContext();
  const [inputValue, setInputValue] = useState("");

  const currentList = subdivisionList || [];

  const handleUpdate = () => {
    // Parse: "1,5,10,1,13" → [1,5,10,1,13]
    const parsed = inputValue
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map(Number)
      .filter((n) => !isNaN(n) && n >= 1 && n <= 16); // Only valid subdivision numbers

    setSubdivisionList(parsed);
    setInputRecalled(false);

    setInputValue(""); // Clear input after save
  };

  const handleClear = () => {
    setSubdivisionList([]);
    setInputRecalled(false);
  };

  return (
    <div className="tw:mt-4">
      <h3 className="tw:text-sm tw:font-semibold tw:text-gray-300 tw:mb-1">
        Subdivision List
      </h3>

      {/* Current list display */}
      <div className="tw:mb-2 tw:p-2 tw:bg-gray-800 tw:rounded tw:text-sm">
        <span className="tw:text-gray-400">Current: </span>
        {currentList.length > 0 ? (
          <span className="tw:text-[#E6A60D]">{currentList.join(", ")}</span>
        ) : (
          <span className="tw:text-gray-500">None (navigation disabled)</span>
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="3,5,7,9"
        className="tw:w-full tw:px-2 tw:py-1 tw:bg-gray-700 tw:text-white tw:rounded tw:text-sm tw:mb-2 tw:border-[#E6A60D]"
      />

      {/* Buttons */}
      <div className="tw:flex tw:gap-2">
        <button
          onClick={handleUpdate}
          className="tw:flex-1 tw:py-1 tw:bg-[#E6A60D] tw:text-gray-900 tw:rounded hover:tw:bg-yellow-500 tw:text-sm"
        >
          Update List
        </button>
        <button
          onClick={handleClear}
          className="tw:px-3 tw:py-1 tw:bg-gray-700 tw:text-gray-200 tw:rounded hover:tw:bg-gray-600 tw:text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

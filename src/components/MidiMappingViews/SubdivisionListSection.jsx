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
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-1">
        Subdivision List
      </h3>

      {/* Current list display */}
      <div className="mb-2 p-2 bg-gray-800 rounded text-sm">
        <span className="text-gray-400">Current: </span>
        {currentList.length > 0 ? (
          <span className="text-[#E6A60D]">{currentList.join(", ")}</span>
        ) : (
          <span className="text-gray-500">None (navigation disabled)</span>
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="3,5,7,9"
        className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm mb-2 border-[#E6A60D]"
      />

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleUpdate}
          className="flex-1 py-1 bg-[#E6A60D] text-gray-900 rounded hover:bg-yellow-500 text-sm"
        >
          Update List
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useMidiContext } from "../../context/MidiContext";

export default function PresetListSection({ category, setInputRecalled }) {
  const { presetLists, setPresetLists } = useMidiContext();
  const [inputValue, setInputValue] = useState("");

  // Get current list for this category
  const currentList = presetLists[category] || [];

  const handleUpdate = () => {
    // Parse: "1,5,10,1,20" → [1,5,10,1,20]
    const parsed = inputValue
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map(Number)
      .filter((n) => !isNaN(n) && n >= 1 && n <= 50); // Only valid preset numbers

    setPresetLists((prev) => ({
      ...prev,
      [category]: parsed,
    }));

    setInputValue(""); // Clear input after save
    setInputRecalled(false);
  };

  const handleClear = () => {
    setPresetLists((prev) => ({
      ...prev,
      [category]: [],
    }));
    setInputRecalled(false);
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-1">Preset List</h3>

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
        placeholder="1,5,10,15,20"
        className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm mb-2"
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

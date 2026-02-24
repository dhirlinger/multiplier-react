import { useMidiContext } from "../../context/MidiContext";

export default function PresetRecallsSection({ category, setInputRecalled }) {
  const { mappings, setMappings, learningMode, setLearningMode } =
    useMidiContext();

  const recalls = mappings[category]?.preset_recalls || {};

  // Convert to array for rendering
  const recallsList = Object.entries(recalls).map(([presetNum, note]) => ({
    presetNum,
    note,
  }));

  const addRecall = () => {
    // Find first unused preset number
    const usedNums = new Set(Object.keys(recalls).map(Number));
    let nextNum = 1;
    while (usedNums.has(nextNum) && nextNum <= 50) {
      nextNum++;
    }

    if (nextNum > 50) {
      console.log(`Maximum 50 preset recalls for ${category}`);
      return;
    }

    // Add empty mapping
    setMappings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        preset_recalls: {
          ...prev[category].preset_recalls,
          [nextNum]: null, // Not mapped yet
        },
      },
    }));
  };

  const removeRecall = (presetNum) => {
    // Clear learning mode if we're removing the preset being learned
    if (learningMode?.target === `${category}.preset_recalls.${presetNum}`) {
      setLearningMode(null);
    }
    setInputRecalled(false);
    setMappings((prev) => {
      const newRecalls = { ...prev[category].preset_recalls };
      delete newRecalls[presetNum];

      return {
        ...prev,
        [category]: {
          ...prev[category],
          preset_recalls: newRecalls,
        },
      };
    });
  };

  const updatePresetNum = (oldNum, newNum) => {
    setMappings((prev) => {
      const newRecalls = { ...prev[category].preset_recalls };
      const note = newRecalls[oldNum];
      delete newRecalls[oldNum];
      newRecalls[newNum] = note;

      return {
        ...prev,
        [category]: {
          ...prev[category],
          preset_recalls: newRecalls,
        },
      };
    });
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-1">
        Preset Recalls
      </h3>
      {/* List of recalls */}
      {recallsList.length === 0 && (
        <p className="text-gray-400 text-sm mb-2">No preset recalls mapped</p>
      )}

      {recallsList.map(({ presetNum, note }) => (
        <div
          key={presetNum}
          className="mb-3 p-3 bg-gray-800 rounded flex items-center gap-2"
        >
          {/* Preset number dropdown */}
          <select
            value={presetNum}
            onChange={(e) => updatePresetNum(presetNum, e.target.value)}
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
          >
            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                Preset {num}
              </option>
            ))}
          </select>

          {/* Note display */}
          <span className="text-sm ml-auto">
            {note ? (
              <span className="text-[#E6A60D]">Note {note}</span>
            ) : (
              <span className="text-gray-500">Not mapped</span>
            )}
          </span>

          {/* Map button */}
          <button
            className={`px-3 py-1 text-sm rounded ${
              learningMode?.target === `${category}.preset_recalls.${presetNum}`
                ? "bg-red-500 text-white animate-pulse"
                : "bg-[#E6A60D] text-gray-900 hover:bg-yellow-500"
            }`}
            onClick={() => {
              learningMode?.target === `${category}.preset_recalls.${presetNum}`
                ? setLearningMode(null)
                : setLearningMode({
                    type: "note",
                    target: `${category}.preset_recalls.${presetNum}`,
                  });
              setInputRecalled(false);
            }}
          >
            {learningMode?.target === `${category}.preset_recalls.${presetNum}`
              ? "Listening..."
              : "Map"}
          </button>

          {/* Remove button */}
          <button
            onClick={() => removeRecall(presetNum)}
            className="text-red-500 hover:text-red-400 text-sm font-bold px-3 py-1"
          >
            X
          </button>
        </div>
      ))}

      {/* Add button */}
      <button
        onClick={addRecall}
        className="w-full py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 text-sm"
      >
        + Add Preset Recall
      </button>
    </div>
  );
}

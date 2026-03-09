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
      <h3 className="tw:text-sm tw:font-semibold tw:text-gray-300 tw:mb-1">
        Preset Recalls
      </h3>
      {/* List of recalls */}
      {recallsList.length === 0 && (
        <p className="tw:text-gray-400 tw:text-sm tw:mb-2">No preset recalls mapped</p>
      )}

      {recallsList.map(({ presetNum, note }) => (
        <div
          key={presetNum}
          className="tw:mb-3 tw:p-3 tw:bg-gray-800 tw:rounded tw:flex tw:items-center tw:gap-2"
        >
          {/* Preset number dropdown */}
          <select
            value={presetNum}
            onChange={(e) => updatePresetNum(presetNum, e.target.value)}
            className="tw:bg-gray-700 tw:text-white tw:px-2 tw:py-1 tw:rounded tw:text-sm"
          >
            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                Preset {num}
              </option>
            ))}
          </select>

          {/* Note display */}
          <span className="tw:text-sm tw:ml-auto">
            {note ? (
              <span className="tw:text-[#E6A60D]">Note {note}</span>
            ) : (
              <span className="tw:text-gray-500">Not mapped</span>
            )}
          </span>

          {/* Map button */}
          <button
            className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
              learningMode?.target === `${category}.preset_recalls.${presetNum}`
                ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
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
            className="tw:text-red-500 hover:tw:text-red-400 tw:text-sm tw:font-bold tw:px-3 tw:py-1"
          >
            X
          </button>
        </div>
      ))}

      {/* Add button */}
      <button
        onClick={addRecall}
        className="tw:w-full tw:py-2 tw:bg-gray-700 tw:text-gray-200 tw:rounded hover:tw:bg-gray-600 tw:text-sm tw:border-[#E6A60D]"
      >
        + Add Preset Recall
      </button>
    </div>
  );
}

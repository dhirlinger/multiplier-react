import { useMidiContext } from "../../context/MidiContext";

export default function SubdivisionRecallsSection({ setInputRecalled }) {
  const { mappings, setMappings, learningMode, setLearningMode } =
    useMidiContext();

  const recalls = mappings.tempo_subdivision.subdivision_recalls || {};

  // Convert to array for rendering
  const recallsList = Object.entries(recalls).map(([subdivisionNum, note]) => ({
    subdivisionNum,
    note,
  }));

  const addRecall = () => {
    // Find first unused subdivision number

    const usedNums = new Set(Object.keys(recalls).map(Number));
    let nextNum = 1;
    while (usedNums.has(nextNum) && nextNum <= 16) {
      nextNum++;
    }

    if (nextNum > 16) {
      console.log(`Maximum 16 subdivision recalls`);
      return;
    }

    // Add empty mapping
    setMappings((prev) => ({
      ...prev,
      tempo_subdivision: {
        ...prev.tempo_subdivision,
        subdivision_recalls: {
          ...prev.tempo_subdivision.subdivision_recalls,
          [nextNum]: null,
        },
      },
    }));
  };

  const removeRecall = (subdivisionNum) => {
    // Clear learning mode if we're removing the subdivision being learned
    if (learningMode?.target === `tempo_subdivision.subdivision_recalls`) {
      setLearningMode(null);
    }
    setInputRecalled(false);
    setMappings((prev) => {
      const newRecalls = { ...prev.tempo_subdivision.subdivision_recalls };
      delete newRecalls[subdivisionNum];

      return {
        ...prev,
        tempo_subdivision: {
          ...prev.tempo_subdivision,
          subdivision_recalls: newRecalls,
        },
      };
    });
  };

  const updateSubdivisionNum = (oldNum, newNum) => {
    setMappings((prev) => {
      const newRecalls = { ...prev.tempo_subdivision.subdivision_recalls };
      const note = newRecalls[oldNum];
      delete newRecalls[oldNum];
      newRecalls[newNum] = note;

      return {
        ...prev,
        tempo_subdivision: {
          ...prev.tempo_subdivision,
          subdivision_recalls: newRecalls,
        },
      };
    });
  };

  return (
    <>
      <div>
        <h3 className="tw:text-sm tw:font-semibold tw:text-gray-300 tw:mb-1">
          Subdivision Recalls
        </h3>
        {/* List of recalls */}
        {recallsList.length === 0 && (
          <p className="tw:text-gray-400 tw:text-sm tw:mb-2">
            No subdivision recalls mapped
          </p>
        )}

        {recallsList.map(({ subdivisionNum, note }) => (
          <div
            key={subdivisionNum}
            className="tw:mb-3 tw:p-3 tw:bg-gray-800 tw:rounded tw:flex tw:items-center tw:gap-2"
          >
            {/* Subdivision number dropdown */}
            <select
              value={subdivisionNum}
              onChange={(e) =>
                updateSubdivisionNum(subdivisionNum, e.target.value)
              }
              className="tw:bg-gray-700 tw:text-white tw:px-2 tw:py-1 tw:rounded tw:text-sm"
            >
              {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Subdivision {num}
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
                learningMode?.target ===
                `tempo_subdivision.subdivision_recalls.${subdivisionNum}`
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target ===
                `tempo_subdivision.subdivision_recalls.${subdivisionNum}`
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "note",
                      target: `tempo_subdivision.subdivision_recalls.${subdivisionNum}`,
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target ===
              `tempo_subdivision.subdivision_recalls.${subdivisionNum}`
                ? "Listening..."
                : "Map"}
            </button>

            {/* Remove button */}
            <button
              onClick={() => removeRecall(subdivisionNum)}
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
          + Add Subdivision Recall
        </button>
      </div>
    </>
  );
}

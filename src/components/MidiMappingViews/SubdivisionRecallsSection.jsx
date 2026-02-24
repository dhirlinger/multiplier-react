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
    console.log("add sub recall");
    const usedNums = new Set(Object.keys(recalls).map(Number));
    let nextNum = 1;
    while (usedNums.has(nextNum) && nextNum <= 16) {
      nextNum++;
    }
    console.log(`rec: ${JSON.stringify(recalls)}`);
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
        <h3 className="text-sm font-semibold text-gray-300 mb-1">
          Subdivision Recalls
        </h3>
        {/* List of recalls */}
        {recallsList.length === 0 && (
          <p className="text-gray-400 text-sm mb-2">
            No subdivision recalls mapped
          </p>
        )}

        {recallsList.map(({ subdivisionNum, note }) => (
          <div
            key={subdivisionNum}
            className="mb-3 p-3 bg-gray-800 rounded flex items-center gap-2"
          >
            {/* Subdivision number dropdown */}
            <select
              value={subdivisionNum}
              onChange={(e) =>
                updateSubdivisionNum(subdivisionNum, e.target.value)
              }
              className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
            >
              {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Subdivision {num}
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
                learningMode?.target ===
                `tempo_subdivision.subdivision_recalls.${subdivisionNum}`
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-[#E6A60D] text-gray-900 hover:bg-yellow-500"
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
          + Add Subdivision Recall
        </button>
      </div>
    </>
  );
}

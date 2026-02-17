import { useMidiContext } from "../../context/MidiContext";

export default function IndexParamsView() {
  const { mappings, learningMode, setLearningMode } = useMidiContext();

  return (
    <>
      {/* Index Inputs 0-7 (1-8) CC */}
      {Array.from({ length: 8 }, (_, i) => i).map((i) => (
        <div key={i} className="mb-4 p-3 bg-gray-800 rounded">
          <div className="flex justify-between items-center">
            <span className="text-gray-200">Index Column {i + 1}</span>
            <div className="flex items-center gap-2">
              {mappings.index_array_inputs[`input_${i}`] ? (
                <span className="text-sm text-[#E6A60D]">
                  CC {`mappings.index_array_inputs.input_${i}`}
                </span>
              ) : (
                <span className="text-sm text-gray-500">Not mapped</span>
              )}
              <button
                className={`px-3 py-1 text-sm rounded ${
                  learningMode?.target ===
                  `mappings.index_array_inputs.input_${i}`
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-[#E6A60D] text-gray-900 hover:bg-yellow-500"
                }`}
                onClick={() =>
                  learningMode?.target ===
                  `mappings.index_array_inputs.input_${i}`
                    ? setLearningMode(null)
                    : setLearningMode({
                        type: "cc",
                        target: `mappings.index_array_inputs.input_${i}`,
                      })
                }
              >
                {learningMode?.target ===
                `mappings.index_array_inputs.input_${i}`
                  ? "Listening..."
                  : "Map"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

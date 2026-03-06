import { useMidiContext } from "../../context/MidiContext";

export default function IndexParamsView({ setInputRecalled }) {
  const { mappings, learningMode, setLearningMode } = useMidiContext();

  return (
    <>
      <h3 className="tw:text-sm tw:font-semibold tw:text-gray-300 tw:mb-1">
        Index Columns
      </h3>
      {/* Index Inputs 0-7 (1-8) CC */}
      {Array.from({ length: 8 }, (_, i) => i).map((i) => (
        <div key={i} className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
          <div className="tw:flex tw:justify-between tw:items-center">
            <span className="tw:text-gray-200">Index Column {i + 1}</span>
            <div className="tw:flex tw:items-center tw:gap-2">
              {mappings.index_array_inputs[`input_${i}`] ? (
                <span className="tw:text-sm tw:text-[#E6A60D]">
                  CC {mappings.index_array_inputs[`input_${i}`]}
                </span>
              ) : (
                <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
              )}
              <button
                className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                  learningMode?.target === `index_array_inputs.input_${i}`
                    ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                    : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
                }`}
                onClick={() => {
                  learningMode?.target === `index_array_inputs.input_${i}`
                    ? setLearningMode(null)
                    : setLearningMode({
                        type: "cc",
                        target: `index_array_inputs.input_${i}`,
                      });
                  setInputRecalled(false);
                }}
              >
                {learningMode?.target === `index_array_inputs.input_${i}`
                  ? "Listening..."
                  : "Map"}
              </button>
            </div>
          </div>
        </div>
      ))}
      <h3 className="tw:text-sm tw:font-semibold tw:text-gray-300 tw:mb-1">Rest Buttons</h3>
      {/* Index Rest Buttons 0-7 (1-8) MIDI Notes */}
      {Array.from({ length: 8 }, (_, i) => i).map((i) => (
        <div key={i} className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
          <div className="tw:flex tw:justify-between tw:items-center">
            <span className="tw:text-gray-200">Index Rest Button {i + 1}</span>
            <div className="tw:flex tw:items-center tw:gap-2">
              {mappings.index_array_inputs.rest_buttons[`rest_${i}`] ? (
                <span className="tw:text-sm tw:text-[#E6A60D]">
                  Note {mappings.index_array_inputs.rest_buttons[`rest_${i}`]}
                </span>
              ) : (
                <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
              )}
              <button
                className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                  learningMode?.target ===
                  `index_array_inputs.rest_buttons.rest_${i}`
                    ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                    : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
                }`}
                onClick={() => {
                  learningMode?.target ===
                  `index_array_inputs.rest_buttons.rest_${i}`
                    ? setLearningMode(null)
                    : setLearningMode({
                        type: "note",
                        target: `index_array_inputs.rest_buttons.rest_${i}`,
                      });
                  setInputRecalled(false);
                }}
              >
                {learningMode?.target ===
                `index_array_inputs.rest_buttons.rest_${i}`
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

import { useMidiContext } from "../../context/MidiContext";

export default function PresetListNavigationSection({
  category,
  setInputRecalled,
}) {
  const { mappings, learningMode, setLearningMode } = useMidiContext();
  return (
    <div className="tw:mt-4">
      <h3 className="tw:text-sm tw:font-semibold tw:text-gray-300 tw:mb-1">
        List Navigation
      </h3>
      {/* List Up */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">List Up</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings[category].preset_list_up ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                Note {mappings[category].preset_list_up}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === `${category}.preset_list_up`
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === `${category}.preset_list_up`
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "note",
                      target: `${category}.preset_list_up`,
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === `${category}.preset_list_up`
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>
      {/* List Down */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">List Down</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings[category].preset_list_down ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                Note {mappings[category].preset_list_down}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === `${category}.preset_list_down`
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === `${category}.preset_list_down`
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "note",
                      target: `${category}.preset_list_down`,
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === `${category}.preset_list_down`
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>
      {/* List Random */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">Random From List</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings[category].preset_list_random ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                Note {mappings[category].preset_list_random}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === `${category}.preset_list_random`
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === `${category}.preset_list_random`
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "note",
                      target: `${category}.preset_list_random`,
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === `${category}.preset_list_random`
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMidiContext } from "../../context/MidiContext";

export default function PresetListNavigationSection({ category }) {
  const { mappings, learningMode, setLearningMode } = useMidiContext();
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-1">
        List Navigation
      </h3>
      {/* List Up */}
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <div className="flex justify-between items-center">
          <span className="text-gray-200">List Up</span>
          <div className="flex items-center gap-2">
            {mappings[category].preset_list_up ? (
              <span className="text-sm text-[#E6A60D]">
                Note {mappings[category].preset_list_up}
              </span>
            ) : (
              <span className="text-sm text-gray-500">Not mapped</span>
            )}
            <button
              className={`px-3 py-1 text-sm rounded ${
                learningMode?.target === `${category}.preset_list_up`
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-[#E6A60D] text-gray-900 hover:bg-yellow-500"
              }`}
              onClick={() =>
                learningMode?.target === `${category}.preset_list_up`
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "note",
                      target: `${category}.preset_list_up`,
                    })
              }
            >
              {learningMode?.target === `${category}.preset_list_up`
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>
      {/* List Down */}
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <div className="flex justify-between items-center">
          <span className="text-gray-200">List Down</span>
          <div className="flex items-center gap-2">
            {mappings[category].preset_list_down ? (
              <span className="text-sm text-[#E6A60D]">
                Note {mappings[category].preset_list_down}
              </span>
            ) : (
              <span className="text-sm text-gray-500">Not mapped</span>
            )}
            <button
              className={`px-3 py-1 text-sm rounded ${
                learningMode?.target === `${category}.preset_list_down`
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-[#E6A60D] text-gray-900 hover:bg-yellow-500"
              }`}
              onClick={() =>
                learningMode?.target === `${category}.preset_list_down`
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "note",
                      target: `${category}.preset_list_down`,
                    })
              }
            >
              {learningMode?.target === `${category}.preset_list_down`
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMidiContext } from "../../context/MidiContext";
import SubdivisionListNavigationSection from "./SubdivisionListNavigationSection";
import SubdivisionListSection from "./SubdivisionListSection";
import SubdivisionRecallsSection from "./SubdivisionRecallsSection";

export default function SequencerView({ setInputRecalled }) {
  const { mappings, learningMode, setLearningMode } = useMidiContext();

  return (
    <>
      {/* Sequencer Start/Stop */}
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <div className="flex justify-between items-center">
          <span className="text-gray-200">Sequencer Start/Stop</span>
          <div className="flex items-center gap-2">
            {mappings.sequencer.start_stop ? (
              <span className="text-sm text-[#E6A60D]">
                Note {mappings.sequencer.start_stop}
              </span>
            ) : (
              <span className="text-sm text-gray-500">Not mapped</span>
            )}
            <button
              className={`px-3 py-1 text-sm rounded ${
                learningMode?.target === "sequencer.start_stop"
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-[#E6A60D] text-gray-900 hover:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === "sequencer.start_stop"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "note",
                      target: "sequencer.start_stop",
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === "sequencer.start_stop"
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>

      <SubdivisionRecallsSection setInputRecalled={setInputRecalled} />
      <SubdivisionListSection setInputRecalled={setInputRecalled} />
      <SubdivisionListNavigationSection setInputRecalled={setInputRecalled} />
    </>
  );
}

import { useMidiContext } from "../../context/MidiContext";
import SubdivisionListNavigationSection from "./SubdivisionListNavigationSection";
import SubdivisionListSection from "./SubdivisionListSection";
import SubdivisionRecallsSection from "./SubdivisionRecallsSection";

export default function SequencerView({ setInputRecalled }) {
  const { mappings, learningMode, setLearningMode } = useMidiContext();

  return (
    <>
      {/* Sequencer Start/Stop */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">Sequencer Start/Stop</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings.sequencer.start_stop ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                Note {mappings.sequencer.start_stop}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === "sequencer.start_stop"
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
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

      {/* Sequencer PlayMode (loop/one-shot) */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">Play Mode Loop/One-Shot</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings.sequencer.play_mode ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                Note {mappings.sequencer.play_mode}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === "sequencer.play_mode"
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === "sequencer.play_mode"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "note",
                      target: "sequencer.play_mode",
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === "sequencer.play_mode"
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

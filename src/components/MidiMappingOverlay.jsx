import { useState } from "react";
import { useMidiContext } from "../context/MidiContext";

export default function MidiMappingOverlay({
  displayMidiMapping,
  onClose,
  category, // 'global_preset', 'freq_preset', 'index_preset'
}) {
  const { mappings, learningMode, setLearningMode } = useMidiContext();
  const [mappingTarget, setMappingTarget] = useState(null);

  if (!displayMidiMapping) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-950 transition-colors duration-500 ease-in-out ${
        displayMidiMapping
          ? "bg-gray-950/90"
          : "bg-gray-950/0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-gray-900 rounded-lg shadow-lg max-w-md w-full transition-opacity duration-500 ease-in-out border-[0.5px] border-[#E6A60D] ${
          displayMidiMapping ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">
            MIDI Mapping - {category.replace("_", " ").toUpperCase()}
          </h2>

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
                  onClick={() =>
                    learningMode?.target === "sequencer.start_stop"
                      ? setLearningMode(null)
                      : setLearningMode({
                          type: "note",
                          target: "sequencer.start_stop",
                        })
                  }
                >
                  {learningMode?.target === "sequencer.start_stop"
                    ? "Listening..."
                    : "Map"}
                </button>
              </div>
            </div>
          </div>

          {/* Duration CC */}
          <div className="mb-4 p-3 bg-gray-800 rounded">
            <div className="flex justify-between items-center">
              <span className="text-gray-200">Duration</span>
              <div className="flex items-center gap-2">
                {mappings.synth_params.duration ? (
                  <span className="text-sm text-[#E6A60D]">
                    CC {mappings.synth_params.duration}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Not mapped</span>
                )}
                <button
                  className={`px-3 py-1 text-sm rounded ${
                    learningMode?.target === "synth_params.duration"
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-[#E6A60D] text-gray-900 hover:bg-yellow-500"
                  }`}
                  onClick={() =>
                    learningMode?.target === "synth_params.duration"
                      ? setLearningMode(null)
                      : setLearningMode({
                          type: "cc",
                          target: "synth_params.duration",
                        })
                  }
                >
                  {learningMode?.target === "synth_params.duration"
                    ? "Listening..."
                    : "Map"}
                </button>
              </div>
            </div>
          </div>

          {/* LowPass Freq CC */}
          <div className="mb-4 p-3 bg-gray-800 rounded">
            <div className="flex justify-between items-center">
              <span className="text-gray-200">LowPass Frequency</span>
              <div className="flex items-center gap-2">
                {mappings.synth_params.lowpass_freq ? (
                  <span className="text-sm text-[#E6A60D]">
                    CC {mappings.synth_params.lowpass_freq}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Not mapped</span>
                )}
                <button
                  className={`px-3 py-1 text-sm rounded ${
                    learningMode?.target === "synth_params.lowpass_freq"
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-[#E6A60D] text-gray-900 hover:bg-yellow-500"
                  }`}
                  onClick={() =>
                    learningMode?.target === "synth_params.lowpass_freq"
                      ? setLearningMode(null)
                      : setLearningMode({
                          type: "cc",
                          target: "synth_params.lowpass_freq",
                        })
                  }
                >
                  {learningMode?.target === "synth_params.lowpass_freq"
                    ? "Listening..."
                    : "Map"}
                </button>
              </div>
            </div>
          </div>

          {/* LowPass Q CC */}
          <div className="mb-4 p-3 bg-gray-800 rounded">
            <div className="flex justify-between items-center">
              <span className="text-gray-200">LowPass Q</span>
              <div className="flex items-center gap-2">
                {mappings.synth_params.lowpass_q ? (
                  <span className="text-sm text-[#E6A60D]">
                    CC {mappings.synth_params.lowpass_q}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Not mapped</span>
                )}
                <button
                  className={`px-3 py-1 text-sm rounded ${
                    learningMode?.target === "synth_params.lowpass_q"
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-[#E6A60D] text-gray-900 hover:bg-yellow-500"
                  }`}
                  onClick={() =>
                    learningMode?.target === "synth_params.lowpass_q"
                      ? setLearningMode(null)
                      : setLearningMode({
                          type: "cc",
                          target: "synth_params.lowpass_q",
                        })
                  }
                >
                  {learningMode?.target === "synth_params.lowpass_q"
                    ? "Listening..."
                    : "Map"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end p-4 space-x-3 bg-gray-700 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-lg bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

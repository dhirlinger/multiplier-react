import { useMidiContext } from "../../context/MidiContext";

export default function SynthFreqParamsView() {
  const { mappings, setMappings, learningMode, setLearningMode } =
    useMidiContext();

  return (
    <>
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <div className="flex justify-between items-center">
          <span className="text-gray-200">Waveshape</span>
          <div className="flex items-center gap-2">
            {mappings.synth_params.wave_shape ? (
              <span className="text-sm text-[#E6A60D]">
                Note {mappings.synth_params.wave_shape}
              </span>
            ) : (
              <span className="text-sm text-gray-500">Not mapped</span>
            )}
            <button
              className={`px-3 py-1 text-sm rounded ${
                learningMode?.target === "synth_params.wave_shape"
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-[#E6A60D] text-gray-900 hover:bg-yellow-500"
              }`}
              onClick={() =>
                learningMode?.target === "synth_params.wave_shape"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "note",
                      target: "synth_params.wave_shape",
                    })
              }
            >
              {learningMode?.target === "synth_params.wave_shape"
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
    </>
  );
}

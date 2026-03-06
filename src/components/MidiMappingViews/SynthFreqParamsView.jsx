import { useMidiContext } from "../../context/MidiContext";

export default function SynthFreqParamsView({ setInputRecalled }) {
  const { mappings, learningMode, setLearningMode } = useMidiContext();

  return (
    <>
      <h3 className="tw:text-sm tw:font-semibold tw:text-gray-300 tw:mb-1">Synth Params</h3>
      {/*wave shape*/}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">Waveshape</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings.synth_params.wave_shape ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                Note {mappings.synth_params.wave_shape}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === "synth_params.wave_shape"
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === "synth_params.wave_shape"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "note",
                      target: "synth_params.wave_shape",
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === "synth_params.wave_shape"
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>

      {/* Duration CC */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">Duration</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings.synth_params.duration ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                CC {mappings.synth_params.duration}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === "synth_params.duration"
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === "synth_params.duration"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "cc",
                      target: "synth_params.duration",
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === "synth_params.duration"
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>

      {/* LowPass Freq CC */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">LowPass Frequency</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings.synth_params.lowpass_freq ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                CC {mappings.synth_params.lowpass_freq}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === "synth_params.lowpass_freq"
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === "synth_params.lowpass_freq"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "cc",
                      target: "synth_params.lowpass_freq",
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === "synth_params.lowpass_freq"
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>

      {/* LowPass Q CC */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">LowPass Q</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings.synth_params.lowpass_q ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                CC {mappings.synth_params.lowpass_q}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === "synth_params.lowpass_q"
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === "synth_params.lowpass_q"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "cc",
                      target: "synth_params.lowpass_q",
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === "synth_params.lowpass_q"
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>
      {/* Volume CC */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">Volume</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings.synth_params.volume ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                CC {mappings.synth_params.volume}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === "synth_params.volume"
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === "synth_params.volume"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "cc",
                      target: "synth_params.volume",
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === "synth_params.volume"
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>
      {/* Panning CC */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">Panning</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings.synth_params.panning ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                CC {mappings.synth_params.panning}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === "synth_params.panning"
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === "synth_params.panning"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "cc",
                      target: "synth_params.panning",
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === "synth_params.panning"
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>
      <h3 className="tw:text-sm tw:font-semibold tw:text-gray-300 tw:mb-1">
        Frequency Params
      </h3>
      {/* Base CC */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">Base</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings.freq_params.base ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                CC {mappings.freq_params.base}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === "freq_params.base"
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === "freq_params.base"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "cc",
                      target: "freq_params.base",
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === "freq_params.base"
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>
      {/* Multipler CC */}
      <div className="tw:mb-4 tw:p-3 tw:bg-gray-800 tw:rounded">
        <div className="tw:flex tw:justify-between tw:items-center">
          <span className="tw:text-gray-200">Multiplier</span>
          <div className="tw:flex tw:items-center tw:gap-2">
            {mappings.freq_params.multiplier ? (
              <span className="tw:text-sm tw:text-[#E6A60D]">
                CC {mappings.freq_params.multiplier}
              </span>
            ) : (
              <span className="tw:text-sm tw:text-gray-500">Not mapped</span>
            )}
            <button
              className={`tw:px-3 tw:py-1 tw:text-sm tw:rounded ${
                learningMode?.target === "freq_params.multiplier"
                  ? "tw:bg-red-500 tw:text-white tw:animate-pulse"
                  : "tw:bg-[#E6A60D] tw:text-gray-900 hover:tw:bg-yellow-500"
              }`}
              onClick={() => {
                learningMode?.target === "freq_params.multiplier"
                  ? setLearningMode(null)
                  : setLearningMode({
                      type: "cc",
                      target: "freq_params.multiplier",
                    });
                setInputRecalled(false);
              }}
            >
              {learningMode?.target === "freq_params.multiplier"
                ? "Listening..."
                : "Map"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

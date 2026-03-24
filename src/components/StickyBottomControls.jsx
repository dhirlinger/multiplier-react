import Toggle from "./Toggle";

export default function StickyBottomControls({
  toggleSequencer,
  seqIsPlaying,
  handleMidiSelect,
  playMode,
  isSm,
  setSpaceBarToggle,
  spaceBarToggle,
}) {
  return (
    <>
      <div className="tw:fixed tw:bottom-0 tw:left-1/2 tw:-translate-x-1/2 tw:max-w-sm tw:w-full tw:md:w-194 tw:md:max-w-none tw:xl:w-[1160px] tw:flex tw:p-2 tw:border-t-8 tw:border-x-0 tw:border-b-0 tw:border-t-[#242424] tw:z-20 tw:bg-[#E6A60D] tw:m-0 tw:items-center">
        <button
          className={`tw:w-29.5 tw:min-w-29.5 tw:border-stone-400 tw:border ${playMode === "one-shot" ? "tw:text-pink-500" : ""}`}
          onClick={toggleSequencer}
        >
          {seqIsPlaying && playMode === "loop" ? "Stop" : "Play"}
        </button>
        {!isSm && (
          <div className="tw:w-112.5 tw:h-10.75 tw:flex tw:gap-0.5 tw:text-sm tw:mt-1 tw:mb-1 tw:pt-1 tw:pb-1 tw:border-[0.5px] tw:border-[#E6A60D] tw:bg-maxbg tw:rounded-full tw:ml-3">
            <Toggle
              handleChange={setSpaceBarToggle}
              paramMode={spaceBarToggle}
              id="spaceBarToggle"
              param1={"On"}
              param2={"Off"}
            />
          </div>
        )}
        <div className="tw:flex tw:items-center tw:gap-1 tw:ml-1.5 tw:w-full tw:justify-center">
          <a href="#global-grid">
            <button className="tw:text-sm tw:text-[#E6A60D] tw:w-[70px] tw:min-w-[70px] tw:flex tw:justify-center">
              Global
            </button>
          </a>
          <a href="#frequency-grid">
            <button className="tw:text-sm tw:text-cyan-500 tw:w-[70px] tw:min-w-[70px] tw:flex tw:justify-center-center">
              Freq
            </button>
          </a>
          <a href="#index-grid">
            <button className="tw:text-sm tw:text-pink-500/90 tw:w-[70px] tw:min-w-[70px] tw:flex tw:justify-center">
              Index
            </button>
          </a>
        </div>
        <button
          className="tw:text-xs tw:py-0.5 tw:px-2 tw:border-pink-800 tw:border tw:bg-pink-600 tw:mb-2 tw:mr-2 tw:absolute tw:bottom-0 tw:left-2"
          onClick={() => {
            handleMidiSelect("sequencer_params");
          }}
        >
          MAP
        </button>
      </div>
    </>
  );
}

export default function StickyBottomControls({
  toggleSequencer,
  seqIsPlaying,
  setMidiMappingCategory,
  setDisplayMidiMapping,
  playMode,
}) {
  return (
    <>
      <div className="sticky bottom-0 w-full flex p-2 border-t-8 border-x-0 border-b-0 border-t-[#242424] z-20 bg-[#E6A60D] m-0 relative">
        <button
          className={`w-[118px] min-w-[118px] border-stone-400 border ${playMode === "one-shot" ? "text-pink-500" : ""}`}
          onClick={toggleSequencer}
        >
          {seqIsPlaying && playMode === "loop" ? "Stop" : "Play"}
        </button>
        <div className="flex items-center gap-1 ml-1.5 w-full justify-center">
          <a href="#global-grid">
            <button className="text-sm text-[#E6A60D] w-[70px] min-w-[70px] flex justify-center">
              Global
            </button>
          </a>
          <a href="#frequency-grid">
            <button className="text-sm text-cyan-500 w-[70px] min-w-[70px] flex justify-center-center">
              Freq
            </button>
          </a>
          <a href="#index-grid">
            <button className="text-sm text-pink-500/90 w-[70px] min-w-[70px] flex justify-center">
              Index
            </button>
          </a>
        </div>
        <button
          className="text-xs py-0.5 px-2 border-pink-800 border bg-pink-600 mb-2 mr-2 absolute bottom-0 left-2"
          onClick={() => {
            setMidiMappingCategory("sequencer_params");
            setDisplayMidiMapping(true);
          }}
        >
          MAP
        </button>
      </div>
    </>
  );
}

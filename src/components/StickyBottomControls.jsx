export default function StickyBottomControls({
  toggleSequencer,
  seqIsPlaying,
  getStatus,
}) {
  return (
    <>
      <div className="sticky bottom-0 w-full flex p-2 border-t-8 border-x-0 border-b-0 border-t-[#242424] z-20 bg-[#E6A60D] m-0">
        <button
          className="w-[118px] min-w-[118px] border-stone-400 border"
          onClick={toggleSequencer}
        >
          {seqIsPlaying ? "Stop" : "Play"}
        </button>
        <div className="flex items-center gap-1 ml-1.5 w-full justify-center">
          <a href="#global-container">
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
        {/* <p className="absolute bottom-[0.5px] text-xs text-gray-100 z-30 right-0.5">
          Status: {getStatus()}
        </p> */}
      </div>
    </>
  );
}

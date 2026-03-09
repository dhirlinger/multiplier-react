import { Arrow } from "./Icon";

export default function Tempo({
  bpm,
  setBpm,
  subdivision,
  setSubdivision,
  handleMidiSelect,
}) {
  const handleRightArrowBpm = () => {
    setBpm((prev) => {
      if (Number(prev) < 995) {
        return Number(prev) + 5;
      }
      return prev;
    });
  };

  const handleLeftArrowBpm = () => {
    setBpm((prev) => {
      if (Number(prev) > 5) {
        return Number(prev) - 5;
      }
      return prev;
    });
  };

  const handleRightArrowSub = () => {
    setSubdivision((prev) => {
      if (Number(prev) < 16) {
        return Number(prev) + 1;
      }
      return prev;
    });
  };

  const handleLeftArrowSub = () => {
    setSubdivision((prev) => {
      if (Number(prev) > 1) {
        return Number(prev) - 1;
      }
      return prev;
    });
  };

  return (
    <div
      id="tempo"
      className="tw:mt-0 tw:text-sm tw:font-bold tw:w-full tw:p-2 tw:relative"
    >
      <div className="tw:flex tw:items-center tw:w-full">
        <label htmlFor="bpm" className="tw:w-22">
          BPM{" "}
        </label>
        <button
          className={`tw:flex tw:items-center tw:h-16 tw:w-16 tw:p-0 tw:border tw:border-[#E6A60D] tw:text-[#E6A60D]`}
          onClick={handleLeftArrowBpm}
        >
          <Arrow />
        </button>
        <input
          id="bpm"
          className="tw:text-[36px] tw:w-20.5 tw:border tw:border-[#E6A60D] tw:h-16"
          type="number"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
        />
        <button
          className={`tw:flex tw:items-center tw:h-16 tw:w-16 tw:p-0 tw:border tw:border-[#E6A60D] tw:text-[#E6A60D] tw:scale-x-[-1]`}
          onClick={handleRightArrowBpm}
        >
          <Arrow />
        </button>
      </div>
      <div className="tw:flex tw:items-center tw:w-full tw:mt-1">
        <label htmlFor="subdivision" className="tw:w-22">
          {" "}
          Subdivision{" "}
        </label>
        <button
          className={`tw:flex tw:items-center tw:h-16 tw:w-16 tw:p-0 tw:border tw:border-[#E6A60D] tw:text-[#E6A60D]`}
          onClick={handleLeftArrowSub}
        >
          <Arrow />
        </button>
        <input
          id="subdivision"
          type="number"
          min="1"
          max="16"
          value={subdivision}
          onChange={(e) => setSubdivision(e.target.value)}
          className={`
              ${
                bpm * subdivision >= 20 && bpm * subdivision <= 1800
                  ? "tw:text-inherit"
                  : "tw:text-mix"
              } tw:text-[36px] tw:border-[#E6A60D] tw:border tw:w-20.5 tw:h-16`}
        />
        <button
          className={`tw:flex tw:items-center tw:h-16 tw:w-16 tw:p-0 tw:border tw:border-[#E6A60D] tw:text-[#E6A60D] tw:scale-x-[-1]`}
          onClick={handleRightArrowSub}
        >
          <Arrow />
        </button>
      </div>
      <button
        className="tw:text-xs tw:py-0.5 tw:px-2 tw:border-pink-800 tw:border tw:bg-pink-600 tw:mb-2 tw:mr-2 tw:absolute tw:bottom-0 tw:right-0"
        onClick={() => {
          handleMidiSelect("sequencer_params");
        }}
      >
        MAP
      </button>
    </div>
  );
}

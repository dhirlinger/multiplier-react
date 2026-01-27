import { Arrow } from "./Icon";

export default function Tempo({ bpm, setBpm, subdivision, setSubdivision }) {
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
      className="mt-2 text-sm font-bold w-full border-[0.5px] border-[#E6A60D] p-2"
    >
      <div
        className="flex items-center w-full
      "
      >
        <label htmlFor="bpm" className="w-22">
          BPM{" "}
        </label>
        <button
          className={`flex items-center h-16 w-16 p-0 border border-[#E6A60D] text-[#E6A60D]`}
          onClick={handleLeftArrowBpm}
        >
          <Arrow />
        </button>
        <input
          id="bpm"
          className="text-[36px] w-20.5 border border-[#E6A60D] h-16"
          type="number"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
        />
        <button
          className={`flex items-center h-16 w-16 p-0 border border-[#E6A60D] text-[#E6A60D] scale-x-[-1]`}
          onClick={handleRightArrowBpm}
        >
          <Arrow />
        </button>
      </div>
      <div className="flex items-center w-full mt-1">
        <label htmlFor="subdivision" className="w-22">
          {" "}
          Subdivision{" "}
        </label>
        <button
          className={`flex items-center h-16 w-16 p-0 border border-[#E6A60D] text-[#E6A60D]`}
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
                  ? "text-inherit"
                  : "text-mix"
              } text-[36px] border-[#E6A60D] border w-20.5 h-16`}
        />
        <button
          className={`flex items-center h-16 w-16 p-0 border border-[#E6A60D] text-[#E6A60D] scale-x-[-1]`}
          onClick={handleRightArrowSub}
        >
          <Arrow />
        </button>
      </div>
    </div>
  );
}

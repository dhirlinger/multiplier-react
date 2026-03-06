export default function Duration({ duration, setAudioParam }) {
  return (
    <div id="duration-container" className="tw:w-full tw:ml-2">
      <p className="tw:block tw:font-bold">Duration</p>
      <div className="tw:flex tw:items-center tw:justify-start tw:gap-2">
        <input
          id="duration"
          type="range"
          max="1.0"
          min="0.01"
          step="0.01"
          value={duration}
          onChange={(e) => setAudioParam("duration", e.target.value)}
          className="tw:w-68"
        />
        <p className="tw:text-2xl">{Number(duration).toFixed(2)}</p>
      </div>
    </div>
  );
}

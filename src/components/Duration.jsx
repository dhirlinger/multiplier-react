export default function Duration({ duration, setAudioParam }) {
  return (
    <div id="duration-container" className="w-full ml-2">
      <p className="block font-bold">Duration</p>
      <div className="flex items-center justify-start gap-2">
        <input
          id="duration"
          type="range"
          max="1.0"
          min="0.01"
          step="0.01"
          value={duration}
          onChange={(e) => setAudioParam("duration", e.target.value)}
          className="w-68"
        />
        <p className="text-2xl">{Number(duration).toFixed(2)}</p>
      </div>
    </div>
  );
}

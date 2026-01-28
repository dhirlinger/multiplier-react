export default function LowPassFilter({ value, qValue, setAudioParam }) {
  const handleFreqChange = (e) => {
    setAudioParam("lowPassFreq", e.target.value);
  };

  const handleQChange = (e) => {
    setAudioParam("lowPassQ", e.target.value);
  };

  return (
    <div id="lfo-container" className="w-full ml-2 mb-2">
      <p className="block font-bold">LFO</p>
      <div className="flex items-center justify-start gap-2">
        <input
          type="range"
          min="500"
          max="15000"
          step="100"
          name="lopass"
          value={value}
          onChange={handleFreqChange}
          className="w-68"
        />
        <p className="text-xl">{value}Hz</p>
      </div>
      <div className="flex items-center justify-start gap-2 mt-2">
        <input
          type="range"
          min="0"
          max="22"
          step="1"
          name="q"
          value={qValue}
          onChange={handleQChange}
          className="w-68"
        />
        <p className="text-2xl">Q: {qValue}</p>
      </div>
    </div>
  );
}

export default function LowPassFilter({ value, qValue, setAudioParam }) {
  const handleFreqChange = (e) => {
    setAudioParam("lowPassFreq", e.target.value);
  };

  const handleQChange = (e) => {
    setAudioParam("lowPassQ", e.target.value);
  };

  return (
    <div id="lfo-container" className="tw:w-full tw:ml-2 tw:mb-2">
      <p className="tw:block tw:font-bold">Low Pass Filter</p>
      <div className="tw:flex tw:items-center tw:justify-start tw:gap-2">
        <input
          type="range"
          min="500"
          max="15000"
          step="100"
          name="lopass"
          value={value}
          onChange={handleFreqChange}
          className="tw:w-68"
        />
        <p className="tw:text-xl">{Math.round(value)}Hz</p>
      </div>
      <div className="tw:flex tw:items-center tw:justify-start tw:gap-2 tw:mt-2">
        <input
          type="range"
          min="0"
          max="22"
          step="1"
          name="q"
          value={qValue}
          onChange={handleQChange}
          className="tw:w-68"
        />
        <p className="tw:text-2xl">Q: {qValue}</p>
      </div>
    </div>
  );
}

export default function LowPassFilter({ value, setValue, qValue, setQValue }) {
  const handleFreqChange = (e) => {
    setValue(e.target.value);
  };

  const handleQChange = (e) => {
    setQValue(e.target.value);
  };

  return (
    <>
      <p style={{ margin: "0" }}>{value}Hz</p>
      <input
        type="range"
        min="500"
        max="15000"
        step="100"
        name="lopass"
        value={value}
        onChange={handleFreqChange}
      />
      <p style={{ margin: "0" }}>Q: {qValue}</p>
      <input
        type="range"
        min="0"
        max="22"
        step="1"
        name="q"
        value={qValue}
        onChange={handleQChange}
      />
    </>
  );
}

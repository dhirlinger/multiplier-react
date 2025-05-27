export default function BaseMultiplier({
  base,
  setBase,
  multiplier,
  setMultiplier,
}) {
  //   const [baseValue, setBaseValue] = useState("");
  //   const [multiplierValue, setMutliplierValue] = useState("");

  const handleBaseChange = (e) => {
    let inputValue = e.target.value;

    // Only allow ints and floats
    //if (/^-?\d+(\.\d+)?$/.test(inputValue)) {
    //setBaseValue(inputValue);
    setBase(inputValue);
    //}
    // If input is invalid, do nothing (no update)
  };

  return (
    <div style={{ margin: "15px" }}>
      <label htmlFor="base">Base: </label>
      <input
        id="base"
        type="text" // use text to fully control input
        value={base}
        maxLength={10}
        style={{ width: "100px", fontSize: "36px" }}
        onChange={handleBaseChange}
      ></input>
      <input
        type="range"
        max="10000"
        min="40"
        step="10"
        value={base}
        onChange={(e) => setBase(e.target.value)}
      />
      <div>
        <span style={{ width: "100px" }}>Multiplier: </span>
        <input
          type="range"
          max="10"
          min="0.1"
          step="0.1"
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
        />
        <span style={{ width: "50px" }}>{Number(multiplier).toFixed(1)}</span>
      </div>
    </div>
  );
}

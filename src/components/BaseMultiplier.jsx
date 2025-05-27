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

  const handleMultiplierChange = (e) => {
    let inputValue = e.target.value;

    // Only allow a single digit between 0 and 8
    //if (/^[0-10]?$/.test(inputValue)) {
    //setMutliplierValue(inputValue);
    setMultiplier(inputValue);
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

      <label htmlFor="multiplier">Multiplier: </label>
      <input
        id="multiplier"
        type="text" // use text to fully control input
        value={multiplier}
        //   maxLength={1}
        style={{ width: "50px", fontSize: "36px" }}
        onChange={handleMultiplierChange}
      ></input>
    </div>
  );
}

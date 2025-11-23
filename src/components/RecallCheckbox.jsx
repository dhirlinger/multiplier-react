export default function RecallCheckbox({ stateRecall, handleChange, text }) {
  return (
    <>
      <label className="flex mr-[4px] items-center">
        <input
          className="mr-[4px] form-checkbox"
          type="checkbox"
          checked={stateRecall}
          onChange={handleChange}
        ></input>
        {text}
      </label>
    </>
  );
}

export default function RecallCheckbox({ stateRecall, handleChange, text }) {
  return (
    <>
      <label className="tw:flex tw:mr-[4px] tw:items-center">
        <input
          className="tw:mr-[4px] tw:form-checkbox"
          type="checkbox"
          checked={stateRecall}
          onChange={handleChange}
        ></input>
        {text}
      </label>
    </>
  );
}

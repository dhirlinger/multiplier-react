import React from "react";

export default function IndexArray({
  indexData,
  indexIdRef,
  handleSelect,
  indexObj,
}) {
  return (
    <div style={{ border: "solid 1px", paddingTop: "10px" }}>
      <label htmlFor="indexId" style={{ fontWeight: "bold" }}>
        Index Array:
      </label>
      <select
        ref={indexIdRef}
        name="indexId"
        id="indexId"
        onChange={handleSelect}
        style={{ marginLeft: "10px" }}
      >
        <option>Choose List Preset</option>
        {indexData.map((item) => (
          <option key={item.array_id} value={item.array_id}>
            {item.array_name}
          </option>
        ))}
      </select>
      <p>
        {indexObj
          ? indexObj.index_array.replace(/,/g, ", ")
          : "No List Preset Selected"}
      </p>
    </div>
  );
}

import React from "react";

export default function IndexArray({ indexData, indexIdRef, handleSelect }) {
  return (
    <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
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
            {item.array_name}: {item.index_array}
          </option>
        ))}
      </select>
    </div>
  );
}

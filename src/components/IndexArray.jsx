import React from "react";
import { Refresh } from "./Icon";

export default function IndexArray({
  indexData,
  indexId,
  handleSelect,
  refreshIndexObj,
  indexPresetName,
  setIndexPresetName,
}) {
  const handleName = (e) => {
    e.key === "Enter" && setIndexPresetName(e.target.value);
  };
  return (
    <div
      style={{
        paddingTop: "10px",
        paddingBottom: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <label htmlFor="indexId" style={{ fontWeight: "bold" }}>
        Index Array:
      </label>
      <select
        value={indexId}
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
      <button className="refresh" onClick={refreshIndexObj}>
        <Refresh />
      </button>
      <input
        style={{ display: "block" }}
        name="preset-name"
        value={indexPresetName}
        onKeyDown={handleName}
      />
    </div>
  );
}

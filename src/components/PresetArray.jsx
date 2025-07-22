import React from "react";

export default function PresetArray({
  presetData,
  presetIdRef,
  handleSelect,
  presetObj,
}) {
  return (
    <div style={{ border: "solid 1px", paddingTop: "10px" }}>
      <label htmlFor="presetId" style={{ fontWeight: "bold" }}>
        Preset:
      </label>
      <select
        ref={presetIdRef}
        name="presetId"
        id="presetId"
        onChange={handleSelect}
        style={{ marginLeft: "10px" }}
      >
        <option>Choose Preset</option>
        {presetData.map((item) => (
          <option key={item.preset_id} value={item.preset_id}>
            {item.preset_id}
          </option>
        ))}
      </select>
      <p>{presetObj ? JSON.stringify(presetObj) : "error preset"}</p>
      <p>{presetData ? JSON.stringify(presetData) : "error presetData"}</p>
    </div>
  );
}

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
            {item.name ? ": " + item.name : ": NO NAME"}
          </option>
        ))}
      </select>
      <p style={{ overflowWrap: "anywhere" }}>
        {presetObj ? JSON.stringify(presetObj) : "no preset selected"}
      </p>
    </div>
  );
}

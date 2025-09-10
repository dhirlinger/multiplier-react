import React from "react";
import { Refresh } from "./Icon";

export default function PresetArray({
  presetData,
  presetIdRef,
  handleSelect,
  presetObj,
  refreshPresetObj,
}) {
  return (
    <div style={{ border: "solid 1px", paddingTop: "10px" }}>
      <label htmlFor="presetId" style={{ fontWeight: "bold" }}>
        Global Preset:
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
      <button className="refresh" onClick={refreshPresetObj}>
        <Refresh />
      </button>
      <p style={{ overflowWrap: "anywhere" }}>
        {presetObj ? JSON.stringify(presetObj) : "no preset selected"}
      </p>
    </div>
  );
}

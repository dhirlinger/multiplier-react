import React from "react";
import { Refresh } from "./Icon";

export default function IndexArray({
  indexData,
  //indexIdRef,
  indexId,
  handleSelect,
  refreshIndexObj,
}) {
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
        //ref={indexIdRef}
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
    </div>
  );
}

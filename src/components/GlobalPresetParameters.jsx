import { useState } from "react";

export default function GlobalPresetParameters({ findByPresetNumRef }) {
  //parameters view
  const [paramsVisible, setParamsVisible] = useState(false);

  return (
    <div className="text-sm mb-1.5" style={{ overflowWrap: "anywhere" }}>
      <p
        className="cursor-pointer p-2.5 bg-maxbg border-solid border-[#E6A60D] border-[0.5px]"
        onClick={() => setParamsVisible(!paramsVisible)}
      >
        PRESET PARAMETERS
      </p>
      <p className={`${paramsVisible ? "block" : "hidden"} bg-maxbg py-1.5`}>
        {findByPresetNumRef.current === undefined
          ? "EMPTY PRESET"
          : Object.keys(findByPresetNumRef.current.params_json).map((key) => (
              <span key={key} className="me-1">
                | {key}: {String(findByPresetNumRef.current.params_json[key])} |
              </span>
            ))}
      </p>
    </div>
  );
}

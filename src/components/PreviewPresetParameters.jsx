import { useState } from "react";
import PreviewDisplay from "./PresetDisplay";

export default function PreviewPresetParameters({
  findByPresetNumRef,
  category,
}) {
  //parameters view
  const [paramsVisible, setParamsVisible] = useState(false);

  return (
    <div className="text-sm mb-1.5" style={{ overflowWrap: "anywhere" }}>
      <p
        className="cursor-pointer p-2.5 bg-maxbg border-solid border-[#E6A60D] border-[0.5px]"
        onClick={() => setParamsVisible(!paramsVisible)}
      >
        PREVIEW PRESET PARAMETERS
      </p>
      <p className={`${paramsVisible ? "block" : "hidden"} bg-maxbg py-1.5`}>
        {findByPresetNumRef.current === undefined ? (
          "EMPTY PRESET"
        ) : (
          <PreviewDisplay
            findByPresetNumRef={findByPresetNumRef}
            category={category}
          />
        )}
      </p>
    </div>
  );
}

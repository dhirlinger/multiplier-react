import { useState } from "react";
import PreviewDisplay from "./PresetDisplay";

export default function PreviewPresetParameters({
  findByPresetNumRef,
  category,
  colors,
}) {
  //parameters view
  const [paramsVisible, setParamsVisible] = useState(false);

  return (
    <div className="tw:text-sm tw:mb-1.5" style={{ overflowWrap: "anywhere" }}>
      <p
        className={`tw:cursor-pointer tw:p-2.5 tw:bg-maxbg hover:tw:bg-stone-700 tw:border-solid ${colors.border} tw:border-[0.5px]`}
        onClick={() => setParamsVisible(!paramsVisible)}
      >
        PREVIEW PRESET PARAMETERS
      </p>
      <p className={`${paramsVisible ? "tw:block" : "tw:hidden"} tw:bg-maxbg tw:py-1.5`}>
        {!findByPresetNumRef.current ? (
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

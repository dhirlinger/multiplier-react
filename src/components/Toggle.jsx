import { useState } from "react";
import {
  capitalizeAllWords,
  modeTrim,
  camelCaseToNormal,
} from "../assets/helpers";

export default function Toggle({
  handleChange,
  id,
  paramMode,
  param1,
  param2,
}) {
  const [checked, setChecked] = useState(true);

  return (
    <>
      <label className="tw:relative tw:inline-block tw:w-15 tw:h-8.5 tw:border tw:border-pink-500/90 tw:rounded-[34px] tw:ml-1 tw:mr-1">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => {
            const mode = e.target.checked ? param1 : param2;
            handleChange(mode);
            setChecked(e.target.checked);
          }}
          className="tw:opacity-0 tw:w-0 tw:h-0 tw:peer"
        />
        <span className="tw:absolute tw:cursor-pointer tw:top-0 tw:left-0 tw:right-0 tw:bottom-0 tw:bg-black tw:rounded-[34px] tw:transition-all tw:duration-100 peer-checked:tw:bg-pink-500/90 peer-focus:tw:shadow-[0_0_1px_rgb(236_72_153/0.9)] before:tw:content-[''] before:tw:absolute before:tw:h-6.5 before:tw:w-6.5 before:tw:left-1 before:tw:bottom-1 before:tw:bg-white before:tw:rounded-full before:tw:transition-all before:tw:duration-100 peer-checked:before:tw:translate-x-6.5"></span>
      </label>
      <p className="tw:leading-[2.4] tw:font-bold">
        {camelCaseToNormal(capitalizeAllWords(id))}:
        <span className="tw:font-normal">
          {" "}
          {paramMode && capitalizeAllWords(modeTrim(paramMode))}
        </span>
      </p>
    </>
  );
}

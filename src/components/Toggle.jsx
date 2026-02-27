import { useState } from "react";
import { capitalizeFirstLetter } from "../assets/helpers";

export default function Toggle({
  handleChange,
  id,
  paramMode,
  param1,
  param2,
}) {
  const [checked, setChecked] = useState(true);
  const modeTrim = (string) => {
    return string.split("_")[0];
  };
  const capitalizeHyphen = (string) => {
    string.replace(/-(\w)/g, (match, p1) => {
      return "-" + p1.toUpperCase();
    });
  };
  return (
    <>
      <label className="relative inline-block w-15 h-8.5 border border-pink-500/90 rounded-[34px] ml-1 mr-1">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => {
            const mode = e.target.checked ? param1 : param2;
            handleChange(mode);
            setChecked(e.target.checked);
          }}
          className="opacity-0 w-0 h-0 peer"
        />
        <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-black rounded-[34px] transition-all duration-100 peer-checked:bg-pink-500/90 peer-focus:shadow-[0_0_1px_rgb(236_72_153/0.9)] before:content-[''] before:absolute before:h-6.5 before:w-6.5 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-100 peer-checked:before:translate-x-6.5"></span>
      </label>
      <p className="leading-[2.4] font-bold">
        Update Mode:
        <span className="font-normal">
          {" "}
          {paramMode && capitalizeFirstLetter(modeTrim(paramMode))}
        </span>
      </p>
    </>
  );
}

import { useCallback } from "react";
import {
  normalizePresets,
  findByArrayId,
  findByPresetNum,
  filterData,
} from "../assets/helpers";

export default function usePresetActions(config) {
  const {
    setPresetNum,
    setPresetName,
    data,
    setData,
    idField, // "preset_id" or "array_id"
    setObj,
    buildSaveJSON,
    refreshObj,
    post,
    del,
    loginStatusRef,
    confirmPropsRef,
    setDisplayConfirm,
    setInputRecalled = () => {},
  } = config;

  const handleSelect = useCallback(
    (presetNum, objPresetNum) => {
      if (!presetNum) return;

      console.log(JSON.stringify(objPresetNum));
      if (Number(objPresetNum) === presetNum) {
        console.log(JSON.stringify(objPresetNum));
        console.log("refresh was called");
        refreshObj();
        return;
      }

      const findBy = findByPresetNum(data, presetNum);

      if (findBy === undefined) {
        return;
      } else {
        console.log("selectObj etc");
        const selectedObj = filterData(data, findBy.array_id, idField);
        setObj(selectedObj);
        setInputRecalled(true);
      }
    },
    [data, idField, refreshObj, setInputRecalled, setObj]
  );
  return { handleSelect };
}

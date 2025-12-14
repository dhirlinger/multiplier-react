import { useCallback } from "react";
import {
  normalizePresets,
  findByArrayId,
  findByPresetNum,
  filterData,
} from "../assets/helpers";

export default function usePresetActions(config) {
  const {
    presetNum,
    presetName,
    setPresetNum,
    setPresetName,
    data,
    setData,
    setId,
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

  const handleSelect = useCallback(() => {
    if (!presetNum) return;

    const obj = config.objRef?.current;

    if (obj && Number(obj.preset_number) === presetNum) {
      refreshObj();
      return;
    }

    const findBy = findByPresetNum(data, presetNum);

    if (findBy === undefined) {
      return;
    } else {
      setId(findBy.array_id);
      const selectedObj = filterData(data, findBy.array_id, idField);
      setObj(selectedObj);
      setInputRecalled(true);
    }
  }, []);
}

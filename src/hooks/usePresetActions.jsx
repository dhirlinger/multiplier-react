import { useCallback } from "react";
import {
  normalizePresets,
  findByPresetNum,
  filterData,
} from "../assets/helpers";

export default function usePresetActions(config) {
  const {
    dataRef,
    setData,
    idField, // "preset_id" or "array_id"
    setObj,
    buildSaveJSON,
    savePath,
    deletePath,
    refreshObj,
    post,
    del,
    loginStatusRef,
    confirmPropsRef,
    setDisplayConfirm,
    setInputRecalled = () => {},
  } = config;

  const logged_in = loginStatusRef.current?.logged_in;

  const handleSelect = useCallback(
    (presetNum, objPresetNum) => {
      if (!presetNum) return;
      if (Number(objPresetNum) === presetNum) {
        refreshObj();
        return;
      }

      const findBy = findByPresetNum(dataRef.current, presetNum);

      if (findBy === undefined) {
        return;
      } else {
        const selectedObj = filterData(
          dataRef.current,
          findBy[idField],
          idField
        );
        setObj(selectedObj);
        setInputRecalled(true);
      }
    },
    [dataRef, idField, refreshObj, setInputRecalled, setObj]
  );

  const save = useCallback(async () => {
    setDisplayConfirm(false);

    const saveJSON = buildSaveJSON();
    const result = await post(`multiplier-api/v1/${savePath}`, saveJSON);

    const normalizedData = normalizePresets(result.updated_data);

    setData(normalizedData);
    setInputRecalled(true);
  }, [
    buildSaveJSON,
    post,
    savePath,
    setData,
    setDisplayConfirm,
    setInputRecalled,
  ]);

  const confirmSave = useCallback(
    (presetNum, presetName) => {
      if (!logged_in) {
        alert("You must login via patreon to access this feature");
        return;
      }

      if (presetNum < 1 || presetNum > 50) {
        return;
      }

      if (presetName === "-EMPTY-") {
        confirmPropsRef.current = {
          action: "Name",
          handler: () => setDisplayConfirm(false),
        };
        setDisplayConfirm(true);
        return;
      }

      const findBy = findByPresetNum(dataRef.current, presetNum);

      if (findBy !== undefined) {
        confirmPropsRef.current = {
          action: "Overwrite",
          num: presetNum,
          name: presetName,
          filler: " with",
          handler: save,
        };
        setDisplayConfirm(true);
      } else {
        save();
      }
    },
    [dataRef, logged_in, confirmPropsRef, setDisplayConfirm, save]
  );

  const deletePreset = useCallback(
    async (presetNum) => {
      console.log("deletePreset called with:", presetNum);
      setDisplayConfirm(false);

      const findBy = findByPresetNum(dataRef.current, presetNum);
      console.log("findBy result:", JSON.stringify(findBy));
      console.log("idField:", idField);
      console.log("findBy[idField]:", findBy[idField]);
      const result = await del(
        `multiplier-api/v1/${deletePath}/${findBy[idField]}`
      );
      console.log("Delete result:", JSON.stringify(result));
      const normalizedData = normalizePresets(result.updated_data);
      setData(normalizedData);
      setInputRecalled(false);
    },
    [
      dataRef,
      del,
      deletePath,
      idField,
      setData,
      setDisplayConfirm,
      setInputRecalled,
    ]
  );

  const confirmDelete = useCallback(
    (presetNum, presetName) => {
      if (!logged_in) {
        alert("You must login via patreon to access this feature");
        return;
      }
      if (presetNum < 1 || presetNum > 50) {
        return;
      }

      const findBy = findByPresetNum(dataRef.current, presetNum);

      if (findBy === undefined) {
        return;
      }
      confirmPropsRef.current = {
        action: "Delete",
        num: presetNum,
        name: presetName,
        filler: ":",
        handler: () => deletePreset(presetNum),
      };

      setDisplayConfirm(true);
    },
    [confirmPropsRef, dataRef, deletePreset, logged_in, setDisplayConfirm]
  );

  return { handleSelect, confirmSave, confirmDelete };
}

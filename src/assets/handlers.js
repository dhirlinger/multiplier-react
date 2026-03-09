export const recall = (handlerParams) => {
  if (
    handlerParams.obj &&
    Number(handlerParams.obj.preset_number) === handlerParams.presetNum
  ) {
    handlerParams.refreshObj;
    return;
  }

  const findByPresetNum = handlerParams.data.find(
    (item) => item && Number(item.preset_number) === handlerParams.presetNum,
  );

  if (findByPresetNum === undefined) {
    alert("EMPTY PRESET");
    return;
  } else {
    handlerParams.setId(findByPresetNum.array_id);
    const selectedObj = filterData(
      handlerParams.data,
      findByPresetNum.handlerParams.preset_id,
      "array_id",
    );
    handlerParams.setObj(selectedObj);
  }
};

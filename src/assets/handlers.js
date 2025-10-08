// const filterData = (data, id, key) => {
//   const o = data.filter((obj) => obj && obj[key] === id);
//   //console.log(`filterData: ${JSON.stringify(o[0])}`);
//   return o[0];
// };

// export const handleFreqSelect = () => {
//   if (freqObj && Number(freqObj.preset_number) === freqPresetNum) {
//     refreshFreqObj();
//     return;
//   }

//   const findByPresetNum = freqData.find(
//     (item) => item && Number(item.preset_number) === freqPresetNum
//   );

//   if (findByPresetNum === undefined) {
//     alert("EMPTY PRESET");
//     return;
//   } else {
//     setFreqId(findByPresetNum.array_id);
//     const selectedObj = filterData(
//       freqData,
//       findByPresetNum.array_id,
//       "array_id"
//     );
//     console.log(`sel: ${JSON.stringify(selectedObj)}`);
//     setFreqObj(selectedObj);
//   }
// };

export const recall = (handlerParams) => {
  if (
    handlerParams.obj &&
    Number(handlerParams.obj.preset_number) === handlerParams.presetNum
  ) {
    handlerParams.refreshObj;
    return;
  }

  const findByPresetNum = handlerParams.data.find(
    (item) => item && Number(item.preset_number) === handlerParams.presetNum
  );

  if (findByPresetNum === undefined) {
    alert("EMPTY PRESET");
    return;
  } else {
    handlerParams.setId(findByPresetNum.array_id);
    const selectedObj = filterData(
      handlerParams.data,
      findByPresetNum.handlerParams.preset_id,
      "array_id"
    );
    console.log(`sel: ${JSON.stringify(selectedObj)}`);
    handlerParams.setObj(selectedObj);
  }
};

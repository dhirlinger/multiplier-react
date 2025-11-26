export const findByArrayId = (arrId, data) => {
  const result = data.find(data.array_id === arrId);
  return result;
};

export const normalizePresets = (arr, num = 50, key = "preset_number") => {
  const filled = Array(num).fill(null);
  arr.forEach((item) => {
    const slot = item[key]; // usually 1–50
    if (slot >= 1 && slot <= num) {
      filled[slot - 1] = item;
    }
  });
  return filled;
};

export const filterData = (data, id, key) => {
  const o = data.filter((obj) => obj && obj[key] === id);
  return o[0];
};

//keep data in order by preset_number
export const sortArr = (data, setData) => {
  const sortedArr = [...data];
  sortedArr.sort((a, b) => a.preset_number - b.preset_number);
  setData(sortedArr);
};

export const findByPresetNum = (data, presetNum) => {
  return data.find((item) => item && Number(item.preset_number) === presetNum);
};

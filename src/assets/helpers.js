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

//scale midi input
export const scaleMidiExp = (value, outMin, outMax) => {
  outMin = Number(outMin);
  outMax = Number(outMax);
  const norm = value / 127; // 0–1
  return outMin * Math.pow(outMax / outMin, norm);
};

export const scaleMidi = (value, outMin, outMax) => {
  outMin = Number(outMin);
  outMax = Number(outMax);
  return outMin + ((value - 0) * (outMax - outMin)) / (127 - 0);
};

export const scaleMidiRounded = (value, outMin, outMax) => {
  outMin = Number(outMin);
  outMax = Number(outMax);
  return Math.round(outMin + (value / 127) * (outMax - outMin));
};

export const scaleMidiToStep = (value, outMin, outMax) => {
  outMin = Number(outMin);
  outMax = Number(outMax);
  const steps = outMax - outMin;
  return outMin + Math.floor((value / 127) * steps);
};

export const scaleMidiToSteppedFloat = (
  value,
  outMin,
  outMax,
  decimals = 2,
) => {
  outMin = Number(outMin);
  outMax = Number(outMax);
  const v = Math.min(127, Math.max(0, value));

  const factor = Math.pow(10, decimals);
  const steps = Math.round((outMax - outMin) * factor);

  const stepped = outMin + Math.floor((v / 127) * steps) / factor;

  return Number(stepped.toFixed(decimals));
};

export const capitalizeFirstLetter = (string) => {
  if (typeof string !== "string" || string.length === 0) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

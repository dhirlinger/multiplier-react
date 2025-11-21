export const presetDefault = [
  {
    preset_number: "1",
    preset_id: "1",
    name: "DEFAULT",
    params_json: {
      tempo: 600,
      duration: 1,
      lowpass_q: 10,
      wave_shape: "square",
      lowpass_freq: 5000,
    },
    user_id: "1",
  },
];
export const freqArrDefault = [
  {
    preset_number: "1",
    array_id: "1",
    name: "DEFAULT",
    base_freq: 110,
    multiplier: 1,
    user_id: "1",
    params_json: {
      multiplier_max: 12.75,
      multiplier_min: 0.425,
      multiplier_step: 0.425,
      base_max: 11000,
      base_min: 30,
      base_step: 1,
    },
  },
  {
    preset_number: "2",
    array_id: "2",
    name: "DEFAULT2",
    base_freq: 100,
    multiplier: 1.7,
    user_id: "1",
    params_json: {
      base_max: 1000,
      base_min: 40,
      base_step: 10,
      multiplier_max: 10,
      multiplier_min: 0.1,
      multiplier_step: 0.1,
    },
  },
  {
    preset_number: "3",
    array_id: "3",
    name: "DEFAULT3",
    base_freq: 110,
    multiplier: 1.5,
    user_id: "1",
    params_json: {
      base_max: 1000,
      base_min: 40,
      base_step: 10,
      multiplier_max: 10,
      multiplier_min: 0.1,
      multiplier_step: 0.1,
    },
  },
];
export const indexArrDefault = [
  {
    preset_number: "1",
    array_id: "1",
    name: "DEFAULT",
    index_array: "1,3,8,4,2",
    user_id: "1",
  },
];

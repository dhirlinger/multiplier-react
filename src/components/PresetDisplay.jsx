import {
  frequencyToMidi,
  midiNumberToNoteName,
} from "../assets/noteConversions";

export default function PreviewDisplay({ findByPresetNumRef, category }) {
  const createFreqArray = () => {
    const arr = [];
    if (category === "Frequency Array") {
      if (findByPresetNumRef.current.multiplier === "1") {
        arr.push(formatDecimal(findByPresetNumRef.current.base_freq, 3));

        for (let i = 2; i < 9; i++) {
          arr.push(
            formatDecimal(
              findByPresetNumRef.current.base_freq *
                i *
                findByPresetNumRef.current.multiplier,
              3
            )
          );
        }
      } else {
        arr.push(formatDecimal(findByPresetNumRef.current.base_freq, 3));
        arr.push(
          formatDecimal(
            findByPresetNumRef.current.base_freq *
              findByPresetNumRef.current.multiplier,
            3
          )
        );
        for (let i = 2; i < 8; i++) {
          arr.push(
            formatDecimal(
              findByPresetNumRef.current.base_freq *
                i *
                findByPresetNumRef.current.multiplier,
              3
            )
          );
        }
      }
    }
    return arr;
  };

  function formatDecimal(number, maxDecimalPlaces) {
    const strNum = String(number);
    if (strNum.includes(".")) {
      const parts = strNum.split(".");
      if (parts[1].length > maxDecimalPlaces) {
        return Number(number.toFixed(maxDecimalPlaces));
      }
    }
    return number;
  }
  return (
    <>
      {category === "Global" &&
        Object.keys(findByPresetNumRef.current.params_json).map((key) => (
          <span key={key} className="me-1">
            | {key}: {String(findByPresetNumRef.current.params_json[key])} |
          </span>
        ))}
      {category === "Global" &&
        Object.keys(findByPresetNumRef.current.freq_json).map((key) => (
          <span key={key} className="me-1">
            | {key}: {String(findByPresetNumRef.current.freq_json[key])} |
          </span>
        ))}
      {category === "Frequency Array" && (
        <>
          <span className="me-1">
            In Hertz: {createFreqArray().join(", ")} |
          </span>
          <span className="me-1">
            Nearest Note:{" "}
            {createFreqArray()
              .map((item) => midiNumberToNoteName(frequencyToMidi(item)))
              .join(", ")}{" "}
          </span>
        </>
      )}
      {category === "Index Array" && (
        <span className="me-1">
          | {String(findByPresetNumRef.current.index_array)} |
        </span>
      )}
    </>
  );
}

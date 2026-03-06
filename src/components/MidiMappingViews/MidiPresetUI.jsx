import { useEffect } from "react";
import { useMidiContext } from "../../context/MidiContext";
import { Arrow } from "../Icon";
import { findByPresetNum } from "../../assets/helpers";

export default function MidiPresetUI({
  loginStatusRef,
  setCursorInTextBox,
  setMidiConfirm,
  inputRecalled,
  setInputRecalled,
}) {
  const {
    midiPresetNum,
    setMidiPresetNum,
    midiPresetName,
    setMidiPresetName,
    midiPresetData,
    recallMidiPreset,
    saveMidiPreset,
    deleteMidiPreset,
  } = useMidiContext();

  // const logged_in = loginStatusRef?.current?.logged_in;

  // console.log(`logged_in: ${logged_in}`);

  // Update name when preset number changes
  useEffect(() => {
    if (!midiPresetNum) return;

    const preset = findByPresetNum(midiPresetData, midiPresetNum);
    setMidiPresetName(preset?.name || "-EMPTY-");
  }, [midiPresetNum, midiPresetData, setMidiPresetName]);

  const handleLeftArrow = () => {
    setInputRecalled(false);
    setMidiPresetNum((prev) => (prev <= 1 ? 50 : prev - 1));
  };

  const handleRightArrow = () => {
    setInputRecalled(false);
    setMidiPresetNum((prev) => (prev >= 50 ? 1 : prev + 1));
  };

  const handleRecall = () => {
    const preset = findByPresetNum(midiPresetData, midiPresetNum);
    if (preset) {
      recallMidiPreset(midiPresetNum);
      setInputRecalled(true);
    } else {
      setInputRecalled(false);
    }
  };

  const handleSave = () => {
    const logged_in = loginStatusRef?.current?.logged_in;

    if (!logged_in) {
      alert("You must login via patreon to access this feature");
      return;
    }
    if (midiPresetName === "-EMPTY-") {
      setMidiConfirm({
        action: "Name",
        handler: () => {
          setMidiConfirm(null);
        },
      });
      return;
    }

    const findBy = findByPresetNum(midiPresetData, midiPresetNum);

    if (findBy) {
      setMidiConfirm({
        action: "Overwrite",
        presetNum: midiPresetNum,
        presetName: midiPresetName,
        filler: " with",
        handler: () => {
          saveMidiPreset();
          setInputRecalled(true);
          setMidiConfirm(null);
        },
      });
    } else {
      saveMidiPreset();
      setInputRecalled(true);
    }
  };

  const handleDelete = () => {
    const findBy = findByPresetNum(midiPresetData, midiPresetNum);
    if (!findBy) return;

    setMidiConfirm({
      action: "Delete",
      presetNum: midiPresetNum,
      presetName: midiPresetName,
      filler: ":",
      handler: () => {
        deleteMidiPreset(midiPresetNum);
        setInputRecalled(false);
        setMidiConfirm(null);
      },
    });
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value === "-EMPTY-") {
      alert("-EMPTY- is a forbidden preset name.");
      return;
    }
    setMidiPresetName(value);
  };

  return (
    <div className="tw:mb-2">
      {/* Buttons row */}
      <div className="tw:flex tw:gap-1 tw:mb-1">
        <button
          onClick={handleRecall}
          className="tw:flex-1 tw:px-2 tw:py-2 tw:text-xs tw:text-gray-200 tw:rounded tw:border-[#E6A60D]"
        >
          RECALL
        </button>
        <button
          onClick={handleSave}
          className="tw:flex-1 tw:px-2 tw:py-2 tw:text-xs tw:bg-[#E6A60D] tw:text-gray-900 tw:rounded hover:tw:bg-yellow-500"
        >
          SAVE
        </button>
        <button
          onClick={handleDelete}
          className="tw:flex-1 tw:px-2 tw:py-2 tw:text-xs tw:bg-red-600 tw:text-white tw:rounded hover:tw:bg-red-500"
        >
          DELETE
        </button>
      </div>

      {/* Number, arrows, name row */}
      <div className="tw:flex tw:gap-0.5">
        <button
          onClick={handleLeftArrow}
          className="tw:flex tw:items-center tw:w-1/9 tw:aspect-square tw:p-0 tw:border tw:border-[#E6A60D] tw:text-[#E6A60D] tw:rounded hover:tw:bg-gray-600"
        >
          <Arrow />
        </button>

        <div className="tw:flex tw:items-center tw:justify-center tw:w-8 tw:aspect-square tw:text-[#E6A60D] tw:border tw:border-[#E6A60D] tw:text-sm tw:font-bold tw:rounded">
          {midiPresetNum}
        </div>

        <button
          onClick={handleRightArrow}
          className="tw:flex tw:items-center tw:w-1/9 tw:aspect-square tw:p-0 tw:border tw:border-[#E6A60D] tw:text-[#E6A60D] tw:rounded hover:tw:bg-gray-600 tw:scale-x-[-1]"
        >
          <Arrow />
        </button>

        <input
          type="text"
          value={midiPresetName}
          onChange={handleNameChange}
          onFocus={() => setCursorInTextBox(true)}
          onBlur={() => setCursorInTextBox(false)}
          placeholder="MIDI PRESET NAME"
          maxLength={15}
          //flex-1 px-2 bg-gray-700
          className={`tw:flex-1 tw:px-2 tw:border tw:border-[#E6A60D] tw:text-center ${
            inputRecalled ? "tw:text-inherit" : "tw:text-mix"
          } tw:text-sm tw:rounded`}
        />
      </div>
    </div>
  );
}

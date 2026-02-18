import { useEffect } from "react";
import { useMidiContext } from "../../context/MidiContext";
import { Arrow } from "../Icon";
import { findByPresetNum } from "../../assets/helpers";

export default function MidiPresetUI({ loginStatusRef, setCursorInTextBox }) {
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

  const logged_in = loginStatusRef?.current?.logged_in;

  console.log(`logged_in: ${logged_in}`);

  // Update name when preset number changes
  useEffect(() => {
    if (!midiPresetNum) return;

    const preset = findByPresetNum(midiPresetData, midiPresetNum);
    setMidiPresetName(preset?.name || "--EMPTY--");
  }, [midiPresetNum, midiPresetData, setMidiPresetName]);

  const handleLeftArrow = () => {
    setMidiPresetNum((prev) => (prev <= 1 ? 50 : prev - 1));
  };

  const handleRightArrow = () => {
    setMidiPresetNum((prev) => (prev >= 50 ? 1 : prev + 1));
  };

  const handleRecall = () => {
    const preset = findByPresetNum(midiPresetData, midiPresetNum);
    if (preset) {
      recallMidiPreset(midiPresetNum);
    }
  };

  const handleSave = () => {
    const logged_in = loginStatusRef?.current?.logged_in;

    console.log(`logged_in: ${logged_in}`);

    console.log("loginStatusRef:", loginStatusRef);
    console.log("current:", loginStatusRef?.current);

    if (!logged_in) {
      alert("You must login via patreon to access this feature");
      return;
    }
    if (midiPresetName === "--EMPTY--") {
      alert("Please enter a preset name");
      return;
    }
    saveMidiPreset();
  };

  const handleDelete = () => {
    if (!logged_in) {
      alert("You must login via patreon to access this feature");
      return;
    }
    const preset = findByPresetNum(midiPresetData, midiPresetNum);
    if (!preset) return;

    deleteMidiPreset(midiPresetNum);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value === "--EMPTY--") {
      alert("--EMPTY-- is a forbidden preset name.");
      return;
    }
    setMidiPresetName(value);
  };

  return (
    <div className="mb-2">
      {/* Buttons row */}
      <div className="flex gap-1 mb-1">
        <button
          onClick={handleRecall}
          className="flex-1 px-2 py-2 text-xs bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
        >
          RECALL
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-2 py-2 text-xs bg-[#E6A60D] text-gray-900 rounded hover:bg-yellow-500"
        >
          SAVE
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 px-2 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-500"
        >
          DELETE
        </button>
      </div>

      {/* Number, arrows, name row */}
      <div className="flex gap-1">
        <button
          onClick={handleLeftArrow}
          className="flex items-center w-1/9 aspect-square p-0 border bg-gray-700 text-[#E6A60D] rounded hover:bg-gray-600"
        >
          <Arrow />
        </button>

        <div className="flex items-center justify-center w-8 aspect-square bg-gray-800 text-[#E6A60D] text-sm font-bold rounded">
          {midiPresetNum}
        </div>

        <button
          onClick={handleRightArrow}
          className="flex items-center w-1/9 aspect-square p-0 border bg-gray-700 text-[#E6A60D] rounded hover:bg-gray-600 scale-x-[-1]"
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
          className="flex-1 px-2 bg-gray-700 text-white text-sm rounded"
        />
      </div>
    </div>
  );
}

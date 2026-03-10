import SynthFreqParamsView from "./MidiMappingViews/SynthFreqParamsView";
import SequencerView from "./MidiMappingViews/SequencerView";
import PresetsView from "./MidiMappingViews/PresetsView";
import MidiSettingsView from "./MidiMappingViews/MidiSettingsView";
import IndexParamsView from "./MidiMappingViews/IndexParamsView";
import MidiPresetUI from "./MidiMappingViews/MidiPresetUI";
import { useState } from "react";

export default function MidiMappingOverlay({
  loginStatusRef,
  displayMidiMapping,
  onClose,
  setCursorInTextBox,
  activeView, // Passed from parent
  setActiveView, // Also need setter from parent,
  /* 'global_preset', 'freq_preset', 'index_preset', 
  'synth_&_freq_params', 'index_params', 'sequencer_params', 'midi_settings' */
}) {
  const [inputRecalled, setInputRecalled] = useState(false);
  const [midiConfirm, setMidiConfirm] = useState(null);
  // shape: { action: "Save" | "Delete", handler: () => void, presetNum, presetName }

  if (!displayMidiMapping) return null;

  const tabs = [
    { id: "global_preset", buttonLabel: "G.Presets" },
    { id: "freq_preset", buttonLabel: "F.Presets" },
    { id: "index_preset", buttonLabel: "I.Presets" },
    { id: "synth/freq_params", buttonLabel: "Synth/Freq" },
    { id: "index_params", buttonLabel: "Index" },
    { id: "sequencer_params", buttonLabel: "Sequencer" },
    { id: "midi_settings", buttonLabel: "MIDI" },
  ];

  const activeTab = tabs.find((t) => t.id === activeView);
  const displayName =
    activeTab?.id.replaceAll("_", " ").toUpperCase() || "Sequencer";

  return (
    <div
      className={`tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-start tw:justify-center tw:overflow-y-auto tw:w-full tw:h-full tw:bg-gray-950 tw:transition-colors tw:duration-500 tw:ease-in-out ${
        displayMidiMapping
          ? "tw:bg-gray-950/90"
          : "tw:bg-gray-950/0 tw:pointer-events-none"
      }`}
    >
      <div
        className={`tw:bg-gray-900 tw:rounded-lg tw:shadow-lg tw:max-w-sm tw:w-full tw:mb-4 tw:mt-12 tw:transition-opacity tw:duration-500 tw:ease-in-out tw:border-[0.5px] tw:border-[#E6A60D] ${
          displayMidiMapping ? "tw:opacity-100" : "tw:opacity-0"
        }`}
      >
        <div className="tw:p-6 tw:pt-4 tw:min-h-110.75">
          <p className="tw:text-xs tw:text-center tw:mt-0 tw:pb-0.5">
            ONLY CHROME DESKTOP PROPERLY SUPPORTS MIDI
          </p>
          <MidiPresetUI
            loginStatusRef={loginStatusRef}
            setCursorInTextBox={setCursorInTextBox}
            setMidiConfirm={setMidiConfirm}
            inputRecalled={inputRecalled}
            setInputRecalled={setInputRecalled}
          />
          <h2 className="tw:font-semibold tw:mb-2 tw:text-center tw:text-gray-200 tw:text-sm">
            MIDI MAPPING - {displayName}
          </h2>

          {/* Tab Navigation */}
          <div className="tw:flex tw:flex-wrap tw:gap-1 tw:border-b tw:border-gray-700 tw:bg-gray-800 tw:mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`tw:flex-1 tw:px-2 tw:py-2 tw:text-xs tw:font-medium tw:border tw:whitespace-nowrap ${
                  activeView === tab.id
                    ? "tw:border-cyan-500 tw:text-cyan-500"
                    : "tw:border-[#E6A60D]"
                }`}
              >
                {tab.buttonLabel}
              </button>
            ))}
          </div>

          {/* Content Area - Scrollable */}
          <div className="tw:max-h-96 tw:overflow-y-auto">
            {activeView === "sequencer_params" && (
              <SequencerView
                inputRecalled={inputRecalled}
                setInputRecalled={setInputRecalled}
              />
            )}
            {activeView === "synth/freq_params" && (
              <SynthFreqParamsView
                inputRecalled={inputRecalled}
                setInputRecalled={setInputRecalled}
              />
            )}
            {activeView === "global_preset" && (
              <PresetsView
                category="global_preset"
                inputRecalled={inputRecalled}
                setInputRecalled={setInputRecalled}
              />
            )}
            {activeView === "freq_preset" && (
              <PresetsView
                category={"freq_preset"}
                inputRecalled={inputRecalled}
                setInputRecalled={setInputRecalled}
              />
            )}
            {activeView === "index_preset" && (
              <PresetsView
                category={"index_preset"}
                inputRecalled={inputRecalled}
                setInputRecalled={setInputRecalled}
              />
            )}
            {activeView === "midi_settings" && (
              <MidiSettingsView
                inputRecalled={inputRecalled}
                setInputRecalled={setInputRecalled}
              />
            )}
            {activeView === "index_params" && (
              <IndexParamsView
                inputRecalled={inputRecalled}
                setInputRecalled={setInputRecalled}
              />
            )}
          </div>
        </div>
        {midiConfirm && (
          <div
            className={`tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center 
               tw:bg-gray-950/90 tw:transition-colors tw:duration-500 tw:ease-in-out tw:z-10`}
          >
            <div className="tw:bg-gray-900 tw:rounded-lg tw:shadow-lg tw:max-w-sm tw:w-full tw:transition-opacity tw:duration-500 tw:ease-in-out tw:border-[0.5px] tw:border-[#E6A60D]">
              <div className="tw:p-10 tw:text-gray-200 tw:text-lg tw:text-center tw:font-semibold">
                {midiConfirm.action !== "Name" && (
                  <>
                    {midiConfirm.action} MIDI Preset {midiConfirm.presetNum}
                    {midiConfirm.filler} {midiConfirm.presetName}?
                  </>
                )}
                {midiConfirm.action === "Name" && (
                  <>Please enter a preset name.</>
                )}
              </div>

              <div className="tw:flex tw:justify-end tw:p-4 tw:space-x-3 tw:bg-gray-700 tw:rounded-b-lg">
                {midiConfirm.action !== "Name" && (
                  <>
                    <button
                      onClick={() => setMidiConfirm(null)}
                      className="tw:px-4 tw:py-2 tw:text-lg tw:bg-gray-200 tw:text-gray-800 tw:rounded hover:tw:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={midiConfirm.handler}
                  className={`tw:px-4 tw:py-2 tw:text-lg tw:text-white tw:rounded ${
                    midiConfirm.action !== "Name"
                      ? "tw:bg-red-500 hover:tw:bg-red-400 tw:border-red-600 tw:border-[.5]"
                      : "tw:bg-[#E6A60D] hover:tw:bg-gray-300"
                  }`}
                >
                  {midiConfirm.action !== "Name" && midiConfirm.action}
                  {midiConfirm.action === "Name" && "OK"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="tw:flex tw:justify-end tw:p-4 tw:space-x-3 tw:bg-gray-700 tw:rounded-b-lg">
          <button
            onClick={onClose}
            className="tw:px-4 tw:py-2 tw:text-lg tw:bg-gray-200 tw:text-gray-800 tw:rounded hover:tw:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

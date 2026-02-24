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
      className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-950 transition-colors duration-500 ease-in-out ${
        displayMidiMapping
          ? "bg-gray-950/90"
          : "bg-gray-950/0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-gray-900 rounded-lg shadow-lg max-w-sm w-full transition-opacity duration-500 ease-in-out border-[0.5px] border-[#E6A60D] ${
          displayMidiMapping ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="p-6 min-h-110.75">
          <MidiPresetUI
            loginStatusRef={loginStatusRef}
            setCursorInTextBox={setCursorInTextBox}
            setMidiConfirm={setMidiConfirm}
            inputRecalled={inputRecalled}
            setInputRecalled={setInputRecalled}
          />
          <h2 className="font-semibold mb-2 text-center text-gray-200 text-sm">
            MIDI MAPPING - {displayName}
          </h2>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 border-b border-gray-700 bg-gray-800 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex-1 px-2 py-2 text-xs font-medium border whitespace-nowrap ${
                  activeView === tab.id
                    ? "border-cyan-500 text-cyan-500"
                    : "border-[#E6A60D]"
                }`}
              >
                {tab.buttonLabel}
              </button>
            ))}
          </div>

          {/* Content Area - Scrollable */}
          <div className="max-h-96 overflow-y-auto">
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
            className={`absolute inset-0 flex items-center justify-center 
               bg-gray-950/90 transition-colors duration-500 ease-in-out z-10`}
          >
            <div className="bg-gray-900 rounded-lg shadow-lg max-w-sm w-full transition-opacity duration-500 ease-in-out border-[0.5px] border-[#E6A60D]">
              <div className="p-10 text-gray-200 text-lg text-center font-semibold">
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

              <div className="flex justify-end p-4 space-x-3 bg-gray-700 rounded-b-lg">
                {midiConfirm.action !== "Name" && (
                  <>
                    <button
                      onClick={() => setMidiConfirm(null)}
                      className="px-4 py-2 text-lg bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={midiConfirm.handler}
                  className={`px-4 py-2 text-lg text-white rounded ${
                    midiConfirm.action !== "Name"
                      ? "bg-red-500 hover:bg-red-400 border-red-600 border-[.5]"
                      : "bg-[#E6A60D] hover:bg-gray-300"
                  }`}
                >
                  {midiConfirm.action !== "Name" && midiConfirm.action}
                  {midiConfirm.action === "Name" && "OK"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end p-4 space-x-3 bg-gray-700 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-lg bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

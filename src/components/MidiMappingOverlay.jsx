import { useState } from "react";
import SynthFreqParamsView from "./MidiMappingViews/SynthFreqParamsView";
import SequencerView from "./MidiMappingViews/SequencerView";
import PresetsView from "./MidiMappingViews/PresetsView";
import MidiSettingsView from "./MidiMappingViews/MidiSettingsView";

export default function MidiMappingOverlay({
  displayMidiMapping,
  onClose,
  activeView, // Passed from parent
  setActiveView, // Also need setter from parent,
  /* 'global_preset', 'freq_preset', 'index_preset', 
  'synth_&_freq_params', 'index_params', 'sequencer_params', 'midi_settings' */
}) {
  const [mappingTarget, setMappingTarget] = useState(null);

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
  console.log(`aV: ${activeView}`);
  const displayName =
    activeTab?.id.replaceAll("_", " ").toUpperCase() || "Sequencer";

  console.log(activeView);

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
          <h2 className="text-base font-semibold mb-2 text-center text-gray-200">
            MIDI MAPPING - {displayName}
          </h2>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 border-b border-gray-700 bg-gray-800 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex-1 px-2 py-2 text-xs font-medium whitespace-nowrap ${
                  activeView === tab.id
                    ? "bg-[#E6A60D] text-gray-900"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.buttonLabel}
              </button>
            ))}
          </div>

          {/* Content Area - Scrollable */}
          <div className="max-h-96 overflow-y-auto">
            {activeView === "sequencer_params" && <SequencerView />}
            {activeView === "synth/freq_params" && <SynthFreqParamsView />}
            {activeView === "global_preset" && (
              <PresetsView category="global_preset" />
            )}
            {activeView === "freq_preset" && (
              <PresetsView category={"freq_preset"} />
            )}
            {activeView === "index_preset" && (
              <PresetsView category={"index_preset"} />
            )}
            {activeView === "midi_settings" && <MidiSettingsView />}
          </div>
        </div>

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

import { useState, useEffect } from "react";
import { useMidiContext } from "../../context/MidiContext";

export default function MidiSettingsView() {
  const {
    midiEnabled,
    inputs,
    selectedInput,
    setSelectedInput,
    getActiveInputs,
  } = useMidiContext();
  const [lastNote, setLastNote] = useState(null);
  const [lastCC, setLastCC] = useState(null);

  // Listen for notes and display them
  useEffect(() => {
    if (!midiEnabled) return;

    const activeInputs = getActiveInputs();
    if (activeInputs.length === 0) return;

    const handleNoteOn = (e) => {
      console.log("Note pressed:", e.note.identifier);
      setLastNote({
        name: e.note.identifier,
        number: e.note.number,
        velocity: e.rawValue,
      });
    };

    activeInputs.forEach((input) => {
      input.channels[1].addListener("noteon", handleNoteOn);
    });

    return () => {
      activeInputs.forEach((input) => {
        input.channels[1].removeListener("noteon", handleNoteOn);
      });
    };
  }, [midiEnabled, selectedInput, inputs]);

  // Listen for CC messages
  useEffect(() => {
    if (!midiEnabled) return;

    const activeInputs = getActiveInputs();
    if (activeInputs.length === 0) return;

    const handleCC = (e) => {
      console.log("CC#", e.controller.number, "Value:", e.rawValue);
      setLastCC({
        number: e.controller.number,
        name: e.controller.name,
        value: e.rawValue,
      });
    };

    activeInputs.forEach((input) => {
      input.channels[1].addListener("controlchange", handleCC);
    });

    return () => {
      activeInputs.forEach((input) => {
        input.channels[1].removeListener("controlchange", handleCC);
      });
    };
  }, [midiEnabled, selectedInput, inputs]);

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #E6A60D",
        width: "100%",
        marginBottom: "10px",
      }}
    >
      <h3>MIDI Settings</h3>
      <p>Devices: {inputs.length}</p>
      <select
        value={selectedInput === "all" ? "all" : selectedInput?.id || ""}
        onChange={(e) => {
          if (e.target.value === "all") {
            setSelectedInput("all");
          } else {
            const input = inputs.find((i) => i.id === e.target.value);
            setSelectedInput(input);
          }
        }}
      >
        <option>Select Device</option>
        <option value="all">All Devices</option>

        {inputs.map((input) => (
          <option key={input.id} value={input.id}>
            {input.name}
          </option>
        ))}
      </select>

      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#2a2a2a",
        }}
      >
        <strong>Last Note:</strong>
        {lastNote ? (
          <div>
            {lastNote.name} (#{lastNote.number}) - Velocity: {lastNote.velocity}
          </div>
        ) : (
          <div style={{ color: "#888" }}>Press a key...</div>
        )}
      </div>

      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#2a2a2a",
        }}
      >
        <strong>Last CC:</strong>
        {lastCC ? (
          <div>
            CC#{lastCC.number} ({lastCC.name}) - Value: {lastCC.value}
          </div>
        ) : (
          <div style={{ color: "#888" }}>Move a knob or fader...</div>
        )}
      </div>
    </div>
  );
}

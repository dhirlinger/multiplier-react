import { useState, useEffect } from "react";
import useMidi from "../hooks/useMidi";

export default function MidiTest() {
  const { midiEnabled, midiError, inputs, selectedInput } = useMidi();
  const [lastNote, setLastNote] = useState(null);
  const [lastCC, setLastCC] = useState(null);

  // Listen for notes and display them
  useEffect(() => {
    if (!midiEnabled || !selectedInput) return;

    const handleNoteOn = (e) => {
      console.log("Note pressed:", e.note.identifier);
      setLastNote({
        name: e.note.identifier,
        number: e.note.number,
        velocity: e.rawValue,
      });
    };

    selectedInput.channels[1].addListener("noteon", handleNoteOn);

    return () => {
      selectedInput.channels[1].removeListener("noteon", handleNoteOn);
    };
  }, [midiEnabled, selectedInput]);

  // Listen for CC messages
  useEffect(() => {
    if (!midiEnabled || !selectedInput) return;

    const handleCC = (e) => {
      console.log("CC#", e.controller.number, "Value:", e.rawValue);
      setLastCC({
        number: e.controller.number,
        name: e.controller.name,
        value: e.rawValue,
      });
    };

    selectedInput.channels[1].addListener("controlchange", handleCC);

    return () => {
      selectedInput.channels[1].removeListener("controlchange", handleCC);
    };
  }, [midiEnabled, selectedInput]);

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #E6A60D",
        width: "100%",
        marginBottom: "10px",
      }}
    >
      <h3>MIDI Test</h3>
      <p>Devices: {inputs.length}</p>
      <p>Selected: {selectedInput?.name || "None"}</p>

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

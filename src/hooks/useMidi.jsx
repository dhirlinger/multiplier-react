import { useEffect, useRef, useState } from "react";
import { WebMidi } from "webmidi";

export default function useMidi() {
  const [midiEnabled, setMidiEnabled] = useState(false);
  const [midiError, setMidiError] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [selectedInput, setSelectedInput] = useState(null);
  //const listenersRef = useRef(new Map());

  useEffect(() => {
    WebMidi.enable()
      .then(() => {
        console.log("WebMidi enabled!");
        setMidiEnabled(true);
        setMidiError(null);
        setInputs(WebMidi.inputs);

        if (WebMidi.inputs.length > 0) {
          setSelectedInput(WebMidi.inputs[0]);
        }
      })
      .catch((err) => {
        console.error("WebMidi enable error:", err);
        setMidiError(err.message);
      });
  }, []);

  useEffect(() => {
    if (!midiEnabled || !selectedInput) return;

    const handleNoteOn = (e) => {
      console.log("Note pressed:", e.note.identifier, "Number:", e.note.number);
    };

    selectedInput.channels[1].addListener("noteon", handleNoteOn);

    //cleanup
    return () => {
      selectedInput.channels[1].removeListener("noteon", handleNoteOn);
    };
  }, [midiEnabled, selectedInput]);

  useEffect(() => {
    if (!midiEnabled || !selectedInput) return;

    const handleStart = (e) => {
      console.log("TRANSPORT: Start", e.timestamp);
    };

    const handleStop = (e) => {
      console.log("TRANSPORT: Stop", e.timestamp);
    };

    // System messages go on the INPUT, not channels
    selectedInput.addListener("start", handleStart);
    selectedInput.addListener("stop", handleStop);

    return () => {
      selectedInput.removeListener("start", handleStart);
      selectedInput.removeListener("stop", handleStop);
    };
  }, [midiEnabled, selectedInput]);

  return { midiEnabled, midiError, inputs, selectedInput };
}

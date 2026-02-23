import { useEffect, useState, useCallback } from "react";
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
          // Default to listening on all devices
          setSelectedInput("all");
        }
      })
      .catch((err) => {
        console.error("WebMidi enable error:", err);
        setMidiError(err.message);
      });
  }, []);

  // Resolve selectedInput to an array of devices to listen on
  const getActiveInputs = useCallback(() => {
    if (selectedInput === "all") return inputs;
    if (selectedInput) return [selectedInput];
    return [];
  }, [selectedInput, inputs]);

  return {
    midiEnabled,
    midiError,
    inputs,
    selectedInput,
    setSelectedInput,
    getActiveInputs,
  };
}

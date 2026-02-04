import { useEffect, useState } from "react";
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

  return { midiEnabled, midiError, inputs, selectedInput, setSelectedInput };
}

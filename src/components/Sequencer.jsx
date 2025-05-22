import React, { useRef, useEffect, useState } from "react";
import Seq1Voice from "../assets/SeqVoice";
import Seq1ArrInput from "./SeqArrInput";
import LowPassFilter from "./LowPassFilter";

export default function Sequencer1({
  seqIsPlaying,
  setSeqIsPlaying,
  waveshape,
  onIndexChange,
}) {
  const seqArrayRef = useRef([]);
  const seq1Instance = useRef(null);
  const [seq1Tempo, setSeq1Tempo] = useState("600");
  const [duration, setDuration] = useState("0.05");
  const [lowPassFreq, setLowPassFreq] = useState("15000");
  const [lowPassQ, setLowPassQ] = useState("0");

  useEffect(() => {
    seq1Instance.current = new Seq1Voice(600);
  }, []);

  useEffect(() => {
    seq1Instance.current.onBeatCallback = (beatNumber) => {
      // setIndex(beatNumber);
      if (onIndexChange) {
        onIndexChange(beatNumber);
      }
    };
  }, [onIndexChange]);

  useEffect(() => {
    if (seq1Tempo > 99 && seq1Tempo < 1001) {
      seq1Instance.current.tempo = seq1Tempo;
    }
  }, [seq1Tempo]);

  useEffect(() => {
    seq1Instance.current.noteLength = Number(duration);
  }, [duration]);

  useEffect(() => {
    seq1Instance.current.shape = waveshape;
  }, [waveshape]);

  useEffect(() => {
    seq1Instance.current.lowPassFreq = lowPassFreq;
  }, [lowPassFreq]);

  useEffect(() => {
    seq1Instance.current.qValue = lowPassQ;
  }, [lowPassQ]);

  const handleClick = () => {
    setSeqIsPlaying(!seqIsPlaying);
    seq1Instance.current.startStop(seqArrayRef.current);
  };

  return (
    <>
      <div
        style={{
          border: "solid 1px #666",
          padding: "0 10px 10px",
          marginTop: "20px",
        }}
      >
        <h2 style={{ marginBottom: "0", marginTop: "0" }}>Sequencer:</h2>
        <p style={{ marginTop: "0" }}>
          There are 8 frequency values accessable from the frequency slider.
          Sequence up to 8 positions on the slider (1-8). Enter 0 for a rest in
          the sequence. Empty boxes will result in a shorter sequence.
        </p>
        <Seq1ArrInput arrIndex={0} array={seqArrayRef} />
        <Seq1ArrInput arrIndex={1} array={seqArrayRef} />
        <Seq1ArrInput arrIndex={2} array={seqArrayRef} />
        <Seq1ArrInput arrIndex={3} array={seqArrayRef} />
        <Seq1ArrInput arrIndex={4} array={seqArrayRef} />
        <Seq1ArrInput arrIndex={5} array={seqArrayRef} />
        <Seq1ArrInput arrIndex={6} array={seqArrayRef} />
        <Seq1ArrInput arrIndex={7} array={seqArrayRef} />
        <div>
          <span style={{ width: "50px" }}>tempo: </span>
          <input
            style={{ marginTop: "10px", marginRight: "10px", width: "50px" }}
            type="number"
            value={seq1Tempo}
            onChange={(e) => {
              const tempo = e.target.value;
              setSeq1Tempo(tempo);
            }}
          ></input>
          <span style={{ width: "100px" }}>duration: </span>
          <input
            type="range"
            max="1.0"
            min="0.05"
            step="0.05"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <span style={{ width: "50px" }}>{Number(duration).toFixed(2)}</span>
        </div>
        <div style={{ marginTop: "10px" }}>
          <button onClick={handleClick}>
            {seqIsPlaying ? "Stop" : "Play Seq"}
          </button>
        </div>
        <div style={{ border: "solid 1px white", marginTop: "5px" }}>
          <h3 style={{ marginBottom: "5px" }}>Low Pass Filter</h3>
          <LowPassFilter
            value={lowPassFreq}
            setValue={setLowPassFreq}
            qValue={lowPassQ}
            setQValue={setLowPassQ}
          />
        </div>
      </div>
    </>
  );
}

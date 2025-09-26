export default function AppDescription() {
  return (
    <p style={{ marginTop: "0" }}>
      Multiplier is a step sequencer. There are 8 frequencies contained in the
      frequency array. Sequence the order of the those values and change those
      values by changing the base frequency and multiplier values. The base
      frequency is multiplied by each position number (index) in the array to
      create the frequency array. However, the first value is the base value
      itself, and the second is the base x multiplier only (except if multiplier
      = 1), and the third through eight are valued at 2-7 respectively.
    </p>
  );
}

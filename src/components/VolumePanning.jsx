export default function VolumePanning({
  volume,
  setVolume,
  panning,
  setPanning,
  setAudioParam,
  setMidiMappingCategory,
  setDisplayMidiMapping,
}) {
  return (
    <>
      <div id="volume-panning-container" className="pl-2 pb-2 mt-1">
        <div>
          <div className="flex justify-between items-center">
            <p className="block font-bold">Volume</p>
            <button
              className="text-xs py-0.5 px-2 border-pink-800 border bg-pink-600 mt-1 mr-2"
              onClick={() => {
                setMidiMappingCategory("synth/freq_params");
                setDisplayMidiMapping(true);
              }}
            >
              MAP
            </button>
          </div>
          <div className="flex items-center justify-start gap-2">
            <input
              type="range"
              min="-60"
              max="0"
              step="1"
              value={volume}
              onChange={(e) => {
                const db = parseFloat(e.target.value);
                const gain = Math.pow(10, db / 20);
                setAudioParam("volume", gain);
                setVolume(e.target.value);
              }}
              onDoubleClick={() => {
                const defaultDb = -6;
                const gain = Math.pow(10, defaultDb / 20);
                setAudioParam("volume", gain);
                setVolume(String(defaultDb));
              }}
              className="w-68"
            />
            <p className="text-2xl">{volume} dB</p>
          </div>
        </div>
        <div>
          <p className="block font-bold">Panning</p>
          <div className="flex items-center justify-start gap-2">
            <input
              type="range"
              max="1.0"
              min="-1.0"
              step="0.1"
              value={panning}
              onChange={(e) => {
                setAudioParam("panning", e.target.value);
                setPanning(e.target.value);
              }}
              onDoubleClick={() => {
                const defaultPan = 0.0;

                setAudioParam("panning", defaultPan);
                setPanning(String(defaultPan));
              }}
              className={`w-68`}
            />
            <p className="text-2xl">{Number(panning).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
}

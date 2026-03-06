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
      <div id="volume-panning-container" className="tw:pl-2 tw:pb-2 tw:mt-1">
        <div>
          <div className="tw:flex tw:justify-between tw:items-center">
            <p className="tw:block tw:font-bold">Volume</p>
            <button
              className="tw:text-xs tw:py-0.5 tw:px-2 tw:border-pink-800 tw:border tw:bg-pink-600 tw:mt-1 tw:mr-2"
              onClick={() => {
                setMidiMappingCategory("synth/freq_params");
                setDisplayMidiMapping(true);
              }}
            >
              MAP
            </button>
          </div>
          <div className="tw:flex tw:items-center tw:justify-start tw:gap-2">
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
              className="tw:w-68"
            />
            <p className="tw:text-2xl">{volume} dB</p>
          </div>
        </div>
        <div>
          <p className="tw:block tw:font-bold">Panning</p>
          <div className="tw:flex tw:items-center tw:justify-start tw:gap-2">
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
              className={`tw:w-68`}
            />
            <p className="tw:text-2xl">{Number(panning).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
}

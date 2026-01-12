import { useState, useEffect } from "react";
import IndexColumnSlider from "./IndexColumnSlider";

export default function IndexArraySliders({
  seqArrayRef,
  indexObj,
  presetObj,
  globalIndexRecall,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const columnRefs = useRef([]);
  const updateFunctionsRef = useRef([]);

  // In IndexArraySliders
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  useEffect(() => {
    const handleGlobalTouchEnd = () => setIsDragging(false);

    window.addEventListener("touchend", handleGlobalTouchEnd);
    return () => window.removeEventListener("touchend", handleGlobalTouchEnd);
  }, []);

  return (
    <div className="relative w-full mt-4">
      <div className="absolute bottom-16 left-0 right-0 text-center text-sm text-white/70 pointer-events-none z-10">
        - SKIP / RECALL -
      </div>
      <div className="grid grid-cols-8 w-full">
        <IndexColumnSlider
          arrIndex={0}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
        <IndexColumnSlider
          arrIndex={1}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
        <IndexColumnSlider
          arrIndex={2}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
        <IndexColumnSlider
          arrIndex={3}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
        <IndexColumnSlider
          arrIndex={4}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
        <IndexColumnSlider
          arrIndex={5}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
        <IndexColumnSlider
          arrIndex={6}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
        <IndexColumnSlider
          arrIndex={7}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      </div>
    </div>
  );
}

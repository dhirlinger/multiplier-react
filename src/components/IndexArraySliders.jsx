import { useState, useEffect, useRef } from "react";
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
  const lastColumnRef = useRef(null);

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

  const handleGlobalTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    // Find which column the touch is over
    for (let i = 0; i < columnRefs.current.length; i++) {
      const columnRef = columnRefs.current[i];
      if (!columnRef) continue;

      const rect = columnRef.getBoundingClientRect();

      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        // Call this column's update function
        if (updateFunctionsRef.current[i]) {
          updateFunctionsRef.current[i](y);
        }
        break;
      }
    }
  };

  return (
    <div className="relative w-full" onTouchMove={handleGlobalTouchMove}>
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
          columnRef={(el) => (columnRefs.current[0] = el)}
          registerUpdateFunction={(fn) => (updateFunctionsRef.current[0] = fn)}
          lastColumnRef={lastColumnRef.current}
        />
        <IndexColumnSlider
          arrIndex={1}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          columnRef={(el) => (columnRefs.current[1] = el)}
          registerUpdateFunction={(fn) => (updateFunctionsRef.current[1] = fn)}
          lastColumnRef={lastColumnRef.current}
        />
        <IndexColumnSlider
          arrIndex={2}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          columnRef={(el) => (columnRefs.current[2] = el)}
          registerUpdateFunction={(fn) => (updateFunctionsRef.current[2] = fn)}
          lastColumnRef={lastColumnRef.current}
        />
        <IndexColumnSlider
          arrIndex={3}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          columnRef={(el) => (columnRefs.current[3] = el)}
          registerUpdateFunction={(fn) => (updateFunctionsRef.current[3] = fn)}
          lastColumnRef={lastColumnRef.current}
        />
        <IndexColumnSlider
          arrIndex={4}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          columnRef={(el) => (columnRefs.current[4] = el)}
          registerUpdateFunction={(fn) => (updateFunctionsRef.current[4] = fn)}
          lastColumnRef={lastColumnRef.current}
        />
        <IndexColumnSlider
          arrIndex={5}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          columnRef={(el) => (columnRefs.current[5] = el)}
          registerUpdateFunction={(fn) => (updateFunctionsRef.current[5] = fn)}
          lastColumnRef={lastColumnRef.current}
        />
        <IndexColumnSlider
          arrIndex={6}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          columnRef={(el) => (columnRefs.current[6] = el)}
          registerUpdateFunction={(fn) => (updateFunctionsRef.current[6] = fn)}
          lastColumnRef={lastColumnRef.current}
        />
        <IndexColumnSlider
          arrIndex={7}
          seqArrayRef={seqArrayRef}
          indexObj={indexObj}
          presetObj={presetObj}
          globalIndexRecall={globalIndexRecall}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          columnRef={(el) => (columnRefs.current[7] = el)}
          registerUpdateFunction={(fn) => (updateFunctionsRef.current[7] = fn)}
          lastColumnRef={lastColumnRef.current}
        />
      </div>
    </div>
  );
}

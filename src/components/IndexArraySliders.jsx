import { useState, useEffect } from "react";
import IndexColumnSlider from "./IndexColumnSlider";

export default function IndexArraySliders({
  seqArrayRef,
  indexObj,
  presetObj,
  globalIndexRecall,
}) {
  const [isDragging, setIsDragging] = useState(false);

  // In IndexArraySliders
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <div className="grid grid-cols-8 w-full mt-4">
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
  );
}

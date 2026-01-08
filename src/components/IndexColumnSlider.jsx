import { useState, useRef, useEffect } from "react";

export default function IndexColumnSlider({
  arrIndex,
  seqArrayRef,
  indexObj,
  presetObj,
  globalIndexRecall,
  isDragging,
  setIsDragging,
}) {
  const [value, setValue] = useState("");
  const [isRest, setIsRest] = useState(false);
  const [previousValue, setPreviousValue] = useState(0);

  const columnRef = useRef(null);

  const colors = [
    "bg-blue-300", // 0
    "bg-blue-500", // 1
    "bg-lime-500", // 2
    "bg-lime-300", // 3
    "bg-fuchsia-500", // 4
    "bg-orange-500", // 5
    "bg-teal-500", // 6
    "bg-blue-200", // 7
  ];

  const columnColor = colors[arrIndex] || "bg-gray-500";

  const cells = [8, 7, 6, 5, 4, 3, 2, 1, ""];

  // Update from indexObj (preset recall)
  useEffect(() => {
    if (!indexObj) return;
    const arr = indexObj.index_array.split(",");
    const newValue = arr[arrIndex];

    if (!newValue) {
      updateValue("");
    } else if (newValue === "R" || newValue === "r") {
      setIsRest(true);
    } else {
      setIsRest(false);
      updateValue(Number(newValue));
    }
  }, [indexObj]);

  // Update from presetObj (global preset recall)
  useEffect(() => {
    if (!globalIndexRecall || !presetObj || !presetObj.index_array) return;
    const arr = presetObj.index_array.split(",");
    const newValue = arr[arrIndex];

    if (!newValue) {
      updateValue(0);
    } else if (newValue === "R" || newValue === "r") {
      setIsRest(true);
    } else {
      setIsRest(false);
      updateValue(Number(newValue));
    }
  }, [presetObj]);

  //  update the value (callable from UI and MIDI)
  const updateValue = (newValue) => {
    setValue(newValue);
    seqArrayRef.current[arrIndex] = String(newValue);
  };

  // Toggle rest mode (callable from UI and MIDI)
  const toggleRest = () => {
    if (isRest) {
      // rest OFF
      setIsRest(false);
      updateValue(previousValue);
    } else {
      // rest ON
      setPreviousValue(value);
      setIsRest(true);
      seqArrayRef.current[arrIndex] = "R";
    }
  };

  // Mouse/Touch
  const handleCellInteraction = (cellValue) => {
    if (isRest) {
      setIsRest(false);
    }
    updateValue(cellValue);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const cellValue = getCellValueFromPosition(e.clientY);
    if (cellValue !== null) {
      handleCellInteraction(cellValue);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const cellValue = getCellValueFromPosition(e.clientY);
    if (cellValue !== null) {
      updateValue(cellValue);
    }
  };

  // const handleMouseUp = () => {
  //   setIsDragging(false);
  // };

  const handleMouseEnter = (e) => {
    if (!isDragging) return;
    const cellValue = getCellValueFromPosition(e.clientY);
    if (cellValue !== null) {
      handleCellInteraction(cellValue);
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const cellValue = getCellValueFromPosition(touch.clientY);
    if (cellValue !== null) {
      handleCellInteraction(cellValue);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const cellValue = getCellValueFromPosition(touch.clientY);
    if (cellValue !== null) {
      updateValue(cellValue);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // which cell value based on Y position
  const getCellValueFromPosition = (clientY) => {
    if (!columnRef.current) return null;

    const rect = columnRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const cellHeight = rect.height / 9;
    const cellIndex = Math.floor(y / cellHeight);

    if (cellIndex >= 0 && cellIndex < cells.length) {
      return cells[cellIndex];
    }
    return null;
  };

  //  text input
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "R" || inputValue === "r") {
      setPreviousValue(value);
      setIsRest(true);
      seqArrayRef.current[arrIndex] = "R";
    } else if (inputValue === "") {
      setIsRest(false);
      updateValue(0);
    } else if (/^[0-8]$/.test(inputValue)) {
      setIsRest(false);
      updateValue(Number(inputValue));
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={toggleRest}
        className={`w-full aspect-square mb-1 border border-[#E6A60D] text-sm font-bold
          ${isRest ? "bg-[#E6A60D] text-gray-900" : "bg-maxbg text-white"}
          hover:bg-stone-700 transition-colors`}
      >
        R
      </button>

      {/* Column with cells */}
      <div
        ref={columnRef}
        className="w-full flex flex-col cursor-pointer select-none relative"
        style={{ height: "300px" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        // onMouseUp={handleMouseUp}
        // onMouseLeave={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {cells.map((cellValue, index) => {
          const isFilled = !isRest && cellValue <= value && cellValue > 0;

          return (
            <div
              key={cellValue}
              className={`
                relative flex-1 border-t border-[#E6A60D]
                ${isFilled ? columnColor : "bg-maxbg"}
                transition-colors duration-100
              `}
            >
              {/* horizontal line indicator at top of each cell */}
              <div className="absolute top-0 left-0 right-0 h-px bg-[#E6A60D]" />
            </div>
          );
        })}
      </div>

      <input
        type="text"
        value={isRest ? "R" : value}
        onChange={handleInputChange}
        maxLength={1}
        className="w-full aspect-square mt-1 text-center text-2xl font-bold 
          border border-[#E6A60D] bg-maxbg text-white"
      />
    </div>
  );
}

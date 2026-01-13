import { useState, useRef, useEffect } from "react";

export default function IndexColumnSlider({
  arrIndex,
  seqArrayRef,
  indexObj,
  presetObj,
  globalIndexRecall,
  isDragging,
  setIsDragging,
  columnRef: setColumnRef,
  registerUpdateFunction,
}) {
  const [value, setValue] = useState("");
  const [isRest, setIsRest] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [previousState, setPreviousState] = useState({
    value: "",
    isRest: false,
  });

  const localColumnRef = useRef(null);
  const lastToggleTimeRef = useRef(0);

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

  useEffect(() => {
    if (setColumnRef && localColumnRef.current) {
      setColumnRef(localColumnRef.current);
    }
  }, [setColumnRef]);

  // Update from indexObj (preset recall)
  useEffect(() => {
    if (!indexObj) return;
    const arr = indexObj.index_array.split(",");
    const newValue = arr[arrIndex];

    if (!newValue) {
      setValue("");
      setIsEmpty(true);
      setIsRest(false);
    } else if (newValue === "R" || newValue === "r") {
      setIsRest(true);
      setIsEmpty(false);
    } else {
      setIsRest(false);
      setIsEmpty(false);
      setValue(Number(newValue));
    }
  }, [indexObj]);

  // Update from presetObj (global preset recall)
  useEffect(() => {
    if (!globalIndexRecall || !presetObj || !presetObj.index_array) return;
    const arr = presetObj.index_array.split(",");
    const newValue = arr[arrIndex];

    if (!newValue) {
      setValue("");
      setIsEmpty(true);
      setIsRest(false);
    } else if (newValue === "R" || newValue === "r") {
      setIsRest(true);
      setIsEmpty(false);
    } else {
      setIsRest(false);
      setIsEmpty(false);
      setValue(Number(newValue));
    }
  }, [presetObj]);

  useEffect(() => {
    if (registerUpdateFunction) {
      registerUpdateFunction((clientY) => {
        const cellValue = getCellValueFromPosition(clientY);
        if (cellValue !== null) {
          directSetValue(cellValue);
        }
      });
    }
  }, [registerUpdateFunction]);

  const directSetValue = (cellValue) => {
    if (cellValue === "") {
      setValue("");
      setIsRest(false);
      setIsEmpty(true);
      seqArrayRef.current[arrIndex] = "";
    } else {
      setValue(cellValue);
      setIsRest(false);
      setIsEmpty(false);
      seqArrayRef.current[arrIndex] = String(cellValue);
    }
  };

  // Update the value (callable from UI and MIDI) with empty/recall after empty logic
  const updateValue = (newValue) => {
    if (newValue === "") {
      const now = Date.now();
      if (now - lastToggleTimeRef.current < 300) {
        return; // Ignore rapid successive calls within 300ms
      }
      lastToggleTimeRef.current = now;

      if (isEmpty) {
        // Restore
        setValue(previousState.value);
        setIsRest(previousState.isRest);
        setIsEmpty(false);
        seqArrayRef.current[arrIndex] = previousState.isRest
          ? "R"
          : String(previousState.value);
      } else {
        // Blank
        setPreviousState({ value, isRest });
        setValue("");
        setIsRest(false);
        setIsEmpty(true);
        seqArrayRef.current[arrIndex] = "";
      }
    } else {
      // Normal value update (1-8)
      setValue(newValue);
      setIsRest(false);
      setIsEmpty(false);
      seqArrayRef.current[arrIndex] = String(newValue);
    }
  };

  // Toggle rest mode (callable from UI and MIDI)
  const toggleRest = () => {
    if (isRest) {
      // rest OFF - restore value
      setIsRest(false);
      setIsEmpty(false);
      seqArrayRef.current[arrIndex] = String(value);
    } else {
      // rest ON
      setIsRest(true);
      setIsEmpty(false);
      seqArrayRef.current[arrIndex] = "R";
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const cellValue = getCellValueFromPosition(e.clientY);
    if (cellValue !== null) {
      if (cellValue === "") {
        // Cell 0 click - use toggle logic
        updateValue(cellValue);
      } else {
        // Other cells - direct set (will be smooth for dragging)
        setValue(cellValue);
        setIsRest(false);
        setIsEmpty(false);
        seqArrayRef.current[arrIndex] = String(cellValue);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const cellValue = getCellValueFromPosition(e.clientY);
    if (cellValue !== null) {
      directSetValue(cellValue);
    }
  };

  const handleMouseEnter = (e) => {
    if (!isDragging) return;
    const cellValue = getCellValueFromPosition(e.clientY);
    if (cellValue !== null) {
      directSetValue(cellValue);
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    const cellValue = getCellValueFromPosition(touch.clientY);
    if (cellValue !== null) {
      if (cellValue === "") {
        updateValue(cellValue);
      } else {
        setValue(cellValue);
        setIsRest(false);
        setIsEmpty(false);
        seqArrayRef.current[arrIndex] = String(cellValue);
      }
    }
  };

  // Calculate which cell value based on Y position
  const getCellValueFromPosition = (clientY) => {
    if (!localColumnRef.current) return null;

    const rect = localColumnRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const cellHeight = rect.height / 9;
    const cellIndex = Math.floor(y / cellHeight);

    if (cellIndex >= 0 && cellIndex < cells.length) {
      return cells[cellIndex];
    }
    return null;
  };

  // Handle text input
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "R" || inputValue === "r") {
      setIsRest(true);
      setIsEmpty(false);
      seqArrayRef.current[arrIndex] = "R";
    } else if (inputValue === "") {
      setIsRest(false);
      setIsEmpty(true);
      setValue("");
      seqArrayRef.current[arrIndex] = "";
    } else if (/^[0-8]$/.test(inputValue)) {
      setIsRest(false);
      setIsEmpty(false);
      updateValue(Number(inputValue));
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={toggleRest}
        className={`w-full aspect-square mb-1 border border-[#E6A60D] text-xs font-normal p-0
          ${isRest ? "bg-[#E6A60D] text-gray-900" : "bg-maxbg text-white"}
          hover:bg-stone-700 transition-colors`}
      >
        REST
      </button>

      {/* Column with cells */}
      <div
        ref={localColumnRef}
        className="w-full flex flex-col cursor-pointer select-none relative h-90"
        style={{ touchAction: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
      >
        {cells.map((cellValue, index) => {
          const isFilled =
            !isRest && !isEmpty && cellValue !== "" && cellValue <= value;

          return (
            <div
              key={index}
              className={`
                relative flex-1 border-t border-[#E6A60D]
                ${isFilled ? columnColor : "bg-maxbg"}
                transition-colors duration-100 ${
                  cellValue === "" && "flex-[1.75]"
                }
              `}
            >
              {/* horizontal line indicator at top of each cell */}
              <div className="absolute top-0 left-0 right-0 h-0 bg-[#E6A60D]" />
            </div>
          );
        })}
      </div>

      <input
        type="text"
        value={isRest ? "R" : value}
        onChange={handleInputChange}
        maxLength={1}
        className={`w-full aspect-square mt-1 text-center text-2xl font-bold 
    border border-[#E6A60D] text-white
    ${isEmpty ? "bg-black" : "bg-maxbg"}`}
      />
    </div>
  );
}

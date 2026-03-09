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
  registerMidiUpdate,
  restMidiUpdatersRef,
  lastColumn,
}) {
  const [value, setValue] = useState("");
  const [isRest, setIsRest] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [previousState, setPreviousState] = useState({
    value: "",
    isRest: false,
  });
  const [isHovered, setIsHovered] = useState(false);
  const localColumnRef = useRef(null);
  const lastToggleTimeRef = useRef(0);
  const lastCellValueRef = useRef(null);

  const prevValueRef = useRef(seqArrayRef.current[arrIndex]);
  const currentStateRef = useRef({ isEmpty, value, isRest, prevValueRef });

  const colors = [
    "tw:bg-blue-300", // 0
    "tw:bg-blue-500", // 1
    "tw:bg-lime-500", // 2
    "tw:bg-lime-300", // 3
    "tw:bg-fuchsia-500", // 4
    "tw:bg-orange-500", // 5
    "tw:bg-teal-500", // 6
    "tw:bg-blue-200", // 7
  ];

  const columnColor = colors[arrIndex] || "tw:bg-gray-500";

  const cells = [8, 7, 6, 5, 4, 3, 2, 1, ""];

  useEffect(() => {
    if (setColumnRef && localColumnRef.current) {
      setColumnRef(localColumnRef.current);
    }
  }, [setColumnRef]);

  useEffect(() => {
    currentStateRef.current = { isEmpty, value, isRest, previousState };
  }, [isEmpty, value, isRest, previousState]);

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

  useEffect(() => {
    if (restMidiUpdatersRef) {
      restMidiUpdatersRef.current[arrIndex] = () => {
        if (isRest) {
          setIsRest(false);
          setIsEmpty(false);
          seqArrayRef.current[arrIndex] = prevValueRef.current;
        } else {
          prevValueRef.current = seqArrayRef.current[arrIndex];
          setIsRest(true);
          setIsEmpty(false);
          seqArrayRef.current[arrIndex] = "R";
        }
      };
    }
  }, [restMidiUpdatersRef, isRest, arrIndex]);

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
    if (isDragging && lastColumn !== arrIndex) {
      lastCellValueRef.current = null;
    }
  }, [lastColumn, arrIndex]);

  useEffect(() => {
    if (registerUpdateFunction) {
      registerUpdateFunction((clientY) => {
        const cellValue = getCellValueFromPosition(clientY);

        if (cellValue !== null && cellValue !== lastCellValueRef.current) {
          lastCellValueRef.current = cellValue;
          directSetValue(cellValue);
        }
      });
    }
  }, [registerUpdateFunction]);

  // Add a new prop: registerMidiUpdate
  useEffect(() => {
    if (registerMidiUpdate) {
      registerMidiUpdate((newValue) => {
        updateValue(newValue);
      });
    }
  }, [registerMidiUpdate]);

  useEffect(() => {
    if (!isDragging) {
      lastCellValueRef.current = null;
    }
  }, [isDragging]);

  const toggleCell0 = () => {
    if (isEmpty) {
      // Restore previous state
      setValue(previousState.value);
      setIsRest(previousState.isRest);
      setIsEmpty(false);
      seqArrayRef.current[arrIndex] = previousState.isRest
        ? "R"
        : String(previousState.value);
    } else {
      // Blank out
      setPreviousState({ value, isRest });
      setValue("");
      setIsRest(false);
      setIsEmpty(true);
      seqArrayRef.current[arrIndex] = "";
    }
  };

  const directSetValue = (cellValue) => {
    if (cellValue === "") {
      toggleCell0();
    } else {
      // Normal value (1-8)
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
      if (now - lastToggleTimeRef.current < 200) {
        return; // Ignore rapid successive calls within 300ms
      }
      lastToggleTimeRef.current = now;

      toggleCell0();
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
      lastCellValueRef.current = cellValue;
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

    if (cellValue !== null && cellValue !== lastCellValueRef.current) {
      lastCellValueRef.current = cellValue;
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
    //e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    const cellValue = getCellValueFromPosition(touch.clientY);
    if (cellValue !== null) {
      lastCellValueRef.current = cellValue;
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

    // Cell 0 = 1.75x cells 1-8 1x each = total 9.75
    const totalFlexUnits = 9.75;
    const unitHeight = rect.height / totalFlexUnits;
    const cell0Height = unitHeight * 1.75;

    // Check if we're in cell 0
    if (y >= rect.height - cell0Height) {
      return "";
    }

    // For cells 1-8
    const remainingY = y;
    const cellIndex = Math.floor(remainingY / unitHeight);

    // cellIndex 0 = cell 8, cellIndex 1 = cell 7, etc.
    if (cellIndex >= 0 && cellIndex < 8) {
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
    <div className="tw:flex tw:flex-col tw:items-center tw:w-full">
      <button
        onClick={(e) => {
          // Only fire on actual mouse clicks, not touch-synthesized clicks
          if (e.detail === 0) return; // detail is 0 for synthetic clicks on some browsers
          toggleRest();
        }}
        onTouchEnd={(e) => {
          e.preventDefault(); // Prevents synthetic click
          toggleRest();
        }}
        className={`tw:w-full tw:aspect-square tw:mb-1 tw:border tw:border-pink-500/90 tw:text-xs tw:font-normal tw:p-0
          ${isRest ? "tw:bg-pink-500/60" : "tw:bg-maxbg"}
          hover:tw:bg-pink-500/20 hover:tw:text-stone-300 tw:transition-colors`}
      >
        REST
      </button>

      {/* Column with cells */}
      <div
        ref={localColumnRef}
        className="tw:w-full tw:flex tw:flex-col tw:cursor-pointer tw:select-none tw:relative tw:h-90"
        style={{ touchAction: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseEnter={(e) => {
          setIsHovered(true);
          handleMouseEnter(e);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          lastCellValueRef.current = null;
        }}
        onTouchStart={handleTouchStart}
      >
        {cells.map((cellValue, index) => {
          const isFilled =
            !isRest && !isEmpty && cellValue !== "" && cellValue <= value;

          return (
            <div
              key={index}
              className={`
                tw:relative tw:flex-1 tw:border-t-[.5px] tw:border-pink-500/90
                ${isFilled ? columnColor : "tw:bg-maxbg"}
                ${isHovered && !isFilled && "tw:bg-maxbg/70"}
                tw:transition-colors tw:duration-100 ${
                  cellValue === "" && "tw:flex-[1.75] active:tw:bg-pink-500/20"
                }
              `}
            ></div>
          );
        })}
      </div>

      <input
        type="text"
        value={isRest ? "R" : value}
        onChange={handleInputChange}
        maxLength={1}
        className={`tw:w-full tw:aspect-square tw:mt-1 tw:text-center tw:text-2xl tw:font-bold 
    tw:border tw:border-pink-500/90 tw:text-white
    ${isEmpty ? "tw:bg-black" : "tw:bg-maxbg"}`}
      />
    </div>
  );
}

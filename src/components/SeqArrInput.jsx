import React, { useEffect, useState } from "react";

export default function NumberInput({ arrIndex, seqArrayRef, indexObj }) {
  const [value, setValue] = useState("");

  //update value on indexObj update.
  // clear value if no element exists at the index of new obj array.
  useEffect(() => {
    let arr = [];
    if (indexObj) {
      arr = indexObj.index_array.split(",");
    }
    arr[arrIndex] ? setValue(arr[arrIndex]) : setValue("");
  }, [indexObj]);

  const handleChange = (event) => {
    let inputValue = event.target.value;

    // Only allow a single digit between 0 and 8
    if (/^[0-8Rr]?$/.test(inputValue)) {
      setValue(inputValue);
      seqArrayRef = seqArrayRef.current;
      seqArrayRef[arrIndex] = inputValue;
      console.log(seqArrayRef);
    }
    // If input is invalid, do nothing (no update)
  };

  return (
    <input
      id={arrIndex}
      type="text" // use text to fully control input
      value={value}
      maxLength={1}
      style={{ width: "22px", fontSize: "36px" }}
      className="mr-2"
      onChange={handleChange}
    ></input>
  );
}

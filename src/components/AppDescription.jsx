import { useState } from "react";

export default function AppDescription() {
  const [seeDescription, setSeeDescription] = useState(false);
  const description = `Multiplier is a oddball step sequencer: part-instrument, part-practice tool. There
      are 8 frequencies contained in a frequency array. Sequence the order of
      the those values and change those values by changing the base frequency
      and multiplier values. The base frequency is multiplied by each position
      number (index) in the array to create the frequency array. However, the
      first value is the base value itself, and the second is the base x
      multiplier only (except if multiplier = 1), and the third through eight
      are valued at 2-7 respectively.`;

  return (
    <p
      className={` ${
        seeDescription
          ? ""
          : "border-solid border-[#E6A60D] border-[0.5px] text-sm"
      } mt-0 p-2.5 mb-2 bg-maxbg w-full text-center cursor-pointer`}
      onClick={() => setSeeDescription(!seeDescription)}
    >
      {seeDescription ? description : "SEE DESCRIPTION"}
    </p>
  );
}

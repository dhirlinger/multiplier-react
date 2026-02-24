import PresetRecallsSection from "./PresetRecallsSection";
import PresetListSection from "./PresetListSection";
import PresetListNavigationSection from "./PresetListNavigationSection";

// category: 'global_preset', 'freq_preset', or 'index_preset'
export default function PresetsView({ category, setInputRecalled }) {
  return (
    <>
      <PresetRecallsSection
        category={category}
        setInputRecalled={setInputRecalled}
      />
      <PresetListSection
        category={category}
        setInputRecalled={setInputRecalled}
      />
      <PresetListNavigationSection
        category={category}
        setInputRecalled={setInputRecalled}
      />
    </>
  );
}

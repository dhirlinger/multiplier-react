import PresetRecallsSection from "./PresetRecallsSection";
import PresetListSection from "./PresetListSection";
import PresetListNavigationSection from "./PresetListNavigationSection";

// category: 'global_preset', 'freq_preset', or 'index_preset'
export default function PresetsView({ category }) {
  return (
    <>
      <PresetRecallsSection category={category} />
      <PresetListSection category={category} />
      <PresetListNavigationSection category={category} />
    </>
  );
}

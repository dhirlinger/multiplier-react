import PresetRecallsSection from "./PresetRecallsSection";

// category: 'global_preset', 'freq_preset', or 'index_preset'
export default function PresetsView({ category }) {
  return (
    <>
      <PresetRecallsSection category={category} />
      {/* PresetListSection */}
      {/* PresetListNavigationSection*/}
    </>
  );
}

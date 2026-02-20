// File: /components/course-creation/NavigationButtons.tsx

import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  activeIdx: number;
  setActiveIdx: (index: number) => void;
  handleGenerateLayout: () => void;
  isNextDisabled: boolean;
  isSaving: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  activeIdx,
  setActiveIdx,
  handleGenerateLayout,
  isNextDisabled,
  isSaving,
}) => {
  return (
    <div className="flex justify-between mt-10">
      <Button
        disabled={activeIdx === 0}
        onClick={() => setActiveIdx(activeIdx - 1)}
      >
        Previous
      </Button>
      {activeIdx < 2 ? (
        <Button
          disabled={isNextDisabled}
          onClick={() => setActiveIdx(activeIdx + 1)}
        >
          Next
        </Button>
      ) : (
        <Button
          onClick={handleGenerateLayout}
          disabled={isNextDisabled || isSaving}
        >
          {isSaving ? "Generating..." : "Generate Course Layout"}
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;

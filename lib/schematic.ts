import { Schematic } from "@schematichq/schematic-react";

const schematic = new Schematic(
    process.env.NEXT_PUBLIC_SCHEMATIC_API_KEY!,
);

// Create React hooks
export const { 
  useFeatureFlag, 
  useFeatureValue, 
  useIdentify 
} = schematic as unknown as {
  useFeatureFlag: typeof Schematic.prototype.addFlagCheckListener,
  useFeatureValue: typeof Schematic.prototype.addFlagValueListener,
  useIdentify: typeof Schematic.prototype.identify
};
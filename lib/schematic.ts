import { Schematic } from "@schematichq/schematic-react";

const schematic = new Schematic(
    process.env.NEXT_PUBLIC_SCHEMATIC_API_KEY!,
);

// Create React hooks
export const useFeatureFlag = (key: string, defaultValue: boolean = false) => 
  schematic.addFlagCheckListener(key, () => defaultValue);

export const useFeatureValue = <T>(key: string, defaultValue: T) => 
  schematic.addFlagValueListener(key, () => defaultValue);

export const useIdentify = () => 
  (attributes: Record<string, any>) => schematic.identify(attributes);
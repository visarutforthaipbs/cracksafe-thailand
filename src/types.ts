export type CrackType =
  | "vertical"
  | "horizontal"
  | "diagonal"
  | "x-shaped"
  | "step"
  | "hairline";

export type CrackSize =
  | "hairline" // < 0.1 mm
  | "small" // 0.1-1.0 mm
  | "medium" // 1.0-3.0 mm
  | "large"; // > 3.0 mm

export type Location =
  | "foundation"
  | "wall"
  | "column-beam"
  | "ceiling"
  | "windows-doors";

export type Length = "short" | "medium" | "long";

export type RiskLevel = "low" | "moderate" | "high";

export interface CrackData {
  pattern: CrackType;
  size: CrackSize;
  width: number;
  location: "wall" | "foundation" | "column-beam" | "ceiling" | "floor";
  length: "short" | "medium" | "long";
  isNew: boolean;
  isGrowing: boolean;
}

export interface RiskAssessment {
  level: RiskLevel;
  guidance: string;
  color: string;
}

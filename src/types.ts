export type CrackType = "hairline" | "narrow" | "wide";

export type CrackSize =
  | "hairline" // < 0.1 mm
  | "small" // 0.1-1.0 mm
  | "medium" // 1.0-3.0 mm
  | "large"; // > 3.0 mm

export type CrackPattern =
  | "vertical"
  | "horizontal"
  | "diagonal"
  | "spider-web"
  | "other";

export type Location =
  | "beam"
  | "column"
  | "beam-column-joint"
  | "shear-wall"
  | "other";

export type Length = "short" | "medium" | "long";

export type RiskLevel = "low" | "moderate" | "high";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CrackAssessment {
  location: Location;
  pattern: CrackPattern;
  width: number;
  isNew: boolean;
  isGrowing: boolean;
  image?: File;
  coordinates?: Coordinates;
  description?: string;
}

export interface AssessmentResult {
  damageLevel: "no-minor" | "moderate" | "severe";
  guidance: string;
  additionalNote?: string;
  imageUrl?: string;
  coordinates?: Coordinates;
}

export interface LocationMapProps {
  coordinates?: Coordinates;
  onLocationChange: (coordinates: Coordinates) => void;
}

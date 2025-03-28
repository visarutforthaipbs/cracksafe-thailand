import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Text,
} from "@chakra-ui/react";
import { RiskAssessment } from "../types";

interface ResultDisplayProps {
  assessment: RiskAssessment;
}

const riskLevelText = {
  low: "ต่ำ",
  moderate: "ปานกลาง",
  high: "สูง",
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ assessment }) => {
  return (
    <Box>
      <Alert
        status={
          assessment.level === "high"
            ? "error"
            : assessment.level === "moderate"
            ? "warning"
            : "success"
        }
        variant="subtle"
        flexDirection="column"
        alignItems="flex-start"
        borderRadius="md"
        p={4}
      >
        <AlertIcon boxSize="24px" mr={0} mb={2} />
        <AlertTitle fontSize="lg" mb={2}>
          ระดับความเสี่ยง: {riskLevelText[assessment.level]}
        </AlertTitle>
        <AlertDescription>
          <Text fontSize="md" whiteSpace="pre-wrap">
            {assessment.guidance}
          </Text>
        </AlertDescription>
      </Alert>
    </Box>
  );
};

export default ResultDisplay;

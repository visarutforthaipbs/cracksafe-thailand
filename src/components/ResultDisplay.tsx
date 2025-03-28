import React from "react";
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Image,
  VStack,
} from "@chakra-ui/react";
import { AssessmentResult } from "../types";

const getDamageLevelText = (level: AssessmentResult["damageLevel"]): string => {
  switch (level) {
    case "severe":
      return "เสียหายรุนแรง";
    case "moderate":
      return "เสียหายปานกลาง";
    case "no-minor":
      return "ไม่มี/เสียหายเล็กน้อย";
  }
};

interface ResultDisplayProps {
  assessment: AssessmentResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ assessment }) => {
  if (!assessment) return null;

  return (
    <Box mt={8}>
      <VStack spacing={6} align="stretch">
        {assessment.imageUrl && (
          <Box>
            <Image
              src={assessment.imageUrl}
              alt="รอยร้าวที่ตรวจพบ"
              maxH="300px"
              borderRadius="md"
              objectFit="contain"
              mx="auto"
            />
          </Box>
        )}

        <Alert
          status={
            assessment.damageLevel === "severe"
              ? "error"
              : assessment.damageLevel === "moderate"
              ? "warning"
              : "success"
          }
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="auto"
          py={6}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {getDamageLevelText(assessment.damageLevel)}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {assessment.guidance}
          </AlertDescription>
        </Alert>

        {assessment.additionalNote && (
          <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="auto"
            py={4}
          >
            <AlertIcon boxSize="24px" mr={0} />
            <AlertDescription maxWidth="sm">
              {assessment.additionalNote}
            </AlertDescription>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default ResultDisplay;

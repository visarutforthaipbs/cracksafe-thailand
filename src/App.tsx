import React from "react";
import {
  ChakraProvider,
  Heading,
  Text,
  Box,
  useToast,
  Container,
} from "@chakra-ui/react";
import CrackForm from "./components/CrackForm";
import ResultDisplay from "./components/ResultDisplay";
import { CrackData, RiskAssessment } from "./types";
import theme from "./theme";

const App: React.FC = () => {
  const [assessment, setAssessment] = React.useState<RiskAssessment | null>(
    null
  );
  const toast = useToast();

  const handleAssessment = (data: CrackData) => {
    // Calculate risk level based on crack data
    let riskLevel: RiskAssessment["level"] = "low";
    let guidance = "";

    // Critical factors that indicate high risk
    if (
      (data.location === "foundation" && data.width >= 3) ||
      (data.location === "column-beam" && data.width >= 2) ||
      (data.isNew && data.isGrowing && data.width >= 2)
    ) {
      riskLevel = "high";
      guidance =
        "พบความเสี่ยงสูง: กรุณาติดต่อวิศวกรโครงสร้างเพื่อตรวจสอบโดยด่วน";
    }
    // Moderate risk factors
    else if (
      data.width >= 2 ||
      (data.isNew && data.isGrowing) ||
      (data.location === "foundation" && data.width >= 1)
    ) {
      riskLevel = "moderate";
      guidance =
        "พบความเสี่ยงปานกลาง: ควรติดต่อผู้เชี่ยวชาญเพื่อตรวจสอบเพิ่มเติม";
    }
    // Low risk
    else {
      guidance =
        "พบความเสี่ยงต่ำ: ควรติดตามสังเกตการณ์อย่างสม่ำเสมอ หากพบการเปลี่ยนแปลงให้ประเมินซ้ำ";
    }

    const newAssessment: RiskAssessment = {
      level: riskLevel,
      guidance,
      color:
        riskLevel === "high"
          ? "red"
          : riskLevel === "moderate"
          ? "orange"
          : "green",
    };

    setAssessment(newAssessment);
    toast({
      title: "ผลการประเมิน",
      description: guidance,
      status:
        riskLevel === "high"
          ? "error"
          : riskLevel === "moderate"
          ? "warning"
          : "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="container.sm" mx="auto">
          <Box w="100%" bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Heading as="h1" mb={2} textAlign="center" color="blue.900">
              CrackSafe Thailand
            </Heading>
            <Text mb={6} textAlign="center" color="gray.600">
              ประเมินความปลอดภัยโครงสร้างบ้านของคุณหลังเหตุการณ์แผ่นดินไหว
            </Text>
            <CrackForm onSubmit={handleAssessment} />
            {assessment && <ResultDisplay assessment={assessment} />}
            <Box mt={8} p={4} bg="blue.50" borderRadius="md">
              <Text fontSize="sm" color="blue.800">
                คำเตือน: เครื่องมือนี้ใช้สำหรับการประเมินเบื้องต้นเท่านั้น
                ไม่สามารถใช้แทนการตรวจสอบโดยผู้เชี่ยวชาญได้
                หากพบความเสียหายรุนแรง กรุณาติดต่อวิศวกรโครงสร้างโดยด่วน
              </Text>
            </Box>
          </Box>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default App;

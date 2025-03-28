import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  useToast,
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Icon,
} from "@chakra-ui/react";
import CrackForm from "./components/CrackForm";
import { CrackAssessment } from "./types";
import { createDocument, uploadFile } from "./services/firebase";
import theme from "./theme";
import NavBar from "./components/NavBar";

// Import icons
import { WarningIcon, CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";

function App() {
  const [assessment, setAssessment] = useState<{
    risk: "high" | "moderate" | "low";
    message: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  const handleAssessment = async (data: CrackAssessment) => {
    // Check for critical factors first
    let risk: "high" | "moderate" | "low";
    let message: string;

    if (
      (data.location === "beam" && data.width >= 2) ||
      (data.location === "column" && data.width >= 2) ||
      (data.location === "beam-column-joint" && data.width >= 2) ||
      (data.location === "shear-wall" && data.width >= 2) ||
      (data.isNew && data.isGrowing && data.width >= 2)
    ) {
      risk = "high";
      message =
        "พบความเสี่ยงสูง: กรุณาติดต่อวิศวกรโครงสร้างเพื่อตรวจสอบโดยด่วน";
    } else if (
      data.width >= 2 ||
      (data.isNew && data.isGrowing) ||
      (data.location === "beam" && data.width >= 1) ||
      (data.location === "column" && data.width >= 1) ||
      (data.location === "beam-column-joint" && data.width >= 1) ||
      (data.location === "shear-wall" && data.width >= 1)
    ) {
      risk = "moderate";
      message =
        "พบความเสี่ยงปานกลาง: ควรติดต่อผู้เชี่ยวชาญเพื่อตรวจสอบเพิ่มเติม";
    } else {
      risk = "low";
      message =
        "พบความเสี่ยงต่ำ: ควรติดตามสังเกตการณ์อย่างสม่ำเสมอ หากพบการเปลี่ยนแปลงให้ประเมินซ้ำ";
    }

    setAssessment({ risk, message });
    setIsModalOpen(true);

    try {
      // Upload image if provided
      let imageUrl = "";
      if (data.image) {
        const timestamp = new Date().getTime();
        const imagePath = `assessments/${timestamp}_${data.image.name}`;
        imageUrl = await uploadFile(imagePath, data.image);
      }

      // Create assessment document in Firestore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image, coordinates, ...assessmentDataWithoutImage } = data;
      const assessmentData = {
        ...assessmentDataWithoutImage,
        risk,
        message,
        imageUrl,
        timestamp: new Date().toISOString(),
        coordinates: coordinates
          ? `${coordinates.lat},${coordinates.lng}`
          : undefined,
      };

      await createDocument("assessments", assessmentData);

      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: "ข้อมูลการประเมินถูกบันทึกเรียบร้อยแล้ว",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "ไม่สามารถบันทึกข้อมูลได้",
        description: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getRiskIcon = (risk: "high" | "moderate" | "low") => {
    switch (risk) {
      case "high":
        return WarningIcon;
      case "moderate":
        return InfoIcon;
      case "low":
        return CheckCircleIcon;
      default:
        return InfoIcon;
    }
  };

  const getRiskColor = (risk: "high" | "moderate" | "low") => {
    switch (risk) {
      case "high":
        return "red.500";
      case "moderate":
        return "orange.500";
      case "low":
        return "green.500";
      default:
        return "gray.500";
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" minH="100vh">
        <NavBar />
        <Flex
          flex="1"
          direction="column"
          align="center"
          bg="gray.50"
          p={{ base: 4, md: 8 }}
          pt={{ base: 6, md: 10 }}
        >
          <Box
            w="100%"
            maxW="800px"
            bg="white"
            borderRadius="lg"
            p={{ base: 4, md: 8 }}
            boxShadow="md"
          >
            <img
              src="/cover-1.gif"
              alt="CrackSafe Thailand"
              style={{
                marginBottom: "8px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "60%",
              }}
            />
            <Text fontSize="lg" color="gray.600" mb={8} textAlign="center">
              ระบบประเมินความปลอดภัยเบื้องต้นของโครงสร้างบ้านของคุณหลังเหตุการณ์แผ่นดินไหว
            </Text>

            <CrackForm onSubmit={handleAssessment} />

            <Text fontSize="sm" color="gray.500" mt={8} textAlign="center">
              คำเตือน: เครื่องมือนี้ใช้สำหรับการประเมินเบื้องต้นเท่านั้น
              โดยอ้างอิงบางส่วนจาก{" "}
              <a
                href="https://www.dpt.go.th/th/documents-dpt/947#wow-book/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                คู่มือการสำรวจความเสียหายขั้นต้นของโครงสร้างอาคารหลังจากเหตุการณ์แผ่นดินไหว
              </a>{" "}
              ไม่สามารถใช้แทนการตรวจสอบโดยผู้เชี่ยวชาญได้ หากพบความเสียหายรุนแรง
              กรุณาติดต่อวิศวกรโครงสร้างโดยด่วน
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            textAlign="center"
            color={getRiskColor(assessment?.risk || "low")}
          >
            ผลการประเมิน
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="center">
              <Icon
                as={getRiskIcon(assessment?.risk || "low")}
                w={12}
                h={12}
                color={getRiskColor(assessment?.risk || "low")}
              />
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={getRiskColor(assessment?.risk || "low")}
                textAlign="center"
              >
                {assessment?.message}
              </Text>
              <Button
                colorScheme="blue"
                onClick={() => setIsModalOpen(false)}
                mt={4}
              >
                ปิด
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default App;

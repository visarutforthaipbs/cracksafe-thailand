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
  Center,
} from "@chakra-ui/react";
import CrackForm from "./components/CrackForm";
import { ContactForm } from "./components/ContactForm";
import { CrackAssessment } from "./types";
import {
  createDocument,
  uploadFile,
  updateDocument,
} from "./services/firebase";
import theme from "./theme";
import NavBar from "./components/NavBar";

// Import icons
import {
  WarningIcon,
  CheckCircleIcon,
  InfoIcon,
  SettingsIcon,
} from "@chakra-ui/icons";

function App() {
  // Maintenance mode flag
  const isMaintenanceMode = false;

  const [assessment, setAssessment] = useState<{
    risk: "high" | "moderate" | "low";
    message: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(
    null
  );
  const toast = useToast();

  const handleAssessment = async (data: CrackAssessment) => {
    console.log("Form submission data:", data);

    let risk: "high" | "moderate" | "low";
    let message: string;

    // Check for severe damage first (high risk)
    if (
      (data.location === "beam" && data.width > 5) ||
      (data.location === "column" && data.width > 2) ||
      (data.location === "beam-column-joint" && data.width > 2) ||
      (data.location === "shear-wall" && data.width > 2) ||
      (data.location === "floor" && data.width > 5)
    ) {
      risk = "high";
      message =
        "พบความเสี่ยงสูง: กรุณาติดต่อวิศวกรโครงสร้างเพื่อตรวจสอบโดยด่วน";
    }
    // Check for moderate damage
    else if (
      (data.location === "beam" && data.width >= 1 && data.width <= 5) ||
      (data.location === "column" && data.width >= 0.2 && data.width <= 2) ||
      (data.location === "beam-column-joint" &&
        data.width >= 0.2 &&
        data.width <= 2) ||
      (data.location === "shear-wall" && data.width >= 1 && data.width <= 2) ||
      (data.location === "floor" && data.width >= 1 && data.width <= 5)
    ) {
      risk = "moderate";
      message =
        "พบความเสี่ยงปานกลาง: ควรติดต่อผู้เชี่ยวชาญเพื่อตรวจสอบเพิ่มเติม";
    }
    // Low risk (no/minor damage)
    else {
      risk = "low";
      message =
        "พบความเสี่ยงต่ำ: ควรติดตามสังเกตการณ์อย่างสม่ำเสมอ หากพบการเปลี่ยนแปลงให้ประเมินซ้ำ";
    }

    // Additional risk factors
    if (data.isNew && data.isGrowing) {
      // Upgrade risk level if crack is new and growing
      if (risk === "low") {
        risk = "moderate";
        message =
          "พบความเสี่ยงปานกลาง: รอยร้าวใหม่และมีการขยายตัว ควรติดต่อผู้เชี่ยวชาญเพื่อตรวจสอบเพิ่มเติม";
      } else if (risk === "moderate") {
        risk = "high";
        message =
          "พบความเสี่ยงสูง: รอยร้าวใหม่และมีการขยายตัว กรุณาติดต่อวิศวกรโครงสร้างเพื่อตรวจสอบโดยด่วน";
      }
    }

    setAssessment({ risk, message });
    setIsModalOpen(true);

    try {
      // Upload image if provided
      let imageUrl = "";
      if (data.image) {
        const timestamp = new Date().getTime();
        const imagePath = `assessments/${timestamp}_${data.image.name}`;
        console.log("Uploading image:", imagePath);
        imageUrl = await uploadFile(imagePath, data.image);
        console.log("Image uploaded successfully, URL:", imageUrl);
      }

      // Create assessment document in Firestore - explicitly exclude the image File object
      const { image, coordinates, ...assessmentDataWithoutImageAndCoords } =
        data;
      const assessmentData = {
        ...assessmentDataWithoutImageAndCoords,
        risk,
        message,
        imageUrl,
        timestamp: new Date().toISOString(),
        coordinates: coordinates
          ? `${coordinates.lat},${coordinates.lng}`
          : undefined,
      };

      console.log("Saving to Firestore:", assessmentData);
      const docRef = await createDocument("assessments", assessmentData);
      console.log("Created assessment with ID:", docRef.id);
      setCurrentAssessmentId(docRef.id);

      // Show contact form for high/moderate risk
      if (risk === "high" || risk === "moderate") {
        console.log("Showing contact form for assessment:", docRef.id);
        setShowContactForm(true);
      }

      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: "ข้อมูลการประเมินถูกบันทึกเรียบร้อยแล้ว",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving data:", error);
      console.error("Error details:", JSON.stringify(error));
      toast({
        title: "ไม่สามารถบันทึกข้อมูลได้",
        description: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleContactSubmit = async (contactData: {
    name: string;
    phone: string;
  }) => {
    console.log("Submitting contact form for assessment:", currentAssessmentId);
    if (!currentAssessmentId) {
      console.error("No assessment ID found");
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบข้อมูลการประเมิน กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log("Contact data to save:", contactData);
      await updateDocument("assessments", currentAssessmentId, {
        contactInfo: contactData,
        updatedAt: new Date(),
      });
      console.log("Successfully updated assessment with contact info");

      toast({
        title: "ขอบคุณสำหรับข้อมูล",
        description: "วิศวกรอาสาจะติดต่อกลับโดยเร็วที่สุด",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving contact info:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
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

  if (isMaintenanceMode) {
    return (
      <ChakraProvider theme={theme}>
        <Box minH="100vh" bg="gray.50">
          <Center minH="100vh" p={4}>
            <Box
              maxW="600px"
              w="100%"
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="lg"
              textAlign="center"
            >
              <Icon as={SettingsIcon} w={16} h={16} color="blue.500" mb={6} />
              <Text fontSize="2xl" fontWeight="bold" mb={4}>
                ระบบอยู่ระหว่างการปรับปรุง
              </Text>
              <Text fontSize="lg" color="gray.600" mb={6}>
                ขออภัยในความไม่สะดวก
                เรากำลังปรับปรุงระบบเพื่อพัฒนาประสิทธิภาพการให้บริการ
                กรุณากลับมาใหม่ในภายหลัง
              </Text>
              <Text fontSize="md" color="gray.500" mb={2}>
                ในกรณีฉุกเฉิน กรุณาติดต่อ:
              </Text>
              <Text fontSize="md" color="blue.600" fontWeight="bold">
                สายด่วนสภาวิศวกร: 1303
              </Text>
            </Box>
          </Center>
        </Box>
      </ChakraProvider>
    );
  }

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

            <Box
              mt={6}
              p={4}
              bg="blue.50"
              borderRadius="md"
              borderWidth="1px"
              borderColor="blue.200"
            >
              <Text fontSize="sm" color="blue.700" textAlign="center">
                <strong>นโยบายความเป็นส่วนตัว:</strong>{" "}
                ข้อมูลที่ท่านให้ไว้จะถูกเก็บรวบรวมเพื่อวัตถุประสงค์ในการวิเคราะห์และปรับปรุงความแม่นยำของระบบประเมินความเสียหาย
                รวมถึงเพื่อการศึกษาวิจัยเกี่ยวกับผลกระทบจากแผ่นดินไหวต่อโครงสร้างอาคารในประเทศไทย
                เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านต่อบุคคลที่สาม
                การใช้บริการนี้ถือว่าท่านยินยอมให้เก็บข้อมูลตามวัตถุประสงค์ดังกล่าว
              </Text>
            </Box>
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

      <ContactForm
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        onSubmit={handleContactSubmit}
      />
    </ChakraProvider>
  );
}

export default App;

import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Image,
  Box,
} from "@chakra-ui/react";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactData: { name: string; phone: string }) => void;
}

export function ContactForm({ isOpen, onClose, onSubmit }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    // Basic validation
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Validate phone number format (Thai mobile number)
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
        description: "เช่น 0812345678",
        status: "error",
        duration: 3000,
      });
      return;
    }

    onSubmit({ name, phone });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Box display="flex" alignItems="center" gap={3}>
            <Image
              src="/1ae64123-4cd8-4244-ab3b-bda2351ccc38.jpeg"
              alt="วิศวกรอาสา"
              boxSize="40px"
              objectFit="contain"
            />
            <Text>ข้อมูลติดต่อสำหรับวิศวกรอาสา</Text>
          </Box>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Text>
              เนื่องจากรอยร้าวที่ตรวจพบมีความเสี่ยง
              ทางเราจะส่งข้อมูลให้วิศวกรอาสาติดต่อกลับเพื่อให้คำแนะนำเพิ่มเติม
            </Text>
            <FormControl isRequired>
              <FormLabel>ชื่อ-นามสกุล</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="กรุณากรอกชื่อ-นามสกุล"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>เบอร์โทรศัพท์</FormLabel>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812345678"
                type="tel"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            ส่งข้อมูล
          </Button>
          <Button variant="ghost" onClick={onClose}>
            ยกเลิก
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

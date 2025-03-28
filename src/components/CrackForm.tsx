import React, { useState, useCallback } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Checkbox,
  Button,
  VStack,
  Text,
  SimpleGrid,
  Image,
  useToast,
  Grid,
  GridItem,
  Center,
  Icon,
} from "@chakra-ui/react";
import { CrackAssessment, Location, CrackPattern, Coordinates } from "../types";
import LocationMap from "./LocationMap";
import { AttachmentIcon } from "@chakra-ui/icons";

// Import SVG illustrations
import verticalCrack from "../assets/vertical-crack.svg";
import horizontalCrack from "../assets/horizontal-crack.svg";
import diagonalCrack from "../assets/diagonal-crack.svg";
import xShapedCrack from "../assets/x-shaped-crack.svg";
import stepCrack from "../assets/step-crack.svg";

const locationDescriptions: Record<Location, string> = {
  beam: "คาน",
  column: "เสา",
  "beam-column-joint": "จุดต่อระหว่างเสาและคาน",
  "shear-wall": "กำแพงรับแรงเฉือน",
  other: "อื่นๆ",
};

const crackPatternDescriptions: Record<
  CrackPattern,
  { label: string; image: string }
> = {
  vertical: { label: "รอยร้าวแนวตั้ง", image: verticalCrack },
  horizontal: { label: "รอยร้าวแนวนอน", image: horizontalCrack },
  diagonal: { label: "รอยร้าวแนวทแยง", image: diagonalCrack },
  "spider-web": { label: "รอยร้าวแบบใยแมงมุม", image: xShapedCrack },
  other: { label: "รอยร้าวรูปแบบอื่นๆ", image: stepCrack },
};

interface CrackFormProps {
  onSubmit: (data: CrackAssessment) => void;
}

const CrackForm: React.FC<CrackFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CrackAssessment>({
    width: 0.5,
    location: "beam",
    pattern: "vertical",
    isNew: false,
    isGrowing: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.coordinates) {
      toast({
        title: "กรุณาระบุตำแหน่ง",
        description: "กรุณาระบุตำแหน่งที่พบรอยร้าวบนแผนที่",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    onSubmit(formData);
  };

  const handleImageChange = (file: File) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "ไฟล์ใหญ่เกินไป",
          description: "กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        toast({
          title: "รูปแบบไฟล์ไม่ถูกต้อง",
          description: "กรุณาอัปโหลดไฟล์รูปภาพ .jpg หรือ .png เท่านั้น",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageChange(files[0]);
    }
  }, []);

  const handleLocationChange = (coordinates: Coordinates) => {
    setFormData((prev) => ({ ...prev, coordinates }));
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <FormControl>
          <FormLabel>อัปโหลดรูปภาพรอยร้าว</FormLabel>
          <Box
            position="relative"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            cursor="pointer"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) =>
                e.target.files && handleImageChange(e.target.files[0])
              }
              style={{ display: "none" }}
            />
            <Box
              borderWidth={2}
              borderStyle="dashed"
              borderColor={isDragging ? "blue.500" : "gray.300"}
              borderRadius="lg"
              p={6}
              bg={isDragging ? "blue.50" : "gray.50"}
              transition="all 0.2s"
              _hover={{ bg: "blue.50", borderColor: "blue.500" }}
            >
              {imagePreview ? (
                <Box>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    maxH="200px"
                    mx="auto"
                    borderRadius="md"
                    objectFit="contain"
                  />
                  <Text mt={2} textAlign="center" color="gray.600">
                    คลิกหรือลากไฟล์เพื่อเปลี่ยนรูปภาพ
                  </Text>
                </Box>
              ) : (
                <Center flexDirection="column">
                  <Icon
                    as={AttachmentIcon}
                    w={8}
                    h={8}
                    color="gray.400"
                    mb={2}
                  />
                  <Text textAlign="center" color="gray.600" fontWeight="medium">
                    ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
                  </Text>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    รองรับไฟล์ .jpg และ .png ขนาดไม่เกิน 5MB
                  </Text>
                </Center>
              )}
            </Box>
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel>รูปแบบรอยร้าว</FormLabel>
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
            gap={4}
          >
            {Object.entries(crackPatternDescriptions).map(
              ([pattern, { label, image }]) => (
                <GridItem key={pattern}>
                  <Box
                    as="label"
                    cursor="pointer"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    bg={formData.pattern === pattern ? "blue.50" : "gray.50"}
                    p={4}
                    borderRadius="md"
                    border="2px solid"
                    borderColor={
                      formData.pattern === pattern ? "blue.500" : "transparent"
                    }
                    transition="all 0.2s"
                    _hover={{ bg: "blue.50" }}
                  >
                    <input
                      type="radio"
                      name="pattern"
                      value={pattern}
                      checked={formData.pattern === pattern}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pattern: e.target.value as CrackPattern,
                        })
                      }
                      style={{ display: "none" }}
                    />
                    <Image src={image} alt={label} boxSize="60px" mb={2} />
                    <Text fontSize="sm" textAlign="center">
                      {label}
                    </Text>
                  </Box>
                </GridItem>
              )
            )}
          </Grid>
        </FormControl>

        <FormControl>
          <FormLabel>ความกว้างของรอยร้าว (มิลลิเมตร)</FormLabel>
          <Slider
            min={0.1}
            max={10}
            step={0.1}
            value={formData.width}
            onChange={(value) => setFormData({ ...formData, width: value })}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text fontSize="sm" color="gray.500" mt={2}>
            {formData.width.toFixed(1)} มม.
          </Text>
        </FormControl>

        <FormControl>
          <FormLabel>ตำแหน่งรอยร้าว</FormLabel>
          <Select
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value as Location })
            }
          >
            {Object.entries(locationDescriptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>ตำแหน่งที่ตั้ง</FormLabel>
          <LocationMap
            coordinates={formData.coordinates}
            onLocationChange={handleLocationChange}
          />
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Checkbox
            isChecked={formData.isNew}
            onChange={(e) =>
              setFormData({ ...formData, isNew: e.target.checked })
            }
          >
            รอยร้าวใหม่หลังแผ่นดินไหว
          </Checkbox>
          <Checkbox
            isChecked={formData.isGrowing}
            onChange={(e) =>
              setFormData({ ...formData, isGrowing: e.target.checked })
            }
          >
            รอยร้าวขยายตัว
          </Checkbox>
        </SimpleGrid>

        <Button type="submit" colorScheme="blue" size="lg">
          ตรวจสอบ
        </Button>
      </VStack>
    </Box>
  );
};

export default CrackForm;

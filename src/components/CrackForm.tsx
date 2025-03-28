import React from "react";
import {
  FormControl,
  FormLabel,
  Select,
  Button,
  Checkbox,
  SimpleGrid,
  Box,
  Text,
  VStack,
  Grid,
  GridItem,
  Image,
  Flex,
} from "@chakra-ui/react";
import { CrackData, CrackType } from "../types";

// Import SVG illustrations
import verticalCrack from "../assets/vertical-crack.svg";
import horizontalCrack from "../assets/horizontal-crack.svg";
import diagonalCrack from "../assets/diagonal-crack.svg";
import xShapedCrack from "../assets/x-shaped-crack.svg";
import stepCrack from "../assets/step-crack.svg";
import hairlineCrack from "../assets/hairline-crack.svg";

const crackTypeDescriptions: Record<CrackType, string> = {
  vertical: "รอยร้าวแนวตั้ง",
  horizontal: "รอยร้าวแนวนอน",
  diagonal: "รอยร้าวแนวทแยง",
  "x-shaped": "รอยร้าวรูปตัว X",
  step: "รอยร้าวแบบขั้นบันได",
  hairline: "รอยร้าวเส้นผม",
};

const crackIllustrations: Record<CrackType, string> = {
  vertical: verticalCrack,
  horizontal: horizontalCrack,
  diagonal: diagonalCrack,
  "x-shaped": xShapedCrack,
  step: stepCrack,
  hairline: hairlineCrack,
};

interface CrackFormProps {
  onSubmit: (data: CrackData) => void;
}

const CrackForm: React.FC<CrackFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState<CrackData>({
    pattern: "vertical",
    size: "small",
    width: 1,
    location: "wall",
    length: "short",
    isNew: false,
    isGrowing: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Flex w="100%" justify="center">
      <Box as="form" onSubmit={handleSubmit} w="100%" maxW="600px">
        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel>รูปแบบรอยร้าว</FormLabel>
            <Grid
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
              gap={4}
            >
              {Object.entries(crackTypeDescriptions).map(
                ([type, description]) => (
                  <GridItem key={type}>
                    <Box
                      as="label"
                      cursor="pointer"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      bg={formData.pattern === type ? "blue.50" : "gray.50"}
                      p={4}
                      borderRadius="md"
                      border="2px solid"
                      borderColor={
                        formData.pattern === type ? "blue.500" : "transparent"
                      }
                      transition="all 0.2s"
                      _hover={{ bg: "blue.50" }}
                      height="100%"
                    >
                      <input
                        type="radio"
                        name="pattern"
                        value={type}
                        checked={formData.pattern === type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pattern: e.target.value as CrackType,
                          })
                        }
                        style={{ display: "none" }}
                      />
                      <Image
                        src={crackIllustrations[type as CrackType]}
                        alt={description}
                        boxSize="60px"
                        mb={2}
                      />
                      <Text fontSize="sm" textAlign="center">
                        {description}
                      </Text>
                    </Box>
                  </GridItem>
                )
              )}
            </Grid>
          </FormControl>

          <FormControl>
            <FormLabel>ขนาดรอยร้าว</FormLabel>
            <Select
              value={formData.width}
              onChange={(e) => {
                const width = Number(e.target.value);
                setFormData({
                  ...formData,
                  width,
                  size: width <= 1 ? "small" : width <= 3 ? "medium" : "large",
                });
              }}
            >
              <option value={1}>น้อยกว่า 1 มม.</option>
              <option value={2}>1-2 มม.</option>
              <option value={3}>2-3 มม.</option>
              <option value={4}>มากกว่า 3 มม.</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>ตำแหน่งรอยร้าว</FormLabel>
            <Select
              value={formData.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: e.target.value as CrackData["location"],
                })
              }
            >
              <option value="wall">ผนัง</option>
              <option value="foundation">ฐานราก</option>
              <option value="column-beam">เสา-คาน</option>
              <option value="ceiling">เพดาน</option>
              <option value="floor">พื้น</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>ความยาวรอยร้าว</FormLabel>
            <Select
              value={formData.length}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  length: e.target.value as CrackData["length"],
                })
              }
            >
              <option value="short">สั้น (น้อยกว่า 30 ซม.)</option>
              <option value="medium">ปานกลาง (30-100 ซม.)</option>
              <option value="long">ยาว (มากกว่า 100 ซม.)</option>
            </Select>
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Checkbox
              isChecked={formData.isNew}
              onChange={(e) =>
                setFormData({ ...formData, isNew: e.target.checked })
              }
            >
              เป็นรอยร้าวใหม่หลังแผ่นดินไหว
            </Checkbox>
            <Checkbox
              isChecked={formData.isGrowing}
              onChange={(e) =>
                setFormData({ ...formData, isGrowing: e.target.checked })
              }
            >
              รอยร้าวมีการขยายตัว
            </Checkbox>
          </SimpleGrid>

          <Button type="submit" colorScheme="blue" size="lg" w="100%" mt={4}>
            ประเมินความเสี่ยง
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default CrackForm;

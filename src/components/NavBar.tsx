import React from "react";
import { Flex, Image, HStack, useBreakpointValue } from "@chakra-ui/react";

const NavBar: React.FC = () => {
  const logoSize = useBreakpointValue({ base: "30px", md: "40px" });
  const padding = useBreakpointValue({ base: "0.5rem", md: "1rem" });

  return (
    <Flex
      as="nav"
      align="center"
      justify="center"
      wrap="wrap"
      padding={padding}
      bg="#3182ce"
      color="white"
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="sticky"
      width="100%"
    >
      <HStack spacing={{ base: 4, md: 6 }} justifyContent="center">
        <Image
          src="/1.png"
          alt="Logo 1"
          height={logoSize}
          objectFit="contain"
          transition="transform 0.3s"
          _hover={{ transform: "scale(1.05)" }}
        />
        <Image
          src="/2.png"
          alt="Logo 2"
          height={logoSize}
          objectFit="contain"
          transition="transform 0.3s"
          _hover={{ transform: "scale(1.05)" }}
        />
        <Image
          src="/3.png"
          alt="Logo 3"
          height={logoSize}
          objectFit="contain"
          transition="transform 0.3s"
          _hover={{ transform: "scale(1.05)" }}
        />
      </HStack>
    </Flex>
  );
};

export default NavBar;

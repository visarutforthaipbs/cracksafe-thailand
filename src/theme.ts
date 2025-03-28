import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
  colors: {
    brand: {
      50: "#E6F2FF",
      100: "#B3D9FF",
      200: "#80BFFF",
      300: "#4DA6FF",
      400: "#1A8CFF",
      500: "#2C5282", // primary
      600: "#234167",
      700: "#1A314D",
      800: "#122033",
      900: "#0A101A",
      secondary: "#ECC94B",
      accent: "#9B2C2C",
      neutral: {
        light: "#F7FAFC",
        dark: "#1A202C",
      },
      success: "#38A169",
    },
  },
  fonts: {
    heading: "'Noto Sans Thai', 'Inter', sans-serif",
    body: "'Noto Sans Thai', 'Inter', sans-serif",
  },
  fontSizes: {
    base: "16px",
    heading: "24px",
    small: "14px",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "500",
        borderRadius: "lg",
      },
      defaultProps: {
        colorScheme: "brand",
        size: "lg",
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: "md",
        fontWeight: "500",
        mb: 2,
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: "lg",
        },
      },
    },
    Container: {
      baseStyle: {
        maxW: "container.md",
        px: { base: 4, md: 8 },
      },
    },
  },
  layerStyles: {
    card: {
      bg: "white",
      borderRadius: "xl",
      boxShadow: "sm",
      p: { base: 4, md: 6 },
    },
  },
});

export default theme;

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
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
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
    heading: "'Noto Sans Thai', sans-serif",
    body: "'Noto Sans Thai', sans-serif",
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

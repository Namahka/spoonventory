import { useWindowDimensions } from "react-native";

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;

  // Dynamic sizes based on screen width
  const spacing = {
    xs: width * 0.02,
    sm: width * 0.04,
    md: width * 0.06,
    lg: width * 0.08,
    xl: width * 0.1,
  };

  const typography = {
    title: isMobile ? 24 : isTablet ? 28 : 32,
    heading: isMobile ? 18 : isTablet ? 20 : 24,
    body: isMobile ? 14 : isTablet ? 15 : 16,
    small: isMobile ? 12 : 13,
  };

  const components = {
    spoonRadius: isMobile ? 60 : isTablet ? 80 : 100,
    buttonHeight: isMobile ? 48 : 56,
    borderRadius: isMobile ? 12 : 16,
  };

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    spacing,
    typography,
    components,
  };
};

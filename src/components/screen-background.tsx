import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

// Decorative background with soft dark-red shapes in the corners.
// Drawn in a 400x860 viewBox and scaled to cover the screen.
export function ScreenBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 860"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <LinearGradient id="corner" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF4D5E" stopOpacity="0.35" />
            <Stop offset="1" stopColor="#FF4D5E" stopOpacity="0.08" />
          </LinearGradient>
          <LinearGradient id="sweep" x1="1" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#3A1C22" stopOpacity="0.55" />
            <Stop offset="1" stopColor="#3A1C22" stopOpacity="0.15" />
          </LinearGradient>
          <LinearGradient id="bottom" x1="1" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor="#FF4D5E" stopOpacity="0.32" />
            <Stop offset="1" stopColor="#FF4D5E" stopOpacity="0.06" />
          </LinearGradient>
        </Defs>

        {/* Large diagonal band from the top right towards the left */}
        <Path
          d="M150 0 H400 V430 C370 330 300 250 200 240 C120 232 50 270 0 330 V140 C40 80 100 40 150 0 Z"
          fill="url(#sweep)"
        />
        {/* Top-left corner blob */}
        <Path d="M0 0 H115 C100 50 55 90 0 95 Z" fill="url(#corner)" />
        {/* Bottom-right blob */}
        <Path
          d="M400 690 C320 695 240 740 195 860 H400 Z"
          fill="url(#bottom)"
        />
      </Svg>
    </View>
  );
}

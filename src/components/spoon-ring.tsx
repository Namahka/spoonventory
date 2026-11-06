import { Palette } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

// Circular gauge showing how much of today's spoons are left.
export function SpoonRing({
  value,
  max,
  size,
}: {
  value: number;
  max: number;
  size: number;
}) {
  const stroke = Math.round(size * 0.045);
  const radius = (size - stroke * 3) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = max > 0 ? Math.max(0, Math.min(value / max, 1)) : 0;
  const dashOffset = circumference * (1 - fraction);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="arc" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF7A86" />
            <Stop offset="1" stopColor="#E23B4C" />
          </LinearGradient>
        </Defs>
        {/* Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2A2A30"
          strokeWidth={stroke}
          fill="none"
        />
        {fraction > 0 && (
          <>
            {/* Soft glow behind the arc */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={Palette.accent}
              strokeOpacity={0.12}
              strokeWidth={stroke * 2.2}
              strokeLinecap="butt"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              fill="none"
              transform={`rotate(-90 ${center} ${center})`}
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#arc)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              fill="none"
              transform={`rotate(-90 ${center} ${center})`}
            />
          </>
        )}
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text
          style={[
            styles.value,
            { fontSize: size * 0.36, lineHeight: size * 0.42 },
            value < 0 && { color: Palette.accent },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    color: Palette.textPrimary,
    fontWeight: "800",
    letterSpacing: -2,
  },
});

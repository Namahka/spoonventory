import { MaterialIcons } from "@expo/vector-icons";
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Palette } from "@/constants/colors";
import { useLanguage } from "@/contexts/language-context";

type IconName = keyof typeof MaterialIcons.glyphMap;

const TABS = [
  { name: "home", href: "/", labelKey: "tabs.home", icon: "home" },
  { name: "wellness", href: "/wellness", labelKey: "tabs.wellness", icon: "mood" },
  { name: "remember", href: "/remember", labelKey: "tabs.remember", icon: "checklist" },
  { name: "settings", href: "/settings", labelKey: "tabs.settings", icon: "settings" },
] as const satisfies {
  name: string;
  href: string;
  labelKey: string;
  icon: IconName;
}[];

export default function AppTabs() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.tabSlot} />
      <TabList
        style={[styles.tabList, { marginBottom: Math.max(insets.bottom, 12) }]}
      >
        {TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
            <TabButton icon={tab.icon} label={t(tab.labelKey)} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

function TabButton({
  icon,
  label,
  isFocused,
  ...props
}: TabTriggerSlotProps & { icon: IconName; label: string }) {
  const color = isFocused ? Palette.accent : Palette.textSecondary;
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}
    >
      <MaterialIcons name={icon} size={26} color={color} />
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
      <View style={[styles.indicator, isFocused && styles.indicatorActive]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  tabSlot: {
    flex: 1,
    overflow: "hidden",
  },
  tabList: {
    alignSelf: "center",
    width: "92%",
    maxWidth: 448,
    marginTop: 4,
    backgroundColor: "rgba(27, 27, 31, 0.95)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  indicator: {
    marginTop: 8,
    height: 3,
    width: "55%",
    borderRadius: 2,
    backgroundColor: "transparent",
  },
  indicatorActive: {
    backgroundColor: Palette.accent,
  },
});

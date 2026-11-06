import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { LanguageProvider } from '@/contexts/language-context';

function RootNavigator() {
  const { account, isLoggedIn, appLock, isUnlocked, isLoading } = useAuth();

  if (isLoading) return null;

  const needsUnlock = isLoggedIn && appLock.enabled && !isUnlocked;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn && !needsUnlock}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={needsUnlock}>
        <Stack.Screen name="unlock" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn && account === null}>
        <Stack.Screen name="create-account" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn && account !== null}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="light" />
      <LanguageProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </LanguageProvider>
      <AnimatedSplashOverlay />
    </ThemeProvider>
  );
}

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* name="index" соответствует файлу app/index.js */}
      <Stack.Screen name="index" options={{ title: "Мед поиск" }} />
      {/* name="details/[id]" соответствует файлу app/details/[id].js */}
      <Stack.Screen name="details/[id]" options={{ title: "Статья" }} />
    </Stack>
  );
}

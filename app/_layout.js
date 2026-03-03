import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "DocInfo — Поиск" }} />
      <Stack.Screen name="details/[id]" options={{ title: "О статье" }} />
    </Stack>
  );
}

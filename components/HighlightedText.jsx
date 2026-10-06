import { Text } from "react-native";

export const HighlightedText = ({ text, highlight, style, highlightStyle }) => {
  if (!text) return null;
  const query = highlight.trim();
  if (!query) return <Text style={style}>{text}</Text>;

  // Разбиваем текст с сохранением совпадений (Case-Insensitive)
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

  return (
    <Text style={style}>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <Text key={index} style={[style, highlightStyle]}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
};

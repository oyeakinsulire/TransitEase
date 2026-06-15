import { Image, StyleSheet } from "react-native";

type Props = {
  width?: number;
  height?: number;
};

export default function GoogleIcon({ width = 64, height = 44 }: Props) {
  return (
    <Image
      source={require("../assets/Google.png")}
      style={[styles.icon, { width, height }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    borderRadius: 11,
  },
});

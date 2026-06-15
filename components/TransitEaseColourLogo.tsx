import { Image, type ImageStyle, type StyleProp } from "react-native";

type Props = {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export default function TransitEaseColourLogo({
  width = 91,
  height = 103,
  style,
}: Props) {
  return (
    <Image
      source={require("../assets/te-colour.png")}
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
}

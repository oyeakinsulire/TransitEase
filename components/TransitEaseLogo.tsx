import { Image, type ImageStyle, type StyleProp } from "react-native";

type Props = {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

/** White logo for purple splash — from assets/TransitEase.svg (logo.png) */
export default function TransitEaseLogo({
  width = 184,
  height = 208,
  style,
}: Props) {
  return (
    <Image
      source={require("../assets/logo.png")}
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
}

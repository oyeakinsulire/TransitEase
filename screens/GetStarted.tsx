import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TransitEaseColourLogo from "../components/TransitEaseColourLogo";
import type {  ApplicationStackParams} from "../navigation/types";

const GetStarted = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "GetStarted">>();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 32 },
        ]}
      >
        <View style={styles.logoRow}>
          <TransitEaseColourLogo width={91} height={103} />
        </View>

        <View style={styles.hero}>
          <Image
            source={require("../assets/illustation.png")}
            style={styles.illustration}
            resizeMode="contain"
            accessibilityLabel="Commuters on public transit"
          />
        </View>

        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate("SignUp")}
            accessibilityRole="button"
            accessibilityLabel="Get started, go to sign up"
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate("Login")}
            accessibilityRole="button"
            accessibilityLabel="Login"
          >
            <Text style={styles.secondaryButtonText}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 48,
  },
  logoRow: {
    width: "100%",
    alignItems: "center",
  },
  hero: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    width: "200%",
    height: 390,
  },
  buttons: {
    gap: 20,
    alignItems: "center",
    paddingBottom: 16,
  },
  primaryButton: {
    width: 340,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#4609C8",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "SpaceMono-Bold",
  },
  secondaryButton: {
    width: 300,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4609C8",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    fontFamily: "SpaceMono-Bold",
  },
  buttonPressed: {
    opacity: 0.85,
  },
});

export default GetStarted;

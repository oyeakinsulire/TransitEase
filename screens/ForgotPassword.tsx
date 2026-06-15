import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type {  ApplicationStackParams} from "../navigation/types";

const ForgotPassword = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<
    NativeStackNavigationProp<ApplicationStackParams, "ForgotPassword">
  >();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}> 
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      <View style={styles.inner}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.body}>
          Enter your email or mobile number and we&apos;ll send you a reset link.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  back: {
    position: "absolute",
    left: 16,
    top: 64,
    zIndex: 1,
  },
  backText: {
    fontSize: 16,
    color: "#4609C8",
    fontFamily: "SpaceMono-Bold",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    fontFamily: "SpaceMono-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    color: "#333",
    fontFamily: "SpaceMono-Regular",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default ForgotPassword;

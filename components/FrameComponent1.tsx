import * as React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Color } from "../GlobalStyles";

const FrameComponent1 = () => {
  return (
    <View style={styles.frame}>
      <Pressable style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>
      <Pressable>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    gap: 20,
    alignItems: "center",
  },
  loginButton: {
    width: 340,
    height: 40,
    borderRadius: 12,
    backgroundColor: Color.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: Color.white,
    fontFamily: "SpaceMono-Bold",
  },
  forgotPassword: {
    fontSize: 14,
    color: Color.primary,
    fontFamily: "SpaceMono-Bold",
  },
});

export default FrameComponent1;

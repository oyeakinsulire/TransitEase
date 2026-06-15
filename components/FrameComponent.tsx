import * as React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { Color } from "../GlobalStyles";

const FrameComponent = () => {
  return (
    <View style={styles.frame}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        autoComplete="password"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    gap: 16,
    alignItems: "stretch",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Color.black,
    fontFamily: "SpaceMono-Bold",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: Color.white,
  },
});

export default FrameComponent;

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {  ApplicationStackParams} from "../navigation/types";

const Register = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<
    NativeStackNavigationProp<ApplicationStackParams, "Register">
  >();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}> 
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      <View style={styles.content}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.body}>
          Your account has been registered. Use the Login screen to sign in.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  back: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  backText: {
    fontSize: 16,
    color: "#4609C8",
    fontFamily: "SpaceMono-Bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    fontFamily: "SpaceMono-Bold",
    marginBottom: 16,
  },
  body: {
    fontSize: 14,
    color: "#333",
    fontFamily: "SpaceMono-Regular",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default Register;

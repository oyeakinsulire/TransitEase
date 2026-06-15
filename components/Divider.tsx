import React from "react";
import { View, Text, StyleSheet } from "react-native";

type DividerProps = {
  width?: number;
};

export default function Divider({ width = 324 }: DividerProps) {
  return (
    <View style={[styles.container, { width }]}> 
      <View style={styles.line} />
      <View style={styles.circle}>
        <Text style={styles.text}>OR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  line: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "#000000",
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1E1D1D",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000",
    fontFamily: "SpaceMono-Regular",
  },
});

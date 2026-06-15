import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TransitEaseLogo from "../components/TransitEaseLogo";

//
const transitionduration = 500;

type  ApplicationStackParams= {
  Index: undefined;
  GetStarted: undefined;
};

const TransitEase = () => {
  const fadeTransition= useRef(new Animated.Value(0)).current;
  const navigation =

  useEffect(() => {
    const fadeIn = Animated.timing(fadeTransition, {
      toValue: 1,
      duration: transitionduration,
      useNativeDriver: true,
    });

    const fadeOut = Animated.timing(fadeTransition, {
      toValue: 0,
      duration: transitionduration,
      useNativeDriver: true,
    });

    fadeIn.start(({ completed }) => {
      if (completed) {
        fadeOut.start(({ completed: fadeOutCompleted }) => {
          if (fadeOutCompleted) {
            navigation.replace("GetStarted");
          }
        });
      }
    });
  }, [fadeTransition, navigation]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeTransition }]}>
      <View style={styles.LogoContains}>
        <TransitEaseLogo width={120} height={208} />
      </View>
  
      <Text style={styles.title}>TransitEase</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5629b7",
    alignItems: "center",
    justifyContent: "center",
  },
  LogoContains: {
    marginBottom: 0,
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    fontFamily: "SpaceMono-Bold",
    textAlign: "center",
  },
});

export default TransitEase;

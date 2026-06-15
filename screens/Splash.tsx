import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TransitEaseLogo from "../components/TransitEaseLogo";

// Duration for the fade-in and fade-out animations
const FADE_DURATION = 2500;

type AppStack = {
  Index: undefined;
  GetStarted: undefined;
};

// Splash screen
const TransitEase = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStack, "Index">>();

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    });

    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: FADE_DURATION,
      useNativeDriver: true,
    });

    fadeIn.start(({ finished }) => {
      if (finished) {
        fadeOut.start(({ finished: fadeOutFinished }) => {
          if (fadeOutFinished) {
            navigation.replace("GetStarted");
          }
        });
      }
    });
  }, [fadeAnim, navigation]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.TransitEaseLogoContainer}>
        <TransitEaseLogo width={120} height={208} />
      </View>

      <Text style={styles.title}>TransitEase</Text>
    </Animated.View>
  );
};

//  Splash screen 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5629b7",
    alignItems: "center",
    justifyContent: "center",
  },
  TransitEaseLogoContainer: {
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

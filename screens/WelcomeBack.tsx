import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TransitEaseLogo from "../components/TransitEaseColourLogo";

const transitionduration= 2500;

type  ApplicationStackParams= {
  Index: undefined;
  GetStarted: undefined;
  Maps: undefined;
};

const TransitEase = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Index">>();

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: FADE_DURATION_MS,
      useNativeDriver: true,
    });

    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: FADE_DURATION_MS,
      useNativeDriver: true,
    });

    fadeIn.start(({ finished }) => {
      if (finished) {
        fadeOut.start(({ finished: fadeOutFinished }) => {
          if (fadeOutFinished) {
            navigation.replace("Maps");
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

      <Text style={styles.title}>Welcome Back! Jeff</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  TransitEaseLogoContainer: {
    marginBottom: 0,
  },
  title: {
    fontSize: 24,
    color: "#000000",
    fontFamily: "SpaceMono-Bold",
    textAlign: "center",
  },
});

export default TransitEase;

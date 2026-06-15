import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TransitEaseColourLogo from "../components/TransitEaseColourLogo";
import GoogleIcon from "../components/GoogleIcon";
import FacebookIcon from "../components/FacebookIcon";
import TwitterIcon from "../components/TwitterIcon";
import Divider from "../components/Divider";
import type {  ApplicationStackParams} from "../navigation/types";

const Login = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<ApplicationStackParams, "Login">>();
  const [forgotHovered, setForgotHovered] = useState(false);
  const [termsActive, setTermsActive] = useState(false);
  const [privacyActive, setPrivacyActive] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={[styles.back, { top: insets.top + 16 }]}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <View style={[styles.logoRow, { marginTop: insets.top + 28 }]}>
        <TransitEaseColourLogo width={91} height={103} />
      </View>
      <Text style={styles.title1}>Continue with</Text>
      <View style={styles.iconRow}>
        <View style={styles.iconBox}>
          <FacebookIcon width={60} height={40} />
        </View>
        <View style={styles.iconBox}>
          <GoogleIcon width={60} height={40} />
        </View>
        <View style={styles.iconBox}>
          <TwitterIcon width={60} height={40} />
        </View>
      </View>
      <Divider width={390} />
      <Text style={styles.title2}>Enter your details below</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Email or Mobile</Text>
        <TextInput
          placeholder="Enter email or mobile"
          placeholderTextColor="#A9A9A9"
          style={styles.inputField}
          keyboardType="email-address"
        />
      </View>
        <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          placeholder="Enter password"
          placeholderTextColor="#A9A9A9"
          style={styles.inputField}
          keyboardType="default"
          secureTextEntry
        />
      </View>
      <Pressable
        onPress={() => navigation.navigate("ForgotPassword")}
        onHoverIn={() => setForgotHovered(true)}
        onHoverOut={() => setForgotHovered(false)}
        accessibilityRole="link"
        accessibilityLabel="Forgot password"
      >
        {({ pressed }) => (
          <Text
            style={[
              styles.title3,
              (pressed || forgotHovered) && styles.title3Active,
            ]}
          >
            Forgot Your password?
          </Text>
        )}
      </Pressable>
      <View style={styles.buttons}>
        <Pressable
          style={({ pressed }) => [
            styles.LoginButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate("WelcomeBack")}
          accessibilityRole="button"
          accessibilityLabel="Login"
        >
          <Text style={styles.LoginButtonText}>Login</Text>
        </Pressable>
              <View style={styles.signupPromptRow}>
        <Text style={styles.signupPromptText}>Don’t have an account? </Text>
        <Pressable
          onPress={() => navigation.navigate("SignUp")}
          accessibilityRole="link"
          accessibilityLabel="Get Started"
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.linkText,
                styles.boldText,
                pressed && styles.linkTextActive,
              ]}
            >
              Get Started
            </Text>
          )}
        </Pressable>
      </View>
        <View style={styles.termsRow}>
          <Text style={styles.termsCopy}>By logging in, I agree to TransitEase’s </Text>
          <Pressable
            onPress={() => {}}
            onHoverIn={() => setTermsActive(true)}
            onHoverOut={() => setTermsActive(false)}
            accessibilityRole="link"
            accessibilityLabel="Terms of service"
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.linkText,
                  styles.boldText,
                  (pressed || termsActive) && styles.linkTextActive,
                ]}
              >
                Terms of service
              </Text>
            )}
          </Pressable>
          <Text style={styles.termsCopy}> and </Text>
          <Pressable
            onPress={() => {}}
            onHoverIn={() => setPrivacyActive(true)}
            onHoverOut={() => setPrivacyActive(false)}
            accessibilityRole="link"
            accessibilityLabel="Privacy Policy"
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.linkText,
                  styles.boldText,
                  (pressed || privacyActive) && styles.linkTextActive,
                ]}
              >
                Privacy Policy
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
  },
  back: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  logoRow: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: "#4609C8",
    fontFamily: "SpaceMono-Bold",
  },
  title1: {
    marginBottom: 16,
    width: "100%",
    fontSize: 10,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "SpaceMono-Regular",
    textAlign: "center",
  },
  title2: {
    width: "100%",
    fontSize: 10,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "SpaceMono-Regular",
    textAlign: "center",
    marginBottom: 12,
  },
  title3: {
    width: "100%",
    fontSize: 10,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "SpaceMono-Bold",
    textAlign: "right",
    paddingRight: 24,
  },
  title3Active: {
    textDecorationLine: "underline",
  },
  signupPromptRow: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: 324,
  },
  signupPromptText: {
    color: "#000",
    fontFamily: "SpaceMono-Regular",
    fontSize: 10,
  },
  termsRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: 324,
  },
  termsCopy: {
    color: "#000",
    fontFamily: "SpaceMono-Regular",
    fontSize: 10,
  },
  linkText: {
    color: "#000",
    fontSize: 10,
    textDecorationLine: "none",
  },
  boldText: {
    fontFamily: "SpaceMono-Bold",
  },
  linkTextActive: {
    textDecorationLine: "underline",
  },
  iconRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconBox: {
    marginHorizontal: 8,
    padding: 8,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E6E6E6",
    marginVertical: 16,
  },
  inputWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  inputLabel: {
    width: 324,
    fontSize: 14,
    fontFamily: "SpaceMono-Regular",
    color: "#000",
    marginBottom: 8,
  },
  inputField: {
    width: 324,
    height: 40,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: "SpaceMono-Regular",
    color: "#000",
    backgroundColor: "#fff",
  },
  buttons: {
    marginTop: 36,
    alignItems: "center",
    width: "100%",
  },
  LoginButton: {
    width: 340,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#4609C8",
    alignItems: "center",
    justifyContent: "center",
  },
  LoginButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "SpaceMono-Bold",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});

export default Login;

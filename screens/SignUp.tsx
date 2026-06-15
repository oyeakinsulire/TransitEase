import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TransitEaseColourLogo from "../components/TransitEaseColourLogo";
import GoogleIcon from "../components/GoogleIcon";
import FacebookIcon from "../components/FacebookIcon";
import TwitterIcon from "../components/TwitterIcon";
import Divider from "../components/Divider";
import type {  ApplicationStackParams} from "../navigation/types";

const SignUp = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "SignUp">>();
  const [termsActive, setTermsActive] = useState(false);
  const [privacyActive, setPrivacyActive] = useState(false);
  const [loginActive, setLoginActive] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={[styles.back, { top: insets.top + 16 }]}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput
          placeholder="Enter Your First Name"
          placeholderTextColor="#A9A9A9"
          style={styles.inputField}
          keyboardType="default"
        />
      </View>
        <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Last Name</Text>
        <TextInput
          placeholder="Enter Your Last Name"
          placeholderTextColor="#A9A9A9"
          style={styles.inputField}
          keyboardType="default"
        />
      </View>
       <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          placeholder="Enter Your Email"
          placeholderTextColor="#A9A9A9"
          style={styles.inputField}
          keyboardType="email-address"
        />
      </View>
       <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Mobile</Text>
        <TextInput
          placeholder="Enter Your Mobile Number"
          placeholderTextColor="#A9A9A9"
          style={styles.inputField}
          keyboardType="phone-pad"
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
           <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Confirm Your Password</Text>
        <TextInput
          placeholder="Enter password"
          placeholderTextColor="#A9A9A9"
          style={styles.inputField}
          keyboardType="default"
          secureTextEntry
        />
      </View>
      <View style={styles.buttons}>
        <Pressable
          style={({ pressed }) => [
            styles.RegisterButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate("Welcome")}
          accessibilityRole="button"
          accessibilityLabel="Register"
        >
          <Text style={styles.RegisterButtonText}>Register</Text>
        </Pressable>
      </View>
      <View style={styles.promptRow}>
        <Text style={styles.promptText}>Have an account? </Text>
        <Pressable
          onPress={() => navigation.navigate("Login")}
          onHoverIn={() => setLoginActive(true)}
          onHoverOut={() => setLoginActive(false)}
          accessibilityRole="link"
          accessibilityLabel="Login"
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.linkText,
                styles.boldText,
                (pressed || loginActive) && styles.linkTextActive,
              ]}
            >
              Login
            </Text>
          )}
        </Pressable>
      </View>
      <View style={styles.termsRow}>
        <Text style={styles.termsCopy}>By signing up, I agree to TransitEase’s </Text>
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
        <Text style={styles.termsCopy}>and  </Text>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
  },
  scrollContainer: {
    paddingBottom: 32,
    alignItems: "center",
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
  promptRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: 324,
  },
  promptText: {
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
    textAlign: "center",
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
  title4: {
    top: 26,
    width: 275,
    fontSize: 8,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "SpaceMono-Regular",
    textAlign: "center",
  },
  iconRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  iconBox: {
    marginHorizontal: 8,
    padding: 8,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E6E6E6",
    marginVertical: 12,
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
    marginTop: 24,
    alignItems: "center",
    width: "100%",
  },
  RegisterButton: {
    width: 340,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#4609C8",
    alignItems: "center",
    justifyContent: "center",
  },
  RegisterButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "SpaceMono-Bold",
  },
  buttonPressed: {
    opacity: 0.85,
  },
});

export default SignUp;

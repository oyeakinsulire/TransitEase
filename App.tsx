import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Splash from "./screens/Splash";
import GetStarted from "./screens/GetStarted";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import ForgotPassword from "./screens/ForgotPassword";
import Welcome from "./screens/Welcome";
import WelcomeBack from "./screens/WelcomeBack";
import Maps from "./screens/Maps";
import Journey from "./screens/TrainJourney";
import type {  ApplicationStackParams} from "./navigation/types";

export type {  ApplicationStackParams};

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [fontsLoaded, error] = useFonts({
    "SpaceMono-Bold": require("./assets/fonts/SpaceMono/SpaceMono-Bold.ttf"),
    "SpaceMono-Regular": require("./assets/fonts/SpaceMono/SpaceMono-Regular.ttf"),
  });

  React.useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: "fade" }}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="GetStarted" component={GetStarted} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="WelcomeBack" component={WelcomeBack} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Maps" component={Maps} />
          <Stack.Screen name="Journey" component={Journey} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
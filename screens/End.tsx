import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MapView, { Marker } from "react-native-maps";
import * as ExpoLocation from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {  ApplicationStackParams} from "../navigation/types";
import { Color } from "../GlobalStyles";

import trainIcon from "../assets/train.png";
import walkIcon from "../assets/walk.png";
import carIcon from "../assets/car.png";
import taxiIcon from "../assets/taxi.png";
import bikeIcon from "../assets/bike.png";
import boatIcon from "../assets/boat.png";
import markerIcon from "../assets/Marker.png";


type ModeOption = {
  id: string;
  icon: any;
  durationMins: number;
  detail: string;
};

const customMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f4f0ff" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#1e1b3a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f4f0ff" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#d7d0fb" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4a2bb7" }],
  },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#ede7ff" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#e7defb" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d9d0ff" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f5f1ff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#c5b7ff" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#d3c3ff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#d3d0fb" }] },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{color: "#4a2bb7"}],
  },
];

const initialRegion = {
  latitude: 51.5074,
  longitude: -0.1278,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const OPTIONS: ModeOption[] = [
  {
    id: "train",
    icon: trainIcon,
    durationMins: 105,
    detail: "£3.85",
  },
  {
    id: "walk",
    icon: walkIcon,
    durationMins: 331,
    detail: "1377 cal",
  },
  {
    id: "car",
    icon: carIcon,
    durationMins: 55,
    detail: "Fastest",
  },
  {
    id: "taxi",
    icon: taxiIcon,
    durationMins: 55,
    detail: "£33+",
  },
  {
    id: "bike",
    icon: bikeIcon,
    durationMins: 119,
    detail: "496 cal",
  },
  {
    id: "boat",
    icon: boatIcon,
    durationMins: 30,
    detail: "£5.20+",
  },
];

export default function EndScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "End">>();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);
  const subscriptionRef = useRef<ExpoLocation.LocationSubscription | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    const loadLocation = async () => {
      try {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        let current: ExpoLocation.LocationObject | null = null;
        try {
          current = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.Accuracy.Balanced,
          });
        } catch {
          current = await ExpoLocation.getLastKnownPositionAsync();
        }

        if (!current) return;

        const nextLocation = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };
        setLocation(nextLocation);
        mapRef.current?.animateToRegion({
          ...nextLocation,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        subscriptionRef.current = await ExpoLocation.watchPositionAsync(
          {
            accuracy: ExpoLocation.Accuracy.Balanced,
            distanceInterval: 10,
            timeInterval: 3000,
          },
          (position) => {
            const live = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(live);
          }
        );
      } finally {
        setIsLocating(false);
      }
    };

    loadLocation();
    return () => subscriptionRef.current?.remove();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        customMapStyle={customMapStyle}
        mapType="standard"
        style={styles.map}
        region={
          location
            ? { ...location, latitudeDelta: 0.02, longitudeDelta: 0.02 }
            : initialRegion
        }
        showsMyLocationButton={false}
        showsUserLocation={false}
      >
        {location && (
          <Marker coordinate={location} anchor={{ x: 0.5, y: 1 }}>
            <Image
              source={markerIcon}
              style={styles.marker}
              resizeMode="contain"
            />
          </Marker>
        )}
      </MapView>

      <Pressable
        onPress={() => navigation.goBack()}
        style={[styles.back, { top: insets.top + 16 }]}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <View style={styles.bottomSheet}>
        <View style={styles.routePanel}>
          <View style={styles.routeLineCol}>
            
            <Text style={styles.routeIcon}>◉</Text>
            <View style={styles.routeDash} />
            <Text style={styles.routeIcon}>⌖</Text>
          </View>
          <View style={styles.routeTextCol}>
            <Text style={styles.routeText}>Current location</Text>
            <Text style={styles.routeText}>End</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {OPTIONS.map((item) => (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => {
                if (item.id === "train") {
                  navigation.navigate("TrainJourney", {
                    destination: "201 Johnson street, Mayhem way, SD14 3PN",
                  });
                }
              }}
            >
              <Image source={item.icon} style={styles.modeIcon} resizeMode="contain" />
              <View style={styles.metrics}>
                <View style={styles.durationRow}>
                  <Text style={styles.duration}>{item.durationMins}</Text>
                  <Text style={styles.mins}> mins</Text>
                </View>
                <Text style={styles.detail}>{item.detail}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {isLocating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primary,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    width: 36,
    height: 36,
  },
  back: {
    position: "absolute",
    left: 16,
    zIndex: 30,
  },
  backText: {
    color: Color.primary,
    fontFamily: "SpaceMono-Bold",
    fontSize: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden",
  },
  bottomSheet: {
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 18,
    backgroundColor: Color.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  routePanel: {
    height: 108,
    borderRadius: 20,
    backgroundColor: Color.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  routeLineCol: {
    width: 26,
    alignItems: "center",
    marginRight: 10,
  },
  routeIcon: {
    color: Color.primary,
    fontSize: 16,
    fontFamily: "SpaceMono-Bold",
  },
  routeDash: {
    width: 2,
    height: 28,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: Color.primary,
    marginVertical: 4,
  },
  routeTextCol: {
    flex: 1,
    gap: 30,
  },
  routeText: {
    color: Color.black,
    fontFamily: "SpaceMono-Bold",
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  card: {
    width: "48%",
    height: 50,
    backgroundColor: Color.white,
    borderRadius: 24,
    borderWidth: 0,
    borderColor: "#0A191D",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modeIcon: {
    width: 28,
    height: 28,
  },
  metrics: {
    alignItems: "flex-end",
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  duration: {
    color: Color.black,
    fontFamily: "SpaceMono-Bold",
    fontSize: 20,
    lineHeight: 24,
  },
  mins: {
    color: Color.black,
    fontFamily: "SpaceMono-Regular",
    fontSize: 8,
    lineHeight: 12,
  },
  detail: {
    color: Color.black,
    fontFamily: "SpaceMono-Regular",
    fontSize: 10,
    lineHeight: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.45)",
  },
});

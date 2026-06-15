import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { Color } from '../GlobalStyles';
import type {  ApplicationStackParams} from '../navigation/types';

const exploreIcon = require('../assets/Explore.png');
const searchIcon = require('../assets/Search.png');
const favouritesIcon = require('../assets/Favourites.png');
const walletIcon = require('../assets/Wallet.png');
const ticketIcon = require('../assets/Ticket.png');
const settingsIcon = require('../assets/Settings.png');
const topControlIcon = settingsIcon;

const customMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f4f0ff' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#1e1b3a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f4f0ff' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#d7d0fb' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#4a2bb7' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#ede7ff' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#e7defb' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d9d0ff' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#f5f1ff' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#c5b7ff' }] },
  { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#d3c3ff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d3d0fb' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a2bb7' }] },
];

const menuItems = [
  {
    key: 'explore',
    title: 'Explore',
    subtitle: 'Stops and stations',
    icon: exploreIcon,
  },
  {
    key: 'routePlanner',
    title: 'Route planner',
    subtitle: 'Directions',
    icon: searchIcon,
  },
  {
    key: 'favourites',
    title: 'Favourites',
    subtitle: 'Saved Trips',
    icon: favouritesIcon,
  },
  {
    key: 'wallet',
    title: 'Wallet',
    subtitle: 'My cards',
    icon: walletIcon,
  },
  {
    key: 'tickets',
    title: 'Tickets',
    subtitle: 'Access',
    icon: ticketIcon,
  },
  {
    key: 'settings',
    title: 'Settings',
    subtitle: 'Menu/Tools',
    icon: settingsIcon,
  },
];

const initialRegion = {
  latitude: 51.5074,
  longitude: -0.1278,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function Maps() {
  const navigation = useNavigation<NativeStackNavigationProp<ApplicationStackParams>>();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const loadLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionGranted(status === 'granted');

      if (status !== 'granted') {
        return;
      }

      const current = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Highest });
      const currentLocation = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };
      setLocation(currentLocation);

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.LocationAccuracy.Highest,
          distanceInterval: 5,
          timeInterval: 2000,
        },
        (position: Location.LocationObject) => {
          const nextLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(nextLocation);
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              ...nextLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
      );
    };

    loadLocation();

    return () => {
      subscription?.remove();
    };
  }, []);

  if (permissionGranted === false) {
    return (
      <View style={styles.permissionBlocked}>
        <Text style={styles.permissionText}>Location permission is required to show your live position.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        customMapStyle={customMapStyle}
        mapType="standard"
        style={styles.map}
        initialRegion={location ? { ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 } : initialRegion}
      >
        {location && (
          <Marker coordinate={location} anchor={{ x: 0.5, y: 1 }}>
            <Image
              source={require('../assets/Marker.png')}
              style={styles.marker}
              resizeMode="contain"
            />
          </Marker>
        )}
      </MapView>

      <View style={styles.topControl}>
        <Pressable style={styles.topControlButton} onPress={() => {}}>
          <Image source={topControlIcon} style={styles.topControlIcon} resizeMode="contain" />
        </Pressable>
      </View>

      <View style={styles.menuWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.menuScroll}
        >
          {menuItems.map((item) => (
            <Pressable
              key={item.key}
              style={({ pressed }) => [
                styles.menuCard,
                hoveredButton === item.key && styles.menuCardHover,
                pressed && styles.menuCardPressed,
              ]}
              onPress={() => {
                if (item.key === 'explore') {
                  navigation.navigate('Journey');
                }
              }}
              onHoverIn={() => setHoveredButton(item.key)}
              onHoverOut={() => setHoveredButton(null)}
            >
              <View style={styles.menuCardText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Image source={item.icon} style={styles.menuIcon} resizeMode="contain" />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {!location && (
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
  },
  map: {
    width: '100%',
    height: '100%',
  },
  topControl: {
    position: 'absolute',
    top: 54,
    right: 16,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topControlBackground: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: '#eeeeee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  menuWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    paddingLeft: 8,
  },
  menuScroll: {
    paddingRight: 8,
    alignItems: 'center',
  },
  menuCard: {
    width: 130,
    height: 110,
    borderRadius: 16,
    backgroundColor: Color.primary,
    padding: 8,
    marginRight: 13,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    transform: [{ scale: 1 }],
  },
  menuCardHover: {
    transform: [{ scale: 1.04 }],
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  menuCardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  menuCardText: {
    gap: 2,
  },
  menuTitle: {
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontWeight: '700',
    fontSize: 13,
  },
  menuSubtitle: {
    color: Color.white,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 10,
  },
  menuIcon: {
    width: 20,
    height: 20,
    alignSelf: 'flex-end',
  },
  topControlButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  topControlIcon: {
    width: 24,
    height: 24,
  },
  marker: {
    width: 40,
    height: 40,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  permissionBlocked: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: Color.white,
  },
  permissionText: {
    textAlign: 'center',
    color: Color.black,
    fontSize: 16,
  },
});

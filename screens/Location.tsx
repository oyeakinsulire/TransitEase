import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ExpoLocation from 'expo-location';
import { Color } from '../GlobalStyles';

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

const initialRegion = {
  latitude: 51.5074,
  longitude: -0.1278,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function LocationScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    let subscription: ExpoLocation.LocationSubscription | null = null;

    const loadLocation = async () => {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      setPermissionGranted(status === 'granted');

      if (status !== 'granted') {
        return;
      }

      const current = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.LocationAccuracy.Highest });
      const currentLocation = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };
      setLocation(currentLocation);

      subscription = await ExpoLocation.watchPositionAsync(
        {
          accuracy: ExpoLocation.LocationAccuracy.Highest,
          distanceInterval: 5,
          timeInterval: 2000,
        },
        (position: ExpoLocation.LocationObject) => {
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

      <View style={styles.searchRow}>
        <Pressable style={styles.searchInput}>
          <View style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Direct me to....</Text>
        </Pressable>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.tabRow}>
          <Pressable style={[styles.tabButton, styles.tabButtonSelected]}>
            <View style={styles.tabIconPrimary} />
            <Text style={[styles.tabText, styles.tabTextSelected]}>Home</Text>
          </Pressable>
          <Pressable style={[styles.tabButton, styles.tabButtonOutline]}>
            <View style={styles.tabIconWhite} />
            <Text style={[styles.tabText, styles.tabTextOutline]}>Work</Text>
          </Pressable>
          <Pressable style={[styles.tabButton, styles.tabButtonOutline, styles.tabLarge]}>
            <View style={styles.tabIconWhite} />
            <Text style={[styles.tabText, styles.tabTextOutline]}>Favs</Text>
          </Pressable>
        </View>

        <View style={styles.entries}>
          <Pressable style={styles.entryCard}>
            <View style={styles.entryIcon} />
            <Text style={styles.entryText} numberOfLines={2}>
              Sydenham, 201 Johnson street, Mayhem way, SD14 3PN
            </Text>
          </Pressable>
          <Pressable style={styles.entryCard}>
            <View style={styles.entryIcon} />
            <Text style={styles.entryText}>22 Maple Street, Manchester, M15 6AT</Text>
          </Pressable>
        </View>

        <Pressable style={styles.addButton}>
          <View style={styles.addCircle}>
            <Text style={styles.addPlus}>+</Text>
          </View>
          <Text style={styles.addLabel}>Add new location</Text>
        </Pressable>
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
    backgroundColor: Color.white,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
    width: 40,
    height: 40,
  },
  searchRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 280,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 20,
  },
  searchInput: {
    flex: 1,
    height: 53,
    borderRadius: 16,
    backgroundColor: Color.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 10,
    zIndex: 20,
  },
  searchIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ece8ff',
    marginRight: 12,
  },
  searchPlaceholder: {
    color: '#4d4d4d',
    fontFamily: 'SpaceMono-Regular',
    fontSize: 14,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 22,
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: Color.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  tabButton: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  tabButtonSelected: {
    backgroundColor: Color.white,
  },
  tabButtonOutline: {
    backgroundColor: '#5e2acc',
    borderWidth: 1,
    borderColor: '#8348ff',
  },
  tabLarge: {
    flex: 1,
  },
  tabIconPrimary: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: Color.primary,
  },
  tabIconWhite: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: Color.white,
  },
  tabText: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 14,
  },
  tabTextSelected: {
    color: Color.primary,
    fontWeight: '700',
  },
  tabTextOutline: {
    color: Color.white,
  },
  entries: {
    width: '100%',
    gap: 8,
    marginBottom: 18,
  },
  entryCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8348ff',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  entryIcon: {
    width: 22,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#ece8ff',
  },
  entryText: {
    flex: 1,
    color: Color.white,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 11,
    lineHeight: 18,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPlus: {
    color: Color.white,
    fontSize: 18,
    fontFamily: 'SpaceMono-Bold',
    fontWeight: '700',
  },
  addLabel: {
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 12,
    lineHeight: 18,
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

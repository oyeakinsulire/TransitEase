import React, { useEffect, useRef, useState } from 'react';
import MapView from 'react-native-maps';
import { useWindowDimensions, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ExpoLocation from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Color } from '../GlobalStyles';
import type {  ApplicationStackParams} from '../navigation/types';
import { TrainJourneyContent } from './TrainJourneyContent';
import {
  MODEOPT,
  type DestinationSelect,
  type JourneyStage,
  type ModeOption,
  type DownloadRouteStep,
} from './TrainjourneyData';

export default function JourneyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ApplicationStackParams, "Splash">>();
  const insets = useSafeAreaInsets();
  const { width: viewportWidth } = useWindowDimensions();
  const mapRef = useRef<MapView | null>(null);

  const [currentStage, setCurrentStage] = useState<JourneyStage>('location');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<DestinationSelect | null>(null);
  const [selectedMode, setSelectedMode] = useState<ModeOption | null>(null);
  const [startedPage, setStartedPage] = useState(0);
  const [downloadStep, setDownloadStep] = useState<DownloadRouteStep>('closed');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloadPaused, setIsDownloadPaused] = useState(false);
  const [isUsingDownloadedMap, setIsUsingDownloadedMap] = useState(false);

  useEffect(() => {
    let subscription: ExpoLocation.LocationSubscription | null = null;

    const loadLocation = async () => {
      try {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        setPermissionGranted(status === 'granted');

        if (status !== 'granted') {
          return;
        }

        let current: ExpoLocation.LocationObject | null = null;
        try {
          current = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.LocationAccuracy.Highest,
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

        subscription = await ExpoLocation.watchPositionAsync(
          {
            accuracy: ExpoLocation.LocationAccuracy.Highest,
            distanceInterval: 5,
            timeInterval: 2000,
          },
          (position: ExpoLocation.LocationObject) => {
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
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (downloadStep !== 'downloading' || isDownloadPaused) {
      return;
    }

    const timer = setInterval(() => {
      setDownloadProgress((currentProgress) => {
        const nextProgress = Math.min(currentProgress + 2, 100);
        if (nextProgress === 100) {
          setDownloadStep('complete');
        }
        return nextProgress;
      });
    }, 90);

    return () => clearInterval(timer);
  }, [downloadStep, isDownloadPaused]);

  const handleLocationSelect = (destination: DestinationSelect) => {
    setSelectedDestination(destination);
    setCurrentStage('end');
  };

  const handleModeSelect = (mode: ModeOption) => {
    setSelectedMode(mode);
    setCurrentStage(mode.id === 'train' ? 'trainJourney' : 'destination');
  };

  const handleRouteSelect = () => {
    setSelectedMode(MODEOPT[0]);
    setCurrentStage('destination');
  };

  const handleGoPress = () => {
    setStartedPage(0);
    setCurrentStage('started');
  };

  const handleOpenDownloadDialog = () => {
    setDownloadStep('confirm');
  };

  const handleStartRouteDownload = () => {
    setDownloadProgress(0);
    setIsDownloadPaused(false);
    setDownloadStep('downloading');
  };

  const handleToggleDownloadPause = () => {
    setIsDownloadPaused((isPaused) => !isPaused);
  };

  const handleStopRouteDownload = () => {
    setDownloadProgress(0);
    setIsDownloadPaused(false);
    setDownloadStep('closed');
  };

  const handleCloseDownloadDialog = () => {
    setDownloadProgress(0);
    setIsDownloadPaused(false);
    setDownloadStep('closed');
  };

  const handleUseLiveMap = () => {
    setIsUsingDownloadedMap(false);
    setDownloadStep('closed');
    setStartedPage(0);
    setCurrentStage('started');
  };

  const handleUseDownloadedMap = () => {
    setIsUsingDownloadedMap(true);
    setDownloadStep('closed');
    setStartedPage(0);
    setCurrentStage('started');
  };

  const handleBackPress = () => {
    if (currentStage === 'end') {
      setCurrentStage('location');
    } else if (currentStage === 'trainJourney') {
      setCurrentStage('end');
    } else if (currentStage === 'destination') {
      setCurrentStage(selectedMode?.id === 'train' ? 'trainJourney' : 'end');
    } else if (currentStage === 'started') {
      setCurrentStage('destination');
    } else {
      navigation.goBack();
    }
  };

  if (permissionGranted === false) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, backgroundColor: Color.white }}>
        <Text style={{ textAlign: 'center', color: Color.black, fontSize: 16 }}>
          Location permission is required to show your live position.
        </Text>
      </View>
    );
  }

  return (
    <TrainJourneyContent
      currentStage={currentStage}
      insets={insets}
      mapRef={mapRef}
      location={location}
      selectedDestination={selectedDestination}
      startedPage={startedPage}
      startedPageWidth={viewportWidth}
      isLocating={isLocating}
      onBackPress={handleBackPress}
      onLocationSelect={handleLocationSelect}
      onModeSelect={handleModeSelect}
      onRouteSelect={handleRouteSelect}
      onGoPress={handleGoPress}
      onStartedPageChange={setStartedPage}
      downloadStep={downloadStep}
      downloadProgress={downloadProgress}
      isDownloadPaused={isDownloadPaused}
      isUsingDownloadedMap={isUsingDownloadedMap}
      onOpenDownloadDialog={handleOpenDownloadDialog}
      onStartRouteDownload={handleStartRouteDownload}
      onToggleDownloadPause={handleToggleDownloadPause}
      onStopRouteDownload={handleStopRouteDownload}
      onCloseDownloadDialog={handleCloseDownloadDialog}
      onUseLiveMap={handleUseLiveMap}
      onUseDownloadedMap={handleUseDownloadedMap}
    />
  );
}

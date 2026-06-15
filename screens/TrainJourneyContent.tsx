import React from 'react';
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
import type { EdgeInsets } from 'react-native-safe-area-context';
import { Color } from '../GlobalStyles';
import {
  BESTSECTION,
  DESTINATIONOPT,
  MODEOPT,
  JOURNEYINFO,
  OPTROUTES,
  customMapStyle,
  initialRegion,
  journeyIcons,
  type DestinationSelect,
  type DestinationStep,
  type JourneyStage,
  type LegSpec,
  type ModeOption,
  type DownloadRouteStep,
  type TrainCarriage,
} from './TrainjourneyData';

const {
  walkIcon,
  markerIcon,
  districtLineLogo,
  victoriaLineLogo,
  busIcon,
  downloadIcon,
  goIcon,
  downloadRouteCityIcon,
  routeDownloadedIcon,
} = journeyIcons;

function LegIcon({ leg }: { leg: LegSpec }) {
  if (leg.type === 'rail') {
    return (
      <View style={styles.railLeg}>
        <Image source={leg.source} style={styles.legIcon} resizeMode="contain" />
        <View style={styles.swBadge}>
          <Text style={styles.swBadgeText}>{leg.badge}</Text>
        </View>
      </View>
    );
  }
  return <Image source={leg.source} style={styles.legIcon} resizeMode="contain" />;
}

function BestTrainSection({ carriages }: { carriages: TrainCarriage[] }) {
  return (
    <View style={styles.startedBestSection}>
      {carriages.map((carriage) => (
        <Image
          key={carriage.id}
          source={carriage.source}
          style={[
            styles.startedCarriageIMG,
            {
              width: carriage.width,
              height: carriage.height,
            },
          ]}
          resizeMode="contain"
        />
      ))}
    </View>
  );
}

type DownloadRoutePopupMaterials = {
  step: DownloadRouteStep;
  progress: number;
  isPaused: boolean;
  onStartDownload: () => void;
  onTogglePause: () => void;
  onStopDownload: () => void;
  onClose: () => void;
  onUseLiveMap: () => void;
  onUseDownloadedMap: () => void;
};

function DownloadRoutePopup({
  step,
  progress,
  isPaused,
  onStartDownload,
  onTogglePause,
  onStopDownload,
  onClose,
  onUseLiveMap,
  onUseDownloadedMap,
}: DownloadRoutePopupMaterials) {
  if (step === 'closed') {
    return null;
  }

  const progressWidth = `${Math.max(progress, 2)}%` as `${number}%`;

  return (
    <View style={styles.downloadPopupOverlay} pointerEvents="box-none">
      <View style={styles.downloadPopupCard}>
        <Image
          source={downloadRouteCityIcon}
          style={styles.downloadPopupCity}
          resizeMode="cover"
        />
        <Pressable style={styles.downloadPopupCloseButton} onPress={onClose}>
          <Text style={styles.downloadPopupCloseText}>X</Text>
        </Pressable>

        {step === 'complete' ? (
          <>
            <Image
              source={routeDownloadedIcon}
              style={styles.downloadCompleteIcon}
              resizeMode="contain"
            />
            <Text style={styles.downloadCompleteTitle}>Route Downloaded</Text>
            <Pressable style={[styles.downloadCompleteButton, styles.downloadCompleteLiveButton]} onPress={onUseLiveMap}>
              <Text style={styles.downloadPopupButtonText}>Continue With Live Map</Text>
            </Pressable>
            <Pressable style={[styles.downloadCompleteButton, styles.downloadCompleteDownloadedButton]} onPress={onUseDownloadedMap}>
              <Text style={styles.downloadPopupButtonText}>Start with Downloaded Map</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.downloadPopupTitle}>Download Route</Text>
            <Text style={styles.downloadPopupDescription}>
              Download trip for spotty connections on the route
            </Text>
            <View style={styles.downloadPopupRouteSize}>
              <Text style={styles.downloadPopupRouteText}>Route Size:</Text>
              <Text style={styles.downloadPopupRouteStrong}>64 MB</Text>
            </View>

            {step === 'confirm' && (
              <Pressable style={styles.downloadPopupButton} onPress={onStartDownload}>
                <Text style={styles.downloadPopupButtonText}>Download</Text>
              </Pressable>
            )}

            {step === 'downloading' && (
              <>
                <Text style={styles.downloadProgressLabel}>Downloading....</Text>
                <View style={styles.downloadProgressRow}>
                  <View style={styles.downloadProgressTrack}>
                    <View style={[styles.downloadProgressFill, { width: progressWidth }]} />
                  </View>
                  <Text style={styles.downloadProgressPercent}>{progress}%</Text>
                </View>
                <View style={styles.downloadPopupActions}>
                  <Pressable style={styles.downloadPopupSmallButton} onPress={onTogglePause}>
                    <Text style={styles.downloadPopupButtonText}>{isPaused ? 'Continue' : 'Pause'}</Text>
                  </Pressable>
                  <Pressable style={styles.downloadPopupSmallButton} onPress={onStopDownload}>
                    <Text style={styles.downloadPopupButtonText}>Stop</Text>
                  </Pressable>
                </View>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}



type TrainJourneyContentProps = {
  currentStage: JourneyStage;
  insets: EdgeInsets;
  mapRef: React.RefObject<MapView | null>;
  location: { latitude: number; longitude: number } | null;
  selectedDestination: DestinationSelect | null;
  startedPage: number;
  startedPageWidth: number;
  isLocating: boolean;
  onBackPress: () => void;
  onLocationSelect: (destination: DestinationSelect) => void;
  onModeSelect: (mode: ModeOption) => void;
  onRouteSelect: () => void;
  onGoPress: () => void;
  onStartedPageChange: (page: number) => void;
  downloadStep: DownloadRouteStep;
  downloadProgress: number;
  isDownloadPaused: boolean;
  isUsingDownloadedMap: boolean;
  onOpenDownloadDialog: () => void;
  onStartRouteDownload: () => void;
  onToggleDownloadPause: () => void;
  onStopRouteDownload: () => void;
  onCloseDownloadDialog: () => void;
  onUseLiveMap: () => void;
  onUseDownloadedMap: () => void;
};

export function TrainJourneyContent({
  currentStage,
  insets,
  mapRef,
  location,
  selectedDestination,
  startedPage,
  startedPageWidth,
  isLocating,
  onBackPress,
  onLocationSelect,
  onModeSelect,
  onRouteSelect,
  onGoPress,
  onStartedPageChange,
  downloadStep,
  downloadProgress,
  isDownloadPaused,
  isUsingDownloadedMap,
  onOpenDownloadDialog,
  onStartRouteDownload,
  onToggleDownloadPause,
  onStopRouteDownload,
  onCloseDownloadDialog,
  onUseLiveMap,
  onUseDownloadedMap,
}: TrainJourneyContentProps) {
  const destinationSteps: DestinationStep[] = [
    {
      id: 'walk-start',
      title: 'Walk to Dagenham Heathway',
      icon: walkIcon,
      isPrimary: true,
    },
    {
      id: 'district-westbound',
      title: 'District',
      muted: '- Westbound',
      icon: districtLineLogo,
      isPrimary: true,
    },
    {
      id: 'selected-destination',
      title: selectedDestination?.label ?? 'End',
      muted: selectedDestination?.address,
      icon: victoriaLineLogo,
    },
    {
      id: 'walk-end',
      title: 'Walk to destination',
      muted: selectedDestination?.address,
      icon: busIcon,
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        customMapStyle={customMapStyle}
        mapType="standard"
        style={styles.map}
        initialRegion={location ? { ...location, latitudeDelta: 0.02, longitudeDelta: 0.02 } : initialRegion}
      >
        {location && (
          <Marker coordinate={location} anchor={{ x: 0.5, y: 1 }}>
            <Image source={markerIcon} style={styles.marker} resizeMode="contain" />
          </Marker>
        )}
      </MapView>

      {/* Back Button */}
      <Pressable onPress={onBackPress} style={[styles.back, { top: insets.top + 16 }]}>
        <Text style={styles.backText}>←</Text>
      </Pressable>

      {isUsingDownloadedMap && (
        <View style={[styles.downloadedMapBadge, { top: insets.top + 16 }]}>
          <Text style={styles.downloadedMapBadgeText}>Downloaded Map</Text>
        </View>
      )}

      {/* Location Stage */}
      {currentStage === 'location' && (
        <View style={styles.searchRow}>
          <Pressable style={styles.searchInput}>
            <View style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Direct me to....</Text>
          </Pressable>
        </View>
      )}

      {/* Stage Content */}
      {currentStage === 'location' && (
        <View style={styles.locationBottomSheet}>
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
              <Text style={[styles.tabText, styles.tabTextOutline]}>Favourites</Text>
            </Pressable>
          </View>

          <View style={styles.entries}>
            <Pressable
              style={styles.entryCard}
              onPress={() => onLocationSelect(DESTINATIONOPT[0])}
            >
              <View style={styles.entryIcon} />
              <Text style={styles.entryText} numberOfLines={2}>
                201 Johnson street, Mayhem way, SD14 3PN
              </Text>
            </Pressable>
            <Pressable
              style={styles.entryCard}
              onPress={() => onLocationSelect(DESTINATIONOPT[1])}
            >
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
      )}

      {/* End Stage */}
      {currentStage === 'end' && (
        <View style={styles.endBottomSheet}>
          <View style={styles.routePanelEnd}>
            <View style={styles.routeLineColl}>
              <Text style={styles.routeIcon}>◉</Text>
              <View style={styles.routeDash} />
              <Text style={styles.routeIcon}>⌖</Text>
            </View>
            <View style={styles.routeTextCol}>
              <Text style={styles.routeText}>Current location</Text>
              <Text style={styles.routeText} numberOfLines={1}>
                {selectedDestination?.label ?? 'End'}
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            {MODEOPT.map((item) => (
              <Pressable 
                key={item.id} 
                style={styles.card}
                onPress={() => onModeSelect(item)}
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
      )}

      {/* Train Journey Stage */}
      {currentStage === 'trainJourney' && (
        <View style={[styles.trainBottomSheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.routePanel}>
            <View style={styles.routeLineCol}>
              <Text style={styles.routeIcon}>◉</Text>
              <View style={styles.routeDash} />
              <Text style={styles.routeIcon}>⌖</Text>
            </View>
            <View style={styles.routeTextCol}>
              <Text style={styles.routeText}>Current location</Text>
              <Text style={styles.routeText} numberOfLines={1}>
                {selectedDestination?.label ?? 'End'}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.routesList} showsVerticalScrollIndicator={false} bounces={false}>
            {OPTROUTES.map((routeOption, index) => (
              <View key={routeOption.id}>
                <Pressable
                  style={styles.suggestedRow}
                  onPress={onRouteSelect}
                >
                  <View style={styles.suggestedDuration}>
                    <Text style={styles.suggestedDurationMain}>{routeOption.duration}</Text>
                    <Text style={styles.suggestedDurationUnit}>mins</Text>
                  </View>
                  <View style={styles.legsRow}>
                    {routeOption.legs.map((leg, legIndex) => (
                      <LegIcon key={`${routeOption.id}-${legIndex}`} leg={leg} />
                    ))}
                  </View>
                </Pressable>
                {index < OPTROUTES.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Destination Stage */}
      {currentStage === 'destination' && (
        <View style={[styles.destinationBottomSheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.destinationSummaryBar}>
            <View style={styles.destinationLegsSummary}>
              <View style={styles.destinationSummaryIconBox}>
                <Image source={walkIcon} style={styles.destinationSummaryWalkIcon} resizeMode="contain" />
              </View>
              <Text style={styles.destinationSummaryDot}>•</Text>
              <View style={styles.destinationSummaryIconBox}>
                <Image source={districtLineLogo} style={styles.destinationSummaryIcon} resizeMode="contain" />
              </View>
              <Text style={styles.destinationSummaryDot}>•</Text>
              <View style={styles.destinationSummaryIconBox}>
                <Image source={victoriaLineLogo} style={styles.destinationSummaryVictoriaIcon} resizeMode="contain" />
              </View>
              <Text style={styles.destinationSummaryDot}>•</Text>
              <View style={styles.destinationSummaryIconBox}>
                <Image source={busIcon} style={styles.destinationSummaryIcon} resizeMode="contain" />
              </View>
            </View>
            <View style={styles.destinationActions}>
              <Pressable style={styles.destinationDownloadButton} onPress={onOpenDownloadDialog}>
                <Image source={downloadIcon} style={styles.destinationDownloadIcon} resizeMode="contain" />
              </Pressable>
              <Pressable style={styles.destinationGoButton} onPress={onGoPress}>
                <Image source={goIcon} style={styles.destinationGoIcon} resizeMode="contain" />
              </Pressable>
            </View>
          </View>
          <ScrollView
            style={styles.destinationList}
            contentContainerStyle={styles.destinationListContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {destinationSteps.map((step, index) => (
              <View key={step.id} style={styles.destinationStep}>
                <View style={[styles.destinationCard, step.isPrimary && styles.destinationCardPrimary]}>
                  <View style={styles.destinationCardHeader}>
                    <Image source={step.icon} style={styles.destinationStepIcon} resizeMode="contain" />
                    <Text style={styles.destinationStepTitle} numberOfLines={1}>
                      {step.title}
                    </Text>
                    {!!step.muted && (
                      <Text style={styles.destinationStepMuted} numberOfLines={1}>
                        {step.muted}
                      </Text>
                    )}
                  </View>
                  <MapView
                    pointerEvents="none"
                    customMapStyle={customMapStyle}
                    mapType="standard"
                    style={styles.destinationMapPreview}
                    initialRegion={location ? { ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 } : initialRegion}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                  />
                </View>
                {index < destinationSteps.length - 1 && (
                  <View style={styles.destinationArrowWrap}>
                    <View style={styles.destinationArrowDash} />
                    <Text style={styles.destinationArrow}>↓</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Started Journey Stage */}
      {currentStage === 'started' && (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={[styles.startedJourneyPager, { bottom: insets.bottom + 20 }]}
          onMomentumScrollEnd={(event) => {
            onStartedPageChange(Math.round(event.nativeEvent.contentOffset.x / startedPageWidth));
          }}
        >
          <View style={[styles.startedPage, { width: startedPageWidth }]}>
            <View style={styles.startedJourneyPanel}>
              <View style={styles.startedJourneyHeader}>
                <Image source={walkIcon} style={styles.startedJourneyHeaderIcon} resizeMode="contain" />
                <Text style={styles.startedJourneyTitle} numberOfLines={1}>
                  Walk to Dagenham Heathway
                </Text>
                <Image source={districtLineLogo} style={styles.startedJourneyLineIcon} resizeMode="contain" />
              </View>

              <View style={styles.startedInstructions}>
                {JOURNEYINFO.map((instruction) => (
                  <View key={instruction.id} style={styles.startedInstructionRow}>
                    <View style={styles.startedInstructionIconBox}>
                      <Text style={styles.startedInstructionIcon}>{instruction.icon}</Text>
                    </View>
                    <View style={styles.startedInstructionTextWrap}>
                      <Text style={styles.startedInstructionTitle}>{instruction.title}</Text>
                      {!!instruction.detail && (
                        <Text style={styles.startedInstructionDetail} numberOfLines={1}>
                          {instruction.detail}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.startedPagerDots}>
                {[0, 1, 2, 3, 4, 5].map((dot) => (
                  <View
                    key={`walk-dot-${dot}`}
                    style={[styles.startedPagerDot, dot === startedPage && styles.startedPagerDotActive]}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.startedPage, { width: startedPageWidth }]}>
            <View style={styles.startedJourneyPanel}>
              <View style={styles.startedJourneyHeader}>
                <Image source={districtLineLogo} style={styles.startedJourneyLineIcon} resizeMode="contain" />
                <Text style={styles.startedJourneyTitle} numberOfLines={1}>
                  District - Westbound
                </Text>
              </View>
              <View style={styles.startedStationList}>
                {['Ealing Broadway', 'Wimbledon', 'Wimbledon', 'Ealing Broadway'].map((station, index) => (
                  <View key={`${station}-${index}`} style={[styles.startedStationRow, index === 0 && styles.startedStationRowActive]}>
                    <View style={[styles.startedStationBullet, index === 0 && styles.startedStationBulletActive]} />
                    <Text style={[styles.startedStationText, index === 0 && styles.startedStationTextActive]}>
                      {station}
                    </Text>
                    <Text style={[styles.startedStationTime, index === 0 && styles.startedStationTextActive]}>
                      {index === 0 ? '1 min' : '9 min'}
                    </Text>
                  </View>
                ))}
              </View>
              <BestTrainSection carriages={BESTSECTION} />
              <Text style={styles.startedBestText}>Best Section- <Text style={styles.startedBestStrong}>Front</Text> or <Text style={styles.startedBestStrong}>Back</Text></Text>
              <View style={styles.startedPagerDots}>
                {[, 1, 2, 3, 4, 5].map((dot) => (
                  <View key={`district-list-dot-${dot}`} style={[styles.startedPagerDot, dot === startedPage && styles.startedPagerDotActive]} />
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.startedPage, { width: startedPageWidth }]}>
            <View style={styles.startedJourneyPanel}>
              <View style={styles.startedJourneyHeader}>
                <Image source={districtLineLogo} style={styles.startedJourneyLineIcon} resizeMode="contain" />
                <Text style={styles.startedJourneyTitle} numberOfLines={1}>
                  District - Westbound
                </Text>
                <Text style={styles.startedJourneyMinutes}>35 mins</Text>
              </View>
              <View style={styles.startedRouteDiagram}>
                <Text style={[styles.SSLabel, styles.SSStart]}>Dagenham{'\n'}Heathway</Text>
                <Text style={[styles.SSLabel, styles.SSEnd]}>Victoria</Text>
                <Text style={[styles.SSLabel, styles.SStopBecontree]}>Becontree</Text>
                <Text style={[styles.SSLabel, styles.SStopUpney]}>Upney</Text>
                <Text style={[styles.SSLabel, styles.SStopEastHam]}>East Ham</Text>
                <Text style={[styles.SSLabel, styles.SStopBarking]}>Barking</Text>
                <Text style={[styles.SSLabel, styles.SStopWestHam]}>West Ham</Text>
                <Text style={[styles.SSLabel, styles.SStopWhitechapel]}>Whitechapel</Text>
                <Text style={[styles.SSLabel, styles.SStopMileEnd]}>Mile End</Text>
                <Text style={[styles.SSLabel, styles.SStopMonument]}>Monument</Text>
                <Text style={[styles.SSLabel, styles.SStopEmbankment]}>Embankment</Text>
                <Text style={[styles.SSLabel, styles.SStopWestminster]}>Westminster</Text>
                <View style={[styles.SSLine, styles.SSTop]} />
                <View style={[styles.SSLine, styles.SSRight]} />
                <View style={[styles.SSLine, styles.SSMiddle]} />
                <View style={[styles.SSLine, styles.SSLeftDrop]} />
                <View style={[styles.SSLine, styles.SSBottom]} />
                <View style={[styles.SSLine, styles.SSEndDrop]} />
                <View style={[styles.SSTick, styles.startedTickOne]} />
                <View style={[styles.SSTick, styles.startedTickTwo]} />
                <View style={[styles.SSTick, styles.startedTickThree]} />
                <View style={[styles.SSTick, styles.startedTickFour]} />
                <View style={[styles.SSTick, styles.startedTickFive]} />
                <View style={[styles.SSTick, styles.startedTickSix]} />
                <View style={[styles.SSNode, styles.SSNodeStart]} />
                <View style={[styles.SSNode, styles.SSNodeEnd]} />
              </View>
              <Text style={styles.startedChangeText}>Change to</Text>
              <Image source={victoriaLineLogo} style={styles.startedChangeIcon} resizeMode="contain" />
              <View style={styles.startedPagerDots}>
                {[0, 1, 2, 3, 4, 5, 6].map((dot) => (
                  <View key={`district-map-dot-${dot}`} style={[styles.startedPagerDot, dot === startedPage && styles.startedPagerDotActive]} />
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.startedPage, { width: startedPageWidth }]}>
            <View style={styles.startedJourneyPanel}>
              <View style={styles.startedJourneyHeader}>
                <Image source={victoriaLineLogo} style={styles.startedJourneyLineIcon} resizeMode="contain" />
                <Text style={styles.startedJourneyTitle} numberOfLines={1}>
                  London Bridge
                </Text>
              </View>
              <View style={styles.startedStationList}>
                {['Stanmore', 'Baker Street', 'London Bridge', 'Wembley Park'].map((station, index) => (
                  <View key={`${station}-${index}`} style={[styles.startedStationRow, index === 0 && styles.startedStationRowActive]}>
                    <View style={[styles.startedStationBullet, index === 0 && styles.startedStationBulletActive]} />
                    <Text style={[styles.startedStationText, index === 0 && styles.startedStationTextActive]}>
                      {station}
                    </Text>
                    <Text style={[styles.startedStationTime, index === 0 && styles.startedStationTextActive]}>
                      {index === 0 ? '1 min' : '9 min'}
                    </Text>
                  </View>
                ))}
              </View>
              <BestTrainSection carriages={BESTSECTION} />
              <Text style={styles.startedBestText}>Best Section- <Text style={styles.startedBestStrong}>Front</Text> or <Text style={styles.startedBestStrong}>Back</Text></Text>
              <View style={styles.startedPagerDots}>
                {[0, 1, 2, 3, 4, 5].map((dot) => (
                  <View key={`bridge-list-dot-${dot}`} style={[styles.startedPagerDot, dot === startedPage && styles.startedPagerDotActive]} />
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.startedPage, { width: startedPageWidth }]}>
            <View style={styles.startedJourneyPanel}>
              <View style={styles.startedJourneyHeader}>
                <Image source={victoriaLineLogo} style={styles.startedJourneyLineIcon} resizeMode="contain" />
                <Text style={styles.startedJourneyTitle} numberOfLines={1}>
                  London Bridge
                </Text>
                <Text style={styles.startedJourneyMinutes}>14 mins</Text>
              </View>
              <View style={styles.startedRouteDiagram}>
                <Text style={[styles.SSLabel, styles.SSStart]}>Victoria</Text>
                <Text style={[styles.SSLabel, styles.SSEnd]}>{selectedDestination?.label ?? 'Sydenham'}</Text>
                <Text style={[styles.SSLabel, styles.SStopClapham]}>Clapham Junction</Text>
                <Text style={[styles.SSLabel, styles.SStopBattersea]}>Battersea Park</Text>
                <Text style={[styles.SSLabel, styles.SStopStreatham]}>Streatham Hill</Text>
                <Text style={[styles.SSLabel, styles.SStopBalham]}>Balham</Text>
                <Text style={[styles.SSLabel, styles.SStopNorwood]}>West Norwood</Text>
                <Text style={[styles.SSLabel, styles.SStopCrystal]}>Crystal Palace</Text>
                <View style={[styles.SSLine, styles.SSTop]} />
                <View style={[styles.SSLine, styles.SSRight]} />
                <View style={[styles.SSLine, styles.SSMiddle]} />
                <View style={[styles.SSLine, styles.SSLeftDrop]} />
                <View style={[styles.SSLine, styles.SSBottom]} />
                <View style={[styles.SSLine, styles.SSEndDrop]} />
                <View style={[styles.SSTick, styles.startedTickOne]} />
                <View style={[styles.SSTick, styles.startedTickTwo]} />
                <View style={[styles.SSTick, styles.startedTickThree]} />
                <View style={[styles.SSTick, styles.startedTickFour]} />
                <View style={[styles.SSTick, styles.startedTickFive]} />
                <View style={[styles.SSTick, styles.startedTickSix]} />
                <View style={[styles.SSNode, styles.SSNodeStart]} />
                <View style={[styles.SSNode, styles.SSNodeEnd]} />
              </View>
              <Text style={styles.startedExitText}>Station Exit <Text style={styles.startedBestStrong}>3 min</Text></Text>
              <View style={styles.startedPagerDots}>
                {[0, 1, 2, 3, 4, 5].map((dot) => (
                  <View key={`bridge-map-dot-${dot}`} style={[styles.startedPagerDot, dot === startedPage && styles.startedPagerDotActive]} />
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.startedPage, { width: startedPageWidth }]}>
            <View style={[styles.startedJourneyPanel, styles.startedArrivedPanel]}>
              <Image source={markerIcon} style={styles.startedArrivedMarker} resizeMode="contain" />
              <Text style={styles.startedArrivedTitle}>ARRIVED</Text>
              <Text style={styles.startedArrivedText}>
                <Text style={styles.startedBestStrong}>{selectedDestination?.label ?? 'Sydenham'}</Text>
              </Text>
              <View style={styles.startedPagerDots}>
                {[0, 1, 2, 3, 4, 5].map((dot) => (
                  <View key={`arrived-dot-${dot}`} style={[styles.startedPagerDot, dot === startedPage && styles.startedPagerDotActive]} />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {isLocating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      )}

      <DownloadRoutePopup
        step={downloadStep}
        progress={downloadProgress}
        isPaused={isDownloadPaused}
        onStartDownload={onStartRouteDownload}
        onTogglePause={onToggleDownloadPause}
        onStopDownload={onStopRouteDownload}
        onClose={onCloseDownloadDialog}
        onUseLiveMap={onUseLiveMap}
        onUseDownloadedMap={onUseDownloadedMap}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    width: 36,
    height: 36,
  },
  back: {
    position: 'absolute',
    left: 16,
    zIndex: 30,
  },
  backText: {
    color: Color.primary,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  downloadedMapBadge: {
    position: 'absolute',
    right: 16,
    zIndex: 35,
    backgroundColor: Color.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 2,
    borderColor: Color.white,
  },
  downloadedMapBadgeText: {
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 10,
    lineHeight: 12,
  },
  searchRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 264,
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

  // Location Stage
  locationBottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 44,
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

  // Train Journey Stage
  trainBottomSheet: {
    position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 18,
    backgroundColor: Color.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  routePanel: {
    height: 108,
    borderRadius: 20,
    backgroundColor: Color.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  routeLineCol: {
    width: 26,
    alignItems: 'center',
    marginRight: 10,
  },
  routeLineColl: {
    width: 26,
    alignItems: 'center',
    marginRight: 10,
  },
  routeIcon: {
    color: Color.primary,
    fontSize: 16,
    fontFamily: 'SpaceMono-Bold',
  },
  routeDash: {
    width: 2,
    height: 28,
    borderStyle: 'dashed',
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
    fontFamily: 'SpaceMono-Bold',
    fontSize: 14,
  },
  routesList: {
    marginHorizontal: 4,
    maxHeight: 250,
  },
  suggestedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Color.white,
    borderRadius: 16,
    marginBottom: 8,
  },
  suggestedDuration: {
    alignItems: 'flex-start',
    minWidth: 72,
  },
  suggestedDurationMain: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 28,
    color: Color.black,
    lineHeight: 30,
  },
  suggestedDurationUnit: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 9,
    color: Color.black,
  },
  legsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  legIcon: {
    width: 22,
    height: 22,
  },
  railLeg: {
    alignItems: 'center',
    gap: 2,
  },
  swBadge: {
    minWidth: 24,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: Color.black,
  },
  swBadgeText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 8,
    color: Color.white,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 12,
  },

  // Destination Stage
  destinationBottomSheet: {
    position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '50%',
    paddingTop: 0,
    paddingHorizontal: 0,
    backgroundColor: Color.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  destinationSummaryBar: {
    height: 52,
    width: '100%',
    backgroundColor: Color.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: Color.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
  },
  destinationLegsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  destinationSummaryIconBox: {
    width: 20,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#c8c8c8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationSummaryIcon: {
    width: 14,
    height: 14,
  },
  destinationSummaryWalkIcon: {
    width: 9,
    height: 14,
  },
  destinationSummaryVictoriaIcon: {
    width: 20,
    height: 24,
  },
  destinationSummaryDot: {
    color: '#6a6a6a',
    fontFamily: 'SpaceMono-Bold',
    fontSize: 18,
    lineHeight: 20,
  },
  destinationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  destinationDownloadButton: {
    width: 34,
    height: 26,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationDownloadIcon: {
    width: 20,
    height: 20,
  },
  destinationGoButton: {
    width: 54,
    height: 26,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationGoIcon: {
    width: 28,
    height: 28,
  },
  destinationList: {
    width: '100%',
    paddingHorizontal: 18,
  },
  destinationListContent: {
    paddingTop: 16,
    paddingBottom: 6,
  },
  destinationStep: {
    alignItems: 'center',
  },
  destinationCard: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: Color.white,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 12,
  },
  destinationCardPrimary: {
    backgroundColor: '#bda3ff',
  },
  destinationCardHeader: {
    minHeight: 19,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  destinationStepIcon: {
    width: 18,
    height: 18,
  },
  destinationStepTitle: {
    flexShrink: 1,
    color: Color.black,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 10,
    lineHeight: 14,
  },
  destinationStepMuted: {
    flexShrink: 1,
    color: '#3f3f3f',
    fontFamily: 'SpaceMono-Regular',
    fontSize: 8,
    lineHeight: 12,
  },
  destinationMapPreview: {
    width: '100%',
    height: 118,
    borderRadius: 18,
    overflow: 'hidden',
  },
  destinationArrowWrap: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationArrowDash: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 29,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Color.white,
  },
  destinationArrow: {
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 34,
    lineHeight: 38,
    marginTop: 8,
  },

  // Download Route Popup
  downloadPopupOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  downloadPopupCard: {
    width: '100%',
    maxWidth: 370,
    height: 300,
    borderRadius: 14,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 18,
  },
  downloadPopupCity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 190,
    width: '100%',
    height: 142,
    opacity: 0.72,
  },
  downloadPopupCloseButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  downloadPopupCloseText: {
    color: '#3f3f3f',
    fontFamily: 'SpaceMono-Bold',
    fontSize: 16,
    lineHeight: 20,
  },
  downloadPopupTitle: {
    position: 'absolute',
    top: 0,
    left: 14,
    color: Color.black,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 16,
    lineHeight: 24,
  },
  downloadPopupDescription: {
    position: 'absolute',
    top: 40,
    left: 14,
    width: 280,
    color: '#3f3f3f',
    fontFamily: 'SpaceMono-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  downloadPopupRouteSize: {
    position: 'absolute',
    top: 126,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadPopupRouteText: {
    color: '#3f3f3f',
    fontFamily: 'SpaceMono-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  downloadPopupRouteStrong: {
    color: '#3f3f3f',
    fontFamily: 'SpaceMono-Bold',
    fontSize: 16,
    lineHeight: 24,
  },
  downloadPopupButton: {
    position: 'absolute',
    left: 45,
    right: 30,
    bottom: 14,
    height: 40,
    borderRadius: 12,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  downloadCompleteButton: {
    position: 'absolute',
    height: 40,
    borderRadius: 12,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 4,
  },
  downloadCompleteLiveButton: {
    top: 180,
    alignSelf: 'center',
    width: 244,
  },
  downloadCompleteDownloadedButton: {
    top: 240,
    alignSelf: 'center',
    width: 256,
  },
  downloadPopupButtonText: {
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  downloadProgressLabel: {
    position: 'absolute',
    top: 177,
    left: 14,
    color: '#3f3f3f',
    fontFamily: 'SpaceMono-Regular',
    fontSize: 10,
    lineHeight: 24,
  },
  downloadProgressRow: {
    position: 'absolute',
    top: 202,
    left: 6,
    right: 6,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  downloadProgressTrack: {
    flex: 1,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bdbdbd',
    overflow: 'hidden',
  },
  downloadProgressFill: {
    height: '100%',
    borderRadius: 12,
    backgroundColor: Color.primary,
  },
  downloadProgressPercent: {
    width: 46,
    color: '#3f3f3f',
    fontFamily: 'SpaceMono-Regular',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right',
  },
  downloadPopupActions: {
    position: 'absolute',
    left: 45,
    right: 64,
    bottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  downloadPopupSmallButton: {
    minWidth: 78,
    height: 40,
    borderRadius: 12,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  downloadCompleteIcon: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    marginTop: 18,
  },
  downloadCompleteTitle: {
    alignSelf: 'center',
    color: Color.black,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 0,
  },

  // Started Journey Stage
  startedJourneyPager: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  startedPage: {
    paddingHorizontal: 18,
    justifyContent: 'flex-end',
  },
  startedJourneyPanel: {
    height: 384,
    borderRadius: 21,
    backgroundColor: Color.primary,
    paddingHorizontal: 13,
    paddingTop: 10,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 14,
    overflow: 'hidden',
  },
  startedJourneyHeader: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  startedJourneyHeaderIcon: {
    width: 18,
    height: 28,
    tintColor: '#b69aff',
  },
  startedJourneyTitle: {
    flexShrink: 1,
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 12,
    lineHeight: 16,
  },
  startedJourneyLineIcon: {
    width: 18,
    height: 14,
    tintColor: Color.white,
  },
  startedJourneyMinutes: {
    marginLeft: 'auto',
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 18,
    lineHeight: 20,
  },
  startedInstructions: {
    paddingTop: 14,
    gap: 8,
  },
  startedInstructionRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
  },
  startedInstructionIconBox: {
    width: 38,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#8f69da',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  startedInstructionIcon: {
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 22,
    lineHeight: 24,
  },
  startedInstructionTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  startedInstructionTitle: {
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 14,
    lineHeight: 18,
  },
  startedInstructionDetail: {
    color: '#b69aff',
    fontFamily: 'SpaceMono-Regular',
    fontSize: 10,
    lineHeight: 12,
  },
  startedPagerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginTop: 'auto',
    paddingBottom: 2,
  },
  startedPagerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  startedPagerDotActive: {
    backgroundColor: Color.white,
  },
  startedStationList: {
    paddingTop: 18,
    gap: 9,
  },
  startedStationRow: {
    height: 31,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 12,
  },
  startedStationRowActive: {
    backgroundColor: '#d8d4df',
  },
  startedStationBullet: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#dcdcdc',
    borderWidth: 1,
    borderColor: Color.black,
  },
  startedStationBulletActive: {
    backgroundColor: Color.black,
  },
  startedStationText: {
    flex: 1,
    color: Color.white,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 11,
  },
  startedStationTextActive: {
    color: Color.white,
  },
  startedStationTime: {
    color: Color.white,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 9,
  },
  startedBestSection: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  startedCarriageIMG: {
    flexShrink: 0,
  },
  startedBestText: {
    color: Color.white,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  startedBestStrong: {
    fontFamily: 'SpaceMono-Bold',
    color: Color.white,
  },
  startedRouteDiagram: {
    height: 290,
    marginTop: 16,
    marginHorizontal: 8,
  },
  SSLine: {
    position: 'absolute',
    height: 8,
    backgroundColor: Color.black,
  },
  SSTop: {
    top: 70,
    left: 45,
    right: 70,
  },
  SSRight: {
    top: 70,
    right: 66,
    width: 8,
    height: 86,
  },
  SSMiddle: {
    top: 152,
    left: 78,
    right: 66,
  },
  SSLeftDrop: {
    top: 152,
    left: 78,
    width: 8,
    height: 72,
  },
  SSBottom: {
    top: 220,
    left: 78,
    right: 32,
  },
  SSEndDrop: {
    top: 220,
    right: 32,
    width: 8,
    height: 50,
  },
  SSTick: {
    position: 'absolute',
    width: 5,
    height: 18,
    backgroundColor: Color.black,
  },
  startedTickOne: {
    top: 70,
    left: 88,
  },
  startedTickTwo: {
    top: 57,
    left: 190,
  },
  startedTickThree: {
    top: 139,
    left: 146,
  },
  startedTickFour: {
    top: 207,
    left: 158,
  },
  startedTickFive: {
    top: 207,
    right: 90,
  },
  startedTickSix: {
    top: 207,
    right: 0,
  },
  SSNode: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: Color.black,
    backgroundColor: '#d8d4df',
  },
  SSNodeStart: {
    top: 65,
    left: 38,
  },
  SSNodeEnd: {
    top: 262,
    right: 27,
  },
  SSLabel: {
    position: 'absolute',
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 10,
    lineHeight: 13,
  },
  SSStart: {
    top: 32,
    left: 18,
  },
  SSEnd: {
    bottom: 0,
    right: 6,
    textAlign: 'right',
  },
  SStopUpney: {
    top: 40,
    left: 112,
  },
   SStopBecontree: {
    top: 86,
    left: 62,
  },
  SStopEastHam: {
    top: 40,
    left: 176,
  },
  SStopBarking: {
    top: 86,
    left: 138,
  },
  SStopWestHam: {
    top: 106,
    right: 82,
  },
  SStopWhitechapel: {
    top: 126,
    left: 78,
  },
  SStopMileEnd: {
    top: 126,
    left: 158,
  },
  SStopMonument: {
    top: 188,
    left: 20,
  },
  SStopEmbankment: {
    top: 198,
    left: 160,
  },
  SStopWestminster: {
    top: 236,
    right: 78,
  },
  SStopClapham: {
    top: 40,
    left: 150,
  },
  SStopBattersea: {
    top: 92,
    left: 64,
  },
  SStopStreatham: {
    top: 125,
    left: 110,
  },
  SStopBalham: {
    top: 194,
    right: 74,
  },
  SStopNorwood: {
    top: 194,
    left: 118,
  },
  SStopCrystal: {
    top: 236,
    right: 72,
  },
  
  startedChangeText: {
    position: 'absolute',
    left: 32,
    bottom: 36,
    color: Color.white,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 11,
  },
  startedChangeIcon: {
    position: 'absolute',
    left: 100,
    bottom: 32,
    width: 24,
    height: 28,
  },
  startedExitText: {
    position: 'absolute',
    left: 42,
    bottom: 36,
    color: Color.white,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 11,
  },
  startedArrivedPanel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  startedArrivedMarker: {
    width: 66,
    height: 66,
    marginBottom: 50,
  },
  startedArrivedTitle: {
    color: Color.white,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 48,
    marginBottom: 0,
  },
  startedArrivedText: {
    color: Color.white,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 16,
    lineHeight: 30,
    marginBottom: 96,
  },

  // End Stage
  endBottomSheet: {
    position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 18,
    backgroundColor: Color.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  routePanelEnd: {
    height: 108,
    borderRadius: 20,
    backgroundColor: Color.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    maxHeight: 220,
  },
  card: {
    width: '50%',
    height: 50,
    backgroundColor: Color.white,
    borderRadius: 24,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeIcon: {
    width: 28,
    height: 28,
  },
  metrics: {
    alignItems: 'flex-end',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  duration: {
    color: Color.black,
    fontFamily: 'SpaceMono-Bold',
    fontSize: 20,
    lineHeight: 24,
  },
  mins: {
    color: Color.black,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 8,
    lineHeight: 12,
  },
  detail: {
    color: Color.black,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 10,
    lineHeight: 12,
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

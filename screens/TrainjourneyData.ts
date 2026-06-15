import type { ImageSourcePropType } from 'react-native';
import trainIcon from '../assets/train.png';
import walkIcon from '../assets/walk.png';
import carIcon from '../assets/car.png';
import taxiIcon from '../assets/taxi.png';
import bikeIcon from '../assets/bike.png';
import boatIcon from '../assets/boat.png';
import markerIcon from '../assets/Marker.png';
import currentLocationIcon from '../assets/currentlocation.png';
import endLocationIcon from '../assets/endlocation.png';
import districtLineLogo from '../assets/District Line.png';
import victoriaLineLogo from '../assets/Victoria Line.png';
import busIcon from '../assets/TFL bus.png';
import downloadIcon from '../assets/download.png';
import goIcon from '../assets/Go.png';
import downloadRouteCityIcon from '../assets/downloadbg.png';
import routeDownloadedIcon from '../assets/CompletedDownload.png';
import frontCarriage from '../assets/frontcarriage.png';
import secondCarriage from '../assets/secondcarriage.png';
import thirdCarriage from '../assets/thirdcarriage.png';
import fourthCarriage from '../assets/fourthcarriage.png';
import backCarriage from '../assets/backcarriage.png';

export type JourneyStage = 'location' | 'end' | 'trainJourney' | 'destination' | 'started'; 

export type ModeOption = {
  id: string;
  icon: any;
  durationMins: number;
  detail: string;
};

export type LegSpec =
  | { type: 'icon'; source: ImageSourcePropType }
  | { type: 'rail'; source: ImageSourcePropType; badge: string };

export type DestinationSelect = {
  label: string;
  address: string;
};

export type DestinationStep = {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  muted?: string;
  isPrimary?: boolean;
};

export type JourneyDetails = {
  id: string;
  icon: string;
  title: string;
  detail?: string;
};

export type TrainCarriage = {
  id: string;
  source: ImageSourcePropType;
  width: number;
  height: number;
};

export type DownloadRouteStep = 'closed' | 'confirm' | 'downloading' | 'complete';

export const journeyIcons = {
  trainIcon,
  walkIcon,
  carIcon,
  taxiIcon,
  bikeIcon,
  boatIcon,
  markerIcon,
  currentLocationIcon,
  endLocationIcon,
  districtLineLogo,
  victoriaLineLogo,
  busIcon,
  downloadIcon,
  goIcon,
  downloadRouteCityIcon,
  routeDownloadedIcon,
  frontCarriage,
  secondCarriage,
  thirdCarriage,
  fourthCarriage,
  backCarriage,
};

export const BESTSECTION: TrainCarriage[] = [
    {
    id: 'back',
    source: backCarriage,
    width: 9,
    height: 19,
  },
  {
    id: 'fourth',
    source: fourthCarriage,
    width: 42,
    height: 19,
  },
    {
    id: 'third',
    source: secondCarriage,
    width: 42,
    height: 19,
  },
    {
    id: 'second',
    source: thirdCarriage,
    width: 42,
    height: 19,
  },
    {
    id: 'first',
    source: frontCarriage,
    width: 35,
    height: 19,
  },
];

export const customMapStyle = [
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

export const initialRegion = {
  latitude: 51.5074,
  longitude: -0.1278,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export const MODEOPT: ModeOption[] = [
  {
    id: 'train',
    icon: trainIcon,
    durationMins: 105,
    detail: '£3.85',
  },
  {
    id: 'walk',
    icon: walkIcon,
    durationMins: 331,
    detail: '1377 cal',
  },
  {
    id: 'car',
    icon: carIcon,
    durationMins: 55,
    detail: 'Fastest',
  },
  {
    id: 'taxi',
    icon: taxiIcon,
    durationMins: 55,
    detail: '£33+',
  },
  {
    id: 'bike',
    icon: bikeIcon,
    durationMins: 119,
    detail: '496 cal',
  },
  {
    id: 'boat',
    icon: boatIcon,
    durationMins: 30,
    detail: '£5.20+',
  },
];

export const OPTROUTES: { id: string; duration: number; legs: LegSpec[] }[] = [
  {
    id: 'r1',
    duration: 112,
    legs: [
      { type: 'icon', source: walkIcon },
      { type: 'icon', source: districtLineLogo },
      { type: 'rail', source: victoriaLineLogo, badge: 'SW' },
      { type: 'icon', source: busIcon },
    ],
  },
  {
    id: 'r2',
    duration: 122,
    legs: [
      { type: 'icon', source: walkIcon },
      { type: 'icon', source: districtLineLogo },
      { type: 'icon', source: districtLineLogo },
      { type: 'icon', source: busIcon },
    ],
  },
  {
    id: 'r3',
    duration: 142,
    legs: [
      { type: 'icon', source: walkIcon },
      { type: 'icon', source: districtLineLogo },
      { type: 'rail', source: victoriaLineLogo, badge: 'SW' },
      { type: 'icon', source: walkIcon },
    ],
  },
];

export const DESTINATIONOPT: DestinationSelect[] = [
  {
    label: '201 Johnson street',
    address: '201 Johnson street, Mayhem way, SD14 3PN',
  },
  {
    label: '22 Maple Street',
    address: '22 Maple Street, Manchester, M15 6AT',
  },
];

export const JOURNEYINFO: JourneyDetails[] = [
  {
    id: 'walk-southeast',
    icon: '➜',
    title: 'Walk Southeast',
  },
  {
    id: 'turn-left-55',
    icon: '↵',
    title: 'In 55 Yards',
    detail: 'Turn left',
  },
  {
    id: 'turn-left-50',
    icon: '↵',
    title: 'In 50 Yards',
    detail: 'Turn left onto New Road',
  },
  {
    id: 'turn-right-70',
    icon: '↱',
    title: 'In 70 Yards',
    detail: 'Turn Right onto Heathway',
  },
  {
    id: 'turn-right-station',
    icon: '↱',
    title: 'In 70 Yards',
    detail: 'Turn Right onto Station Parade, Heathway',
  },
  {
    id: 'arrive',
    icon: '⚑',
    title: 'In 70 Yards',
    detail: 'Arrive at the Dagenham Heathway',
  },
];

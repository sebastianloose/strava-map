export default interface Activity {
  id: number;
  name: string;
  distance: number;
  movingTime: number;
  elapsedTime: number;
  totalElevationGain: number;
  type: string;
  polylineRoute: string;
  route: [number, number][];
  isDetailedRoute: boolean;
  averageSpeed: number;
  maxSpeed: number;
  averageHeartRate: number;
  maxHeartRate: number;
  averageCadence: number;
  averageTemperature: number;
  averageWatts: number;
  startDate: string;
  visible: boolean;
}

export interface Prediction {
  queueLength: string;
  waitTimeMinutes: number;
  justification: string;
}

export interface ChartDataPoint {
  time: string;
  [canteenName: string]: number | string;
}

export interface Canteen {
  name: string;
  latitude: number;
  longitude: number;
}

import React, { useState, useCallback, useEffect } from 'react';
import { Prediction, ChartDataPoint, Canteen } from './types';
import { predictQueue, getAnalyticsData } from './services/geminiService';
import PredictionForm from './components/PredictionForm';
import ResultDisplay from './components/ResultDisplay';
import AnalyticsChart from './components/AnalyticsChart';
import { CanteenIcon, ChartIcon, GithubIcon } from './components/Icons';

const CANTEENS: Canteen[] = [
  { name: 'North Spine Plaza', latitude: 1.3479, longitude: 103.6804 },
  { name: 'The Hive', latitude: 1.3501, longitude: 103.6833 },
  { name: 'South Spine Canteen', latitude: 1.3431, longitude: 103.6826 },
];

// Haversine distance formula to find distance between two lat/lon points
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

const findClosestCanteen = (userLat: number, userLon: number): string => {
  let closestCanteen = CANTEENS[0];
  let minDistance = Infinity;

  CANTEENS.forEach(canteen => {
    const distance = getDistance(userLat, userLon, canteen.latitude, canteen.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      closestCanteen = canteen;
    }
  });

  return closestCanteen.name;
};


export default function App(): React.JSX.Element {
  const [canteen, setCanteen] = useState<string>('North Spine Plaza');
  const [time, setTime] = useState<string>('12:30');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const handlePredict = useCallback(async (canteenOverride?: string) => {
    const targetCanteen = canteenOverride || canteen;
    if (!targetCanteen || !time) {
      setError('Please enter both canteen name and time.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await predictQueue(targetCanteen, time);
      setPrediction(result);
    } catch (e) {
      console.error(e);
      setError('Failed to get prediction. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [canteen, time]);

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const closestCanteenName = findClosestCanteen(latitude, longitude);
        setCanteen(closestCanteenName);
        // Trigger prediction immediately with the found canteen
        handlePredict(closestCanteenName).finally(() => setIsLocating(false));
      },
      (geoError) => {
        switch(geoError.code) {
            case geoError.PERMISSION_DENIED:
                setError("You denied the request for Geolocation.");
                break;
            case geoError.POSITION_UNAVAILABLE:
                setError("Location information is unavailable.");
                break;
            case geoError.TIMEOUT:
                setError("The request to get user location timed out.");
                break;
            default:
                setError("An unknown error occurred while getting location.");
                break;
        }
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  }, [handlePredict]);

  const fetchChartData = useCallback(async () => {
    try {
      const data = await getAnalyticsData();
      setChartData(data);
    } catch (e) {
      console.error("Failed to fetch analytics data:", e);
      // Set some fallback data on error
      setChartData([
        { time: '08:00', 'North Spine Plaza': 10, 'The Hive': 5, 'South Spine Canteen': 8 },
        { time: '12:00', 'North Spine Plaza': 50, 'The Hive': 35, 'South Spine Canteen': 45 },
        { time: '18:00', 'North Spine Plaza': 40, 'The Hive': 25, 'South Spine Canteen': 30 },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-2 flex items-center justify-center gap-3">
            <CanteenIcon className="w-10 h-10" />
            QueueSmart
          </h1>
          <p className="text-lg text-textSecondary">Smart Canteen Queue Predictor</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-surface p-6 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">Get a Prediction</h2>
            <PredictionForm
              canteen={canteen}
              setCanteen={setCanteen}
              time={time}
              setTime={setTime}
              onPredict={() => handlePredict()}
              isLoading={isLoading}
              onUseLocation={handleUseLocation}
              isLocating={isLocating}
            />
            <ResultDisplay isLoading={isLoading || isLocating} error={error} prediction={prediction} />
          </div>

          <div className="lg:col-span-3 bg-surface p-6 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-textPrimary mb-4 flex items-center gap-2">
              <ChartIcon className="w-6 h-6" />
              Live Queue Analytics
            </h2>
            <div className="h-80 w-full">
              <AnalyticsChart data={chartData} />
            </div>
             <p className="text-sm text-center text-slate-500 mt-4">
               Live data is simulated for demonstration purposes.
            </p>
          </div>
        </main>
        
        <footer className="text-center mt-12 text-slate-500">
          <p>
            Powered by Gemini API. 
            <a href="https://github.com/google-gemini" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              <GithubIcon className="w-4 h-4" />
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
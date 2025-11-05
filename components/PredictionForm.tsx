import React from 'react';
import { ClockIcon, SearchIcon, LocationIcon } from './Icons';

interface PredictionFormProps {
  canteen: string;
  setCanteen: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  onPredict: () => void;
  isLoading: boolean;
  onUseLocation: () => void;
  isLocating: boolean;
}

const LoadingSpinner: React.FC<{className?: string}> = ({ className="" }) => (
  <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


const PredictionForm: React.FC<PredictionFormProps> = ({ canteen, setCanteen, time, setTime, onPredict, isLoading, onUseLocation, isLocating }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onPredict();
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="canteen" className="block text-sm font-medium text-textSecondary mb-1">
          Canteen Name
        </label>
        <input
          id="canteen"
          type="text"
          value={canteen}
          onChange={(e) => setCanteen(e.target.value)}
          placeholder="e.g., North Spine Plaza"
          className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-textSecondary mb-1">
          Time
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <ClockIcon className="w-5 h-5 text-slate-400" />
          </div>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading || isLocating}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="-ml-1 mr-2 text-white" />
              Predicting...
            </>
          ) : (
            <>
              <SearchIcon className="w-5 h-5" />
              Predict Queue
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onUseLocation}
          disabled={isLoading || isLocating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-200 disabled:bg-slate-400 disabled:text-white disabled:cursor-not-allowed"
        >
          {isLocating ? (
             <LoadingSpinner />
          ) : (
            <>
              <LocationIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;
import React from 'react';
import { Prediction } from '../types';
import { ClockIcon, UsersIcon, InfoIcon } from './Icons';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  prediction: Prediction | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, prediction }) => {
  const getQueueLengthColor = (length: string) => {
    switch (length.toLowerCase()) {
      case 'short': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'long': return 'bg-orange-100 text-orange-800';
      case 'very long': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-slate-50 rounded-lg animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!prediction) {
    return (
        <div className="mt-6 text-center p-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg">
            <p className="text-blue-600">Your prediction result will appear here.</p>
        </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-accent/20 border border-secondary/50 rounded-xl space-y-4 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getQueueLengthColor(prediction.queueLength)}`}>
            <UsersIcon className="w-4 h-4" />
            {prediction.queueLength} Queue
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-800">
            <ClockIcon className="w-4 h-4" />
            ~{prediction.waitTimeMinutes} min wait
        </div>
      </div>
      <div>
        <p className="text-textSecondary text-sm flex items-start gap-2">
            <InfoIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
            <span>{prediction.justification}</span>
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;
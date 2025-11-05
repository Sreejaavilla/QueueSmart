import { GoogleGenAI, Type } from '@google/genai';
import { Prediction, ChartDataPoint } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    queueLength: {
      type: Type.STRING,
      description: "A descriptive queue length, e.g., 'Short', 'Medium', 'Long', 'Very Long'",
    },
    waitTimeMinutes: {
      type: Type.INTEGER,
      description: 'Estimated wait time in minutes, as a whole number.',
    },
    justification: {
      type: Type.STRING,
      description: 'A brief, user-friendly explanation for the prediction.',
    },
  },
  required: ['queueLength', 'waitTimeMinutes', 'justification'],
};

const analyticsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      time: {
        type: Type.STRING,
        description: 'Time in HH:MM format (e.g., "08:00")',
      },
      'North Spine Plaza': {
        type: Type.INTEGER,
        description: 'Number of people in the queue at North Spine Plaza.',
      },
      'The Hive': {
        type: Type.INTEGER,
        description: 'Number of people in the queue at The Hive.',
      },
      'South Spine Canteen': {
        type: Type.INTEGER,
        description: 'Number of people in the queue at South Spine Canteen.',
      },
    },
    required: ['time', 'North Spine Plaza', 'The Hive', 'South Spine Canteen'],
  },
};

export async function predictQueue(canteen: string, time: string): Promise<Prediction> {
  const prompt = `Based on typical crowd patterns for a university campus, predict the queue length and estimated wait time for the "${canteen}" canteen at ${time}. Provide a brief justification. Consider factors like meal times (breakfast, lunch, dinner) and off-peak hours.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: predictionSchema,
    },
  });

  const jsonString = response.text.trim();
  const result = JSON.parse(jsonString);
  return result as Prediction;
}

export async function getAnalyticsData(): Promise<ChartDataPoint[]> {
  const prompt = `Generate realistic mock live queue data for three canteens ("North Spine Plaza", "The Hive", "South Spine Canteen") for the current day. Provide data points for every 2 hours from 8:00 to 20:00. The data for each point should include the time and the number of people in the queue.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: analyticsSchema,
    },
  });
  
  const jsonString = response.text.trim();
  const result = JSON.parse(jsonString);
  return result as ChartDataPoint[];
}

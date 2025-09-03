
'use server';

import { predictBusEta } from '@/ai/flows/ai-powered-eta';
import type { PredictBusEtaInput, PredictBusEtaOutput } from '@/ai/flows/ai-powered-eta';
import { z } from 'zod';
import { routes, initialBuses } from './data';

// This function is a simplified example. In a real application, you would
// have a much more robust way of parsing the user's intent and entities.
function parsePrompt(prompt: string): Omit<PredictBusEtaInput, 'currentTime' | 'historicalData' | 'trafficConditions'> | null {
  const busIdMatch = prompt.match(/bus (B-\d+)/i);
  const stopNameMatch = prompt.match(/(?:at|to|reaches) (.*?)(?:\?|$)/i);

  if (!busIdMatch || !stopNameMatch) {
    return null;
  }

  const busId = busIdMatch[1];
  const stopName = stopNameMatch[1].trim();

  // Find the route and stop IDs based on the parsed names
  let routeId: string | undefined;
  let stopId: string | undefined;

  for (const route of routes) {
    const stop = route.stops.find(s => s.name.toLowerCase() === stopName.toLowerCase());
    if (stop) {
      // Check if the busId from prompt is associated with this route
      const busOnRoute = initialBuses.find(b => b.id.toLowerCase() === busId.toLowerCase() && b.routeId === route.id);
      if (busOnRoute) {
        routeId = route.id;
        stopId = stop.id;
        break;
      }
    }
  }

  if (routeId && stopId && busId) {
    return { routeId, stopId, busId };
  }

  return null;
}


export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: PredictBusEtaOutput;
};

export async function getAIPrediction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const prompt = data.get('prompt') as string;
  if (!prompt) {
    return { message: 'Please enter a prompt.' };
  }

  const parsedInfo = parsePrompt(prompt);

  if (!parsedInfo) {
    return {
      message: "I'm sorry, I couldn't understand your request. Please ask for the ETA of a specific bus at a specific stop.",
    };
  }
  
  try {
    const aiInput: PredictBusEtaInput = {
      ...parsedInfo,
      currentTime: new Date().toISOString(),
      historicalData: 'Normal travel times with occasional 5-10 minute delays during peak hours.',
      trafficConditions: 'Light traffic reported on the main avenues.',
    };

    const result = await predictBusEta(aiInput);

    return {
      message: 'Prediction successful!',
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while predicting the ETA. Please try again.',
    };
  }
}


'use server';

/**
 * @fileOverview A flow to predict bus ETAs more accurately using AI.
 *
 * - predictBusEta - A function that predicts bus ETAs.
 * - PredictBusEtaInput - The input type for the predictBusEta function.
 * - PredictBusEtaOutput - The return type for the predictBusEta function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictBusEtaInputSchema = z.object({
  routeId: z.string().describe('The ID of the bus route.'),
  stopId: z.string().describe('The ID of the bus stop.'),
  busId: z.string().describe('The ID of the bus.'),
  currentTime: z.string().describe('The current time in ISO format.'),
  historicalData: z
    .string()
    .describe(
      'Historical data for the route, including past travel times and delays.'
    ),
  trafficConditions: z
    .string()
    .describe('Real-time traffic conditions along the route.'),
});
export type PredictBusEtaInput = z.infer<typeof PredictBusEtaInputSchema>;

const PredictBusEtaOutputSchema = z.object({
  predictedEta: z
    .number()
    .describe(
      'The predicted ETA in minutes, taking into account historical data and real-time conditions.'
    ),
  confidence: z
    .number()
    .describe('A measure of the confidence in the ETA prediction (0-1).'),
  explanation: z
    .string()
    .describe(
      'A brief explanation of the factors influencing the ETA prediction.'
    ),
});
export type PredictBusEtaOutput = z.infer<typeof PredictBusEtaOutputSchema>;

export async function predictBusEta(input: PredictBusEtaInput): Promise<PredictBusEtaOutput> {
  return predictBusEtaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictBusEtaPrompt',
  input: {schema: PredictBusEtaInputSchema},
  output: {schema: PredictBusEtaOutputSchema},
  prompt: `You are an AI assistant that predicts the Estimated Time of Arrival (ETA) for buses.

  Given the following information, predict the ETA for the bus to arrive at the specified stop.

  Route ID: {{{routeId}}}
  Stop ID: {{{stopId}}}
  Bus ID: {{{busId}}}
  Current Time: {{{currentTime}}}
  Historical Data: {{{historicalData}}}
  Traffic Conditions: {{{trafficConditions}}}

  Consider historical travel times, typical delays, and current traffic to provide the most accurate ETA possible.
  Also provide a confidence score.
  Include a brief explanation of the factors influencing your prediction.

  Format your response as a JSON object conforming to the PredictBusEtaOutputSchema.
  `,
});

const predictBusEtaFlow = ai.defineFlow(
  {
    name: 'predictBusEtaFlow',
    inputSchema: PredictBusEtaInputSchema,
    outputSchema: PredictBusEtaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

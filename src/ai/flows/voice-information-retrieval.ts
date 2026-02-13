'use server';
/**
 * @fileOverview A Genkit flow for handling natural language questions about farm data or general agricultural topics.
 *
 * - voiceInformationRetrieval - A function that processes voice-enabled queries to provide relevant agricultural information.
 * - VoiceInformationRetrievalInput - The input type for the voiceInformationRetrieval function.
 * - VoiceInformationRetrievalOutput - The return type for the voiceInformationRetrieval function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceInformationRetrievalInputSchema = z.object({
  query: z
    .string()
    .describe(
      'The natural language question about farm data or general agricultural topics.'
    ),
});
export type VoiceInformationRetrievalInput = z.infer<
  typeof VoiceInformationRetrievalInputSchema
>;

const VoiceInformationRetrievalOutputSchema = z.object({
  answer: z
    .string()
    .describe(
      'The AI-generated answer to the user\'s question, providing relevant information, recommendations, or contextual details.'
    ),
});
export type VoiceInformationRetrievalOutput = z.infer<
  typeof VoiceInformationRetrievalOutputSchema
>;

export async function voiceInformationRetrieval(
  input: VoiceInformationRetrievalInput
): Promise<VoiceInformationRetrievalOutput> {
  return voiceInformationRetrievalFlow(input);
}

const voiceInformationRetrievalPrompt = ai.definePrompt({
  name: 'voiceInformationRetrievalPrompt',
  input: {schema: VoiceInformationRetrievalInputSchema},
  output: {schema: VoiceInformationRetrievalOutputSchema},
  prompt: `You are an agricultural expert named AgriAssist. Your goal is to provide concise, helpful, and accurate information to farmers based on their questions. This can include general agricultural topics or insights derived from their farm data. If appropriate, you can also offer recommendations or contextual details related to the topic. Your answers should be clear and easy to understand.

Question: {{{query}}}`,
});

const voiceInformationRetrievalFlow = ai.defineFlow(
  {
    name: 'voiceInformationRetrievalFlow',
    inputSchema: VoiceInformationRetrievalInputSchema,
    outputSchema: VoiceInformationRetrievalOutputSchema,
  },
  async (input) => {
    const {output} = await voiceInformationRetrievalPrompt(input);
    return output!;
  }
);

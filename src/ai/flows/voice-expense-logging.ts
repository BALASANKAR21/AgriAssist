'use server';
/**
 * @fileOverview A Genkit flow for logging farming expenses via voice input.
 *
 * - voiceExpenseLogging - A function that processes spoken expense input and extracts structured expense data.
 * - VoiceExpenseLoggingInput - The input type for the voiceExpenseLogging function.
 * - VoiceExpenseLoggingOutput - The return type for the voiceExpenseLogging function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceExpenseLoggingInputSchema = z.object({
  spokenExpense: z.string().describe('The farmer\'s voice input describing an expense.'),
});
export type VoiceExpenseLoggingInput = z.infer<typeof VoiceExpenseLoggingInputSchema>;

const VoiceExpenseLoggingOutputSchema = z.object({
  item: z.string().describe('The specific item or service purchased.'),
  category: z
    .string()
    .describe(
      'The category of the expense. Examples: "Seeds", "Fertilizer", "Labor", "Equipment", "Fuel", "Maintenance", "Pesticides", "Utilities", "Rent", "Insurance", "Other".'
    ),
  amount: z.number().describe('The monetary amount of the expense.'),
  currency:
    z.string().default('USD').describe('The currency of the expense, defaults to USD if not specified.'),
});
export type VoiceExpenseLoggingOutput = z.infer<typeof VoiceExpenseLoggingOutputSchema>;

export async function voiceExpenseLogging(
  input: VoiceExpenseLoggingInput
): Promise<VoiceExpenseLoggingOutput> {
  return voiceExpenseLoggingFlow(input);
}

const voiceExpensePrompt = ai.definePrompt({
  name: 'voiceExpenseLoggingPrompt',
  input: {schema: VoiceExpenseLoggingInputSchema},
  output: {schema: VoiceExpenseLoggingOutputSchema},
  prompt: `You are an AI assistant specialized in agricultural finance. Your task is to parse a farmer's spoken expense description and extract structured information.

Extract the following details from the spoken expense:
- **item**: The specific item or service purchased.
- **category**: Choose the most appropriate category from the following: "Seeds", "Fertilizer", "Labor", "Equipment", "Fuel", "Maintenance", "Pesticides", "Utilities", "Rent", "Insurance", "Other". If a suitable category is not explicitly mentioned, infer the best fit. If it's something general, use "Other".
- **amount**: The numerical monetary value of the expense.
- **currency**: If a currency is specified (e.g., "dollars", "USD", "pesos"), extract it. Otherwise, default to "USD".

Farmer's spoken expense: {{{spokenExpense}}}`,
});

const voiceExpenseLoggingFlow = ai.defineFlow(
  {
    name: 'voiceExpenseLoggingFlow',
    inputSchema: VoiceExpenseLoggingInputSchema,
    outputSchema: VoiceExpenseLoggingOutputSchema,
  },
  async input => {
    const {output} = await voiceExpensePrompt(input);
    if (!output) {
      throw new Error('Failed to parse spoken expense.');
    }
    return output;
  }
);

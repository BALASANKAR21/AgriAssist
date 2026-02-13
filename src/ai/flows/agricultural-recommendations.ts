'use server';
/**
 * @fileOverview An AI tool that provides tailored, actionable agricultural recommendations based on logged expenses.
 *
 * - agriculturalRecommendations - A function that handles the generation of agricultural recommendations.
 * - AgriculturalRecommendationsInput - The input type for the agriculturalRecommendations function.
 * - AgriculturalRecommendationsOutput - The return type for the agriculturalRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpenseItemSchema = z.object({
  category: z.string().describe('The category of the expense (e.g., seeds, fertilizer, labor, equipment, fuel).'),
  amount: z.number().describe('The monetary amount of the expense.'),
  description: z.string().describe('A detailed description of the expense.'),
});

const AgriculturalRecommendationsInputSchema = z.object({
  expenses: z.array(ExpenseItemSchema).describe('A list of farming expenses logged by the farmer.'),
  farmingContext: z.string().optional().describe('Optional contextual information about the farmer\u0027s current farming practices, crop type, or challenges.'),
});
export type AgriculturalRecommendationsInput = z.infer<typeof AgriculturalRecommendationsInputSchema>;

const RecommendationItemSchema = z.object({
  category: z.string().describe('The category of farming practice the recommendation relates to (e.g., crop management, soil health, cost reduction, labor efficiency).'),
  advice: z.string().describe('Actionable advice for the farmer.'),
  potentialImpact: z.string().optional().describe('The potential positive impact or savings from implementing the advice.'),
});

const AgriculturalRecommendationsOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the overall recommendations or insights.'),
  recommendations: z.array(RecommendationItemSchema).describe('A list of tailored, actionable recommendations.'),
  contextualDetails: z.string().optional().describe('Additional helpful, contextual details related to a specific agricultural topic, if the AI deems it relevant and useful.'),
});
export type AgriculturalRecommendationsOutput = z.infer<typeof AgriculturalRecommendationsOutputSchema>;

export async function agriculturalRecommendations(input: AgriculturalRecommendationsInput): Promise<AgriculturalRecommendationsOutput> {
  return agriculturalRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agriculturalRecommendationsPrompt',
  input: {schema: AgriculturalRecommendationsInputSchema},
  output: {schema: AgriculturalRecommendationsOutputSchema},
  prompt: `You are an AI-powered agricultural consultant named AgriAssist, specializing in optimizing farming operations and improving profitability. Your goal is to provide tailored, actionable recommendations to farmers based on their logged expenses and farming context.

Analyze the provided expenses and farming context. Based on this analysis, you will:
1. Provide a concise overall summary of your findings and recommendations.
2. Generate a list of specific, actionable recommendations. Each recommendation should include a category, actionable advice, and a potential impact or savings if applicable.
3. Optionally, if you deem it relevant and helpful, provide extra contextual details related to a specific agricultural topic that could further assist the farmer (e.g., best practices for a certain crop, advanced irrigation techniques, market trends for their produce).

If the expenses are very minimal or lack detail, you should still provide helpful, general advice or prompt the user for more information, and focus more on contextual details.

Expenses:
{{#each expenses}}
- Category: {{{category}}}, Amount: {{{amount}}}, Description: {{{description}}}
{{/each}}

{{#if farmingContext}}
Farming Context: {{{farmingContext}}}
{{/if}}
`,
});

const agriculturalRecommendationsFlow = ai.defineFlow(
  {
    name: 'agriculturalRecommendationsFlow',
    inputSchema: AgriculturalRecommendationsInputSchema,
    outputSchema: AgriculturalRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

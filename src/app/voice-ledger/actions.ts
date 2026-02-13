"use server";

import { voiceExpenseLogging } from "@/ai/flows/voice-expense-logging";
import { agriculturalRecommendations } from "@/ai/flows/agricultural-recommendations";
import type { Expense, AIInsight } from "@/lib/types";

export async function logExpenseFromVoice(spokenExpense: string): Promise<Omit<Expense, 'id' | 'date'>> {
  if (!spokenExpense) {
    throw new Error("Spoken expense cannot be empty.");
  }

  try {
    const result = await voiceExpenseLogging({ spokenExpense });
    return result;
  } catch (error) {
    console.error("Error in voiceExpenseLogging flow:", error);
    throw new Error("AI failed to understand the expense. Please try again.");
  }
}

export async function getAgriculturalInsights(expenses: Expense[]): Promise<AIInsight> {
  if (!expenses || expenses.length === 0) {
    throw new Error("No expenses provided to generate insights.");
  }
  
  try {
    const result = await agriculturalRecommendations({
      expenses: expenses.map(({ item, category, amount }) => ({
        category,
        amount,
        description: item,
      })),
      farmingContext: "Small to medium-sized corn farm in the Midwest."
    });
    return result;
  } catch (error) {
    console.error("Error in agriculturalRecommendations flow:", error);
    throw new Error("AI failed to generate insights. Please try again later.");
  }
}

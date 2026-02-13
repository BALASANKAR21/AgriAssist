"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { Mic, MicOff, Lightbulb, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSpeechRecognition, useTextToSpeech } from "@/hooks/use-speech";
import { useToast } from "@/hooks/use-toast";
import { mockExpenses } from "@/lib/data";
import type { Expense, AIInsight } from "@/lib/types";
import { getAgriculturalInsights, logExpenseFromVoice } from "./actions";
import { format } from "date-fns";

export default function VoiceLedgerPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [isInsightsLoading, startInsightsTransition] = useTransition();
  const [isLoggingLoading, startLoggingTransition] = useTransition();

  const { toast } = useToast();
  const { speak, isSupported: ttsSupported } = useTextToSpeech();
  
  const handleExpenseLogged = (transcript: string) => {
    startLoggingTransition(async () => {
      try {
        const newExpenseData = await logExpenseFromVoice(transcript);
        const newExpense: Expense = {
          ...newExpenseData,
          id: Date.now().toString(),
          date: new Date(),
        };
        setExpenses(prev => [newExpense, ...prev]);
        toast({ title: "Expense Logged", description: `${newExpense.item} for ${newExpense.amount} ${newExpense.currency}` });
        if (ttsSupported) speak(`Expense logged: ${newExpense.item} for ${newExpense.amount} dollars.`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: "destructive", title: "Logging Failed", description: errorMessage });
        if (ttsSupported) speak("Sorry, I couldn't log that. Please try again.");
      }
    });
  };
  
  const { isListening, transcript, startListening, stopListening, error, isSupported: sttSupported } = useSpeechRecognition();

  useEffect(() => {
    if (!isListening && transcript) {
      handleExpenseLogged(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  useEffect(() => {
    if (error) {
      toast({ variant: "destructive", title: "Speech Error", description: error });
    }
  }, [error, toast]);

  const handleFetchInsights = () => {
    startInsightsTransition(async () => {
      try {
        const result = await getAgriculturalInsights(expenses);
        setInsights(result);
        if (ttsSupported) speak("Your AI insights are ready.");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: "destructive", title: "Insights Failed", description: errorMessage });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Voice Expense Ledger</CardTitle>
          <CardDescription>
            Press the microphone to start logging your expenses with your voice. Press it again to stop.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!sttSupported && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertTriangle className="h-5 w-5" />
                <p>Your browser does not support speech recognition. Please use a different browser like Chrome or Safari.</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={!sttSupported || isLoggingLoading}
              size="lg"
              className={isListening ? 'bg-accent text-accent-foreground animate-pulse-mic' : ''}
            >
              {isLoggingLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : isListening ? (
                <MicOff className="mr-2 h-5 w-5" />
              ) : (
                <Mic className="mr-2 h-5 w-5" />
              )}
              {isLoggingLoading ? 'Processing...' : isListening ? 'Stop Listening' : 'Start Listening'}
            </Button>
            <p className="text-sm text-muted-foreground h-10 flex items-center">
                {isListening ? `Listening... Say your expense.` : (transcript ? `Last entry: "${transcript}"` : "Press the button to begin.")}
            </p>
          </div>
          
          <div className="flex justify-between items-center border-t pt-6">
            <h2 className="text-2xl font-headline">Recent Expenses</h2>
            <Sheet>
              <SheetTrigger asChild>
                <Button onClick={handleFetchInsights} disabled={isInsightsLoading} variant="secondary">
                  {isInsightsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                  Get AI Insights
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto" side="right" id="insights">
                <SheetHeader>
                  <SheetTitle className="font-headline text-2xl">AI-Powered Insights</SheetTitle>
                  <SheetDescription>Recommendations based on your recent expenses.</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  {isInsightsLoading && <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}
                  {insights && (
                    <div className="space-y-4">
                      <Card className="bg-primary/5">
                        <CardHeader>
                          <CardTitle className="text-lg">Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{insights.summary}</p>
                        </CardContent>
                      </Card>
                      <Accordion type="single" collapsible className="w-full">
                        {insights.recommendations.map((rec, index) => (
                           <AccordionItem value={`item-${index}`} key={index}>
                              <AccordionTrigger>{rec.category}: {rec.advice.substring(0, 40)}...</AccordionTrigger>
                              <AccordionContent className="space-y-2">
                                <p><strong>Advice:</strong> {rec.advice}</p>
                                {rec.potentialImpact && <p><strong>Potential Impact:</strong> {rec.potentialImpact}</p>}
                              </AccordionContent>
                            </AccordionItem>
                        ))}
                      </Accordion>
                       {insights.contextualDetails && (
                        <Card className="bg-secondary/10">
                            <CardHeader>
                                <CardTitle className="text-lg">Contextual Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{insights.contextualDetails}</p>
                            </CardContent>
                        </Card>
                       )}
                    </div>
                  )}
                  {!insights && !isInsightsLoading && <p className="text-center text-muted-foreground py-10">Click "Get AI Insights" to see recommendations.</p>}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No expenses logged yet.</TableCell>
                  </TableRow>
                ) : (
                  expenses.map(exp => (
                    <TableRow key={exp.id}>
                      <TableCell>{format(exp.date, "MMM d, yyyy")}</TableCell>
                      <TableCell className="font-medium">{exp.item}</TableCell>
                      <TableCell>{exp.category}</TableCell>
                      <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: exp.currency }).format(exp.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

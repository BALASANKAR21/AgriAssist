"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { Mic, MicOff, Loader2, AlertTriangle, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSpeechRecognition, useTextToSpeech } from "@/hooks/use-speech";
import { useToast } from "@/hooks/use-toast";
import { mockExpenses } from "@/lib/data";
import type { Expense } from "@/lib/types";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const mockLogExpenseFromVoice = async (spokenExpense: string): Promise<Omit<Expense, 'id' | 'date'>> => {
  // Mock AI parsing
  const amountMatch = spokenExpense.match(/(\d+)/);
  const amount = amountMatch ? parseFloat(amountMatch[0]) : 500; // default
  let item = "Unknown";
  if (spokenExpense.includes("seed") || spokenExpense.includes("बीज")) item = "Seeds";
  else if (spokenExpense.includes("fertilizer") || spokenExpense.includes("उर्वरक")) item = "Fertilizer";
  else if (spokenExpense.includes("fuel") || spokenExpense.includes("ईंधन")) item = "Fuel";
  else if (spokenExpense.includes("pesticide") || spokenExpense.includes("कीटनाशक")) item = "Pesticides";
  else if (spokenExpense.includes("labor") || spokenExpense.includes("मजदूरी")) item = "Labor";


  return Promise.resolve({
    item: item,
    category: item,
    amount: amount,
    currency: "INR",
  });
}

export default function VoiceLedgerPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isLoggingLoading, startLoggingTransition] = useTransition();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { speak, isSupported: ttsSupported } = useTextToSpeech();
  
  const handleExpenseLogged = (transcript: string) => {
    startLoggingTransition(async () => {
      try {
        const newExpenseData = await mockLogExpenseFromVoice(transcript);
        const newExpense: Expense = {
          ...newExpenseData,
          id: Date.now().toString(),
          date: new Date(),
        };
        setExpenses(prev => [newExpense, ...prev]);
        const formattedAmount = currencyFormat(newExpense.amount);
        toast({ title: t("expense_logged"), description: t("expense_logged_desc", { item: newExpense.item, amount: formattedAmount }) });
        if (ttsSupported) speak(t("expense_logged_speak", { item: newExpense.item, amount: newExpense.amount }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: "destructive", title: t("logging_failed"), description: errorMessage });
        if (ttsSupported) speak(t("logging_failed_speak"));
      }
    });
  };
  
  const { isListening, transcript, startListening, stopListening, error, isSupported: sttSupported } = useSpeechRecognition({lang: i18n.language});

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isListening && transcript) {
      handleExpenseLogged(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  useEffect(() => {
    if (error) {
      toast({ variant: "destructive", title: t("assistant_error_title"), description: error });
    }
  }, [error, toast, t]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, exp) => total + exp.amount, 0);
  }, [expenses]);
  
  const mockRevenue = totalExpenses * 2.5;
  const totalProfit = mockRevenue - totalExpenses;

  const currencyFormat = (value: number) => new Intl.NumberFormat(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3"><Wallet/> {t('voice_ledger_title')}</CardTitle>
          <CardDescription className="text-lg">
            {t('voice_ledger_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          {isClient && !sttSupported && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertTriangle className="h-5 w-5" />
                <p>{t('log_expense_browser_unsupported')}</p>
            </div>
          )}
          <div className="flex flex-col items-center gap-4 my-8">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={!isClient || !sttSupported || isLoggingLoading}
              aria-label={isListening ? t('stop_listening') : t('start_listening')}
              className={cn(
                "h-48 w-48 rounded-full text-5xl transition-all duration-300 shadow-2xl flex flex-col",
                isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'
              )}
            >
              {isLoggingLoading ? (
                <Loader2 className="h-16 w-16 animate-spin" />
              ) : isListening ? (
                <MicOff size={80} />
              ) : (
                <Mic size={80} />
              )}
            </Button>
             <p className="text-lg text-muted-foreground h-10 flex items-center text-center mt-4">
                {isLoggingLoading ? t('processing') : isListening ? t('assistant_listening') : (transcript ? t('last_entry', {transcript}) : t('press_to_begin'))}
            </p>
          </div>
          
           <Card className="bg-green-500/10 border-green-200 dark:bg-green-900/20 dark:border-green-700 w-full">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3"><TrendingUp className="text-primary"/> {t('financial_summary')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="flex flex-col md:flex-row justify-around items-center gap-4">
                        <div className="p-4 rounded-lg">
                            <p className="text-3xl md:text-4xl font-bold text-destructive">
                                -{currencyFormat(totalExpenses)}
                            </p>
                            <p className="text-muted-foreground">{t('total_expenses')}</p>
                        </div>
                        <div className="p-4 rounded-lg">
                            <p className="text-3xl md:text-4xl font-bold text-primary">
                                {currencyFormat(totalProfit)}
                            </p>
                            <p className="text-muted-foreground">{t('total_profit_mock')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
          
          <div className="border-t pt-6 w-full">
            <h2 className="text-2xl font-bold">{t('recent_expenses')}</h2>
          </div>
          
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base">{t('date')}</TableHead>
                  <TableHead className="text-base">{t('item')}</TableHead>
                  <TableHead className="text-base">{t('category')}</TableHead>
                  <TableHead className="text-right text-base">{t('amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">{t('no_expenses_logged')}</TableCell>
                  </TableRow>
                ) : (
                  expenses.map(exp => (
                    <TableRow key={exp.id} className="text-lg">
                      <TableCell>{format(exp.date, "MMM d, yyyy")}</TableCell>
                      <TableCell className="font-medium">{exp.item}</TableCell>
                      <TableCell>{exp.category}</TableCell>
                      <TableCell className="text-right">{currencyFormat(exp.amount)}</TableCell>
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

"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { mockExpenses } from "@/lib/data";
import { CircleDollarSign, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const profitSchema = z.object({
  expectedYield: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive("Expected yield must be a positive number.")),
  marketPrice: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive("Market price must be a positive number.")),
});

export default function ProfitPredictionPage() {
  const [profit, setProfit] = useState<number | null>(null);
  const { t, i18n } = useTranslation();

  const form = useForm<z.infer<typeof profitSchema>>({
    resolver: zodResolver(profitSchema),
    defaultValues: {
      expectedYield: 10,
      marketPrice: 2500, // Updated for Indian context (e.g., price per Quintal)
    },
  });

  const totalExpenses = useMemo(() => {
    return mockExpenses.reduce((total, exp) => total + exp.amount, 0);
  }, []);

  const currencyFormat = (value: number) => new Intl.NumberFormat(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

  function onSubmit(data: z.infer<typeof profitSchema>) {
    const revenue = data.expectedYield * data.marketPrice;
    const calculatedProfit = revenue - totalExpenses;
    setProfit(calculatedProfit);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3"><CircleDollarSign /> {t('profit_prediction_title')}</CardTitle>
          <CardDescription className="text-lg">{t('profit_prediction_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="expectedYield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('expected_yield')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} className="h-12 text-lg"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('expected_market_price')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2500" {...field} className="h-12 text-lg"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-14 text-xl btn-48">{t('calculate_profit')}</Button>
            </form>
          </Form>

          {profit !== null && (
            <Card className="mt-8 bg-green-500/10 border-green-200 dark:bg-green-900/20 dark:border-green-700">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3"><TrendingUp className="text-primary"/> {t('estimated_profit')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-5xl font-bold text-primary">
                        {currencyFormat(profit)}
                    </p>
                    <p className="text-muted-foreground">{t('based_on_inputs')}</p>
                    <Card className="bg-background/50 max-w-md mx-auto">
                      <CardContent className="p-4 flex justify-between items-center text-lg">
                          <span className="text-muted-foreground">{t('your_expenses')}</span>
                          <span className="font-bold text-destructive">-{currencyFormat(totalExpenses)}</span>
                      </CardContent>
                    </Card>
                     <Button variant="secondary" onClick={() => { setProfit(null); form.reset(); }} className="mt-4">
                        {t('calculate_again')}
                    </Button>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

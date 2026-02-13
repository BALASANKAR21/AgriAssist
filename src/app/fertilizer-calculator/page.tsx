"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCropData } from "@/lib/data";
import { Leaf, BaggageClaim } from "lucide-react";

const calculatorSchema = z.object({
  cropId: z.string().min(1, "Please select a crop."),
  acreage: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive("Acreage must be a positive number.")),
});

// Mock recommendation logic
const getFertilizerRecommendation = (cropId: string, acreage: number) => {
    const bagsOfUrea = cropId === 'c2' ? 2 * acreage : 1.5 * acreage; // Rice needs more
    const bagsOfDAP = cropId === 'c1' ? 1 * acreage : 0.8 * acreage; // Wheat needs more
    return { urea: bagsOfUrea.toFixed(1), dap: bagsOfDAP.toFixed(1) };
}

export default function FertilizerCalculatorPage() {
  const [recommendation, setRecommendation] = useState<{ urea: string; dap: string } | null>(null);

  const form = useForm<z.infer<typeof calculatorSchema>>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      acreage: 1,
    },
  });

  function onSubmit(data: z.infer<typeof calculatorSchema>) {
    const result = getFertilizerRecommendation(data.cropId, data.acreage);
    setRecommendation(result);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3"><BaggageClaim /> Fertilizer Calculator</CardTitle>
          <CardDescription>Calculate the required fertilizer for your crops.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="cropId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Crop</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-lg">
                          <SelectValue placeholder="Choose a crop..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCropData.map(crop => (
                          <SelectItem key={crop.id} value={crop.id}>{crop.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acreage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Land Size (in acres)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5.5" {...field} className="h-12 text-lg"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-14 text-xl btn-48">Calculate</Button>
            </form>
          </Form>

          {recommendation && (
            <Card className="mt-8 bg-green-50 border-green-200">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3"><Leaf className="text-primary"/> Recommendation</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="flex justify-around">
                        <div>
                            <p className="text-4xl font-bold text-primary">{recommendation.urea}</p>
                            <p className="text-muted-foreground">Bags of Urea</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary">{recommendation.dap}</p>
                            <p className="text-muted-foreground">Bags of DAP</p>
                        </div>
                    </div>
                     <Button variant="secondary" onClick={() => { setRecommendation(null); form.reset(); }} className="mt-4">
                        Calculate Again
                    </Button>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

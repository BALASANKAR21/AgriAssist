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
import { Progress } from "@/components/ui/progress";
import { Leaf, Droplets, MapPin, CheckCircle2 } from "lucide-react";

const recommenderSchema = z.object({
  soilType: z.enum(["Loam", "Clay", "Sandy", "Silt"]),
  landSize: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive("Land size must be a positive number.")),
  region: z.enum(["North", "South", "East", "West", "Central"]),
});

const steps = [
  { id: 1, title: "Soil Type", icon: Leaf },
  { id: 2, title: "Land Size", icon: Droplets },
  { id: 3, title: "Region", icon: MapPin },
];

const mockRecommendations = {
  North: ["Wheat", "Mustard", "Sugarcane"],
  South: ["Rice", "Coconut", "Spices"],
  East: ["Jute", "Rice", "Tea"],
  West: ["Cotton", "Groundnut", "Sorghum"],
  Central: ["Soybean", "Wheat", "Gram"],
};

export default function CropRecommenderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);

  const form = useForm<z.infer<typeof recommenderSchema>>({
    resolver: zodResolver(recommenderSchema),
    defaultValues: {
      landSize: 1,
    },
  });

  const progress = ((currentStep + 1) / (steps.length + (recommendations ? 1 : 0))) * 100;

  async function onSubmit(data: z.infer<typeof recommenderSchema>) {
    // In a real app, this would be an API call to a recommendation engine
    setRecommendations(mockRecommendations[data.region] || ["No recommendations for this region."]);
    setCurrentStep(steps.length);
  }

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 0) isValid = await form.trigger("soilType");
    if (currentStep === 1) isValid = await form.trigger("landSize");
    if (currentStep === 2) isValid = await form.trigger("region");

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else if (isValid && currentStep === steps.length - 1) {
      form.handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    if (recommendations) {
      setRecommendations(null);
    }
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Crop Recommender</CardTitle>
          <CardDescription>Get suggestions for the best crops to plant.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-8" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.id} className={currentStep === index ? "block" : "hidden"}>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <step.icon className="w-6 h-6 text-primary" />
                    {step.title}
                  </h3>
                  {step.id === 1 && (
                     <FormField
                      control={form.control}
                      name="soilType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What is the primary soil type of your farm?</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select soil type" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Loam">Loam</SelectItem>
                              <SelectItem value="Clay">Clay</SelectItem>
                              <SelectItem value="Sandy">Sandy</SelectItem>
                              <SelectItem value="Silt">Silt</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                   {step.id === 2 && (
                     <FormField
                      control={form.control}
                      name="landSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What is the size of your land in acres?</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 5.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {step.id === 3 && (
                     <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Which region is your farm located in?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="North">North</SelectItem>
                              <SelectItem value="South">South</SelectItem>
                              <SelectItem value="East">East</SelectItem>
                              <SelectItem value="West">West</SelectItem>
                              <SelectItem value="Central">Central</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              ))}

              {recommendations && (
                <div>
                   <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    Recommended Crops
                  </h3>
                  <Card className="bg-primary/5">
                    <CardContent className="p-6">
                        <ul className="list-disc list-inside space-y-2 text-lg">
                            {recommendations.map(crop => <li key={crop}>{crop}</li>)}
                        </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                  Back
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>Next</Button>
                ) : !recommendations ? (
                  <Button type="submit">Get Recommendations</Button>
                ) : (
                  <Button type="button" onClick={() => { setCurrentStep(0); setRecommendations(null); form.reset(); }}>Start Over</Button>
                )}
              </div>
            </form>
          </Form
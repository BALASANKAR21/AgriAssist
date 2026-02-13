"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PestMap } from "./map-component";
import { mockPestAlerts } from "@/lib/data";
import type { PestAlert } from "@/lib/types";
import { PlusCircle, Loader2 } from "lucide-react";

const reportSchema = z.object({
  pestName: z.string().min(3, "Pest name is required."),
  description: z.string().min(10, "Please provide a brief description."),
  severity: z.enum(["Low", "Medium", "High"]),
  // In a real app, you'd get lat/lng from map click or user's location
  lat: z.preprocess(val => Number(val), z.number().min(-90).max(90)),
  lng: z.preprocess(val => Number(val), z.number().min(-180).max(180)),
});

export default function CommunityPestAlertPage() {
  const [alerts, setAlerts] = useState<PestAlert[]>(mockPestAlerts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      pestName: "",
      description: "",
      severity: "Medium",
      lat: 34.0522, // Default to a location
      lng: -118.2437,
    },
  });

  function onSubmit(values: z.infer<typeof reportSchema>) {
    startTransition(() => {
      // Mocking an async action
      setTimeout(() => {
        const newAlert: PestAlert = {
          id: `pa-${Date.now()}`,
          pestName: values.pestName,
          description: values.description,
          severity: values.severity,
          location: { lat: values.lat, lng: values.lng },
          reportedAt: new Date(),
        };
        setAlerts(prev => [newAlert, ...prev]);
        toast({ title: "Pest Alert Reported!", description: `Thank you for reporting ${values.pestName}.` });
        setIsDialogOpen(false);
        form.reset();
      }, 1000);
    });
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-3xl">Community Pest Alerts</CardTitle>
            <CardDescription>See and report pest sightings in your community.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Report a Pest
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Report a Pest Sighting</DialogTitle>
                <DialogDescription>
                  Help your neighbors by reporting pest activity. Fill out the details below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="pestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pest Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Corn Earworm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe what you saw, location, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Hidden fields for location - would be set by map interaction in a full app */}
                  <FormField control={form.control} name="lat" render={({ field }) => <Input type="hidden" {...field} />} />
                  <FormField control={form.control} name="lng" render={({ field }) => <Input type="hidden" {...field} />} />
                  <DialogFooter>
                    <Button type="submit" disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Report
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <PestMap alerts={alerts} />
        </CardContent>
      </Card>
    </div>
  );
}
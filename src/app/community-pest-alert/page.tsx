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
import { PlusCircle, Loader2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      pestName: "",
      description: "",
      severity: "Medium",
      lat: 28.6139, // Default to a location
      lng: 77.2090,
    },
  });
  
  // A real app would get this from navigator.geolocation
  const getCurrentLocation = () => {
    toast({ title: t("fetching_location"), description: "This is a mock-up." });
    form.setValue('lat', 28.6139 + (Math.random() - 0.5) * 0.1);
    form.setValue('lng', 77.2090 + (Math.random() - 0.5) * 0.1);
  }

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
        toast({ title: t("pest_report_success"), description: t("pest_report_success_desc", { pestName: values.pestName }) });
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
            <CardTitle className="text-3xl font-bold flex items-center gap-3"><MapPin /> {t('pest_alert_title')}</CardTitle>
            <CardDescription>{t('pest_alert_description')}</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 text-lg btn-48">
                <PlusCircle className="mr-2 h-5 w-5" /> {t('report_pest')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl">{t('report_pest_sighting')}</DialogTitle>
                <DialogDescription>
                  {t('report_pest_help')}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <Button type="button" variant="outline" onClick={getCurrentLocation} className="w-full">
                        <MapPin className="mr-2 h-4 w-4" /> {t('use_my_location')}
                    </Button>
                  <FormField
                    control={form.control}
                    name="pestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('pest_name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('pest_name_placeholder')} {...field} className="h-12"/>
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
                        <FormLabel>{t('severity')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder={t('select_severity')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">{t('low')}</SelectItem>
                            <SelectItem value="Medium">{t('medium')}</SelectItem>
                            <SelectItem value="High">{t('high')}</SelectItem>
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
                        <FormLabel>{t('description')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('description_placeholder_pest')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isPending} className="h-12 text-lg btn-48">
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('submit_report')}
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

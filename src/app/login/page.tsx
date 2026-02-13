"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import i18n from "@/lib/i18n";

const loginSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid 10-digit phone number."),
  language: z.enum(["en", "hi", "ta", "te", "kn", "ml", "bn", "mr"]),
});

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      language: (i18n.language as "en" | "hi" | "ta" | "te" | "kn" | "ml" | "bn" | "mr") || "en",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    i18n.changeLanguage(values.language);
    // Mock login logic - in a real app, you would send an OTP
    router.push("/");
  }

  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <Sprout className="h-16 w-16 text-primary mx-auto" />
          <CardTitle className="text-3xl font-bold">{t('login_title')}</CardTitle>
          <CardDescription className="text-lg">{t('login_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('phone_number')}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="98765 43210" {...field} className="h-14 text-lg"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('language')}</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      i18n.changeLanguage(value);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 text-lg">
                          <SelectValue placeholder={t('select_language')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                        <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                        <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                        <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                        <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-14 text-xl btn-48" aria-label={t('submit')}>
                {t('submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

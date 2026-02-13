"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mockGovSchemes } from "@/lib/data";
import { BookCopy, Search, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTextToSpeech } from "@/hooks/use-speech";
import { useTranslation } from "react-i18next";

export default function GovernmentSchemesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { speak, isSupported, isSpeaking } = useTextToSpeech();
  const { t } = useTranslation();

  const filteredSchemes = mockGovSchemes.filter(scheme =>
    t(scheme.title as any).toLowerCase().includes(searchTerm.toLowerCase()) ||
    t(scheme.description as any).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3"><BookCopy/> {t('schemes_title')}</CardTitle>
          <CardDescription>{t('schemes_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search_schemes_placeholder')}
              className="h-12 pl-10 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredSchemes.map(scheme => (
              <AccordionItem value={scheme.id} key={scheme.id} className="border-b-0">
                <Card className="overflow-hidden">
                    <AccordionTrigger className="p-6 text-xl hover:no-underline text-left">
                        {t(scheme.title as any)}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-4">
                        <p className="text-lg text-muted-foreground">{t(scheme.description as any)}</p>
                        <div>
                            <h4 className="font-semibold text-lg mb-2">{t('how_to_apply')}</h4>
                            <p className="text-lg">{t(scheme.howToApply as any)}</p>
                        </div>
                        {isSupported && (
                             <Button 
                                variant="secondary" 
                                onClick={() => speak(`${t(scheme.title as any)}. ${t(scheme.description as any)}. ${t('how_to_apply')}. ${t(scheme.howToApply as any)}`)}
                                disabled={isSpeaking}
                                aria-label={t('read_details_for_scheme', { schemeTitle: t(scheme.title as any) })}
                             >
                                <Volume2 className="mr-2 h-5 w-5"/>
                                {t('read_aloud')}
                            </Button>
                        )}
                    </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredSchemes.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-lg">{t('no_schemes_found')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

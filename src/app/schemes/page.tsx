"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mockGovSchemes } from "@/lib/data";
import { BookCopy, Search, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTextToSpeech } from "@/hooks/use-speech";

export default function GovernmentSchemesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { speak, isSupported, isSpeaking } = useTextToSpeech();

  const filteredSchemes = mockGovSchemes.filter(scheme =>
    scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-3"><BookCopy/> Government Schemes</CardTitle>
          <CardDescription>Find and learn about beneficial government schemes for farmers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for schemes (e.g., 'insurance', 'soil')"
              className="h-12 pl-10 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredSchemes.map(scheme => (
              <AccordionItem value={scheme.id} key={scheme.id} className="border-b-0">
                <Card className="overflow-hidden">
                    <AccordionTrigger className="p-6 text-xl hover:no-underline">
                        {scheme.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-4">
                        <p className="text-lg text-muted-foreground">{scheme.description}</p>
                        <div>
                            <h4 className="font-semibold text-lg mb-2">How to Apply</h4>
                            <p className="text-lg">{scheme.howToApply}</p>
                        </div>
                        {isSupported && (
                             <Button 
                                variant="secondary" 
                                onClick={() => speak(`${scheme.title}. ${scheme.description}. How to Apply. ${scheme.howToApply}`)}
                                disabled={isSpeaking}
                                aria-label={`Read details for ${scheme.title}`}
                             >
                                <Volume2 className="mr-2 h-5 w-5"/>
                                Read Aloud
                            </Button>
                        )}
                    </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredSchemes.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-lg">No schemes found matching your search.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

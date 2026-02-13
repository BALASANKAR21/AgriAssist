import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Thermometer, Wheat, ScanLine, Bot, Wallet, Mic, MapPin, LandPlot, BaggageClaim, BookCopy, TrendingUp, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickActions = [
  {
    href: '/disease-detection',
    icon: ScanLine,
    title: 'scan_crop',
    description: 'scan_crop_desc',
    className: 'bg-blue-500/10 text-blue-800 dark:text-blue-300',
  },
  {
    href: '/voice-ledger',
    icon: Wallet,
    title: 'my_expenses',
    description: 'my_expenses_desc',
    className: 'bg-yellow-500/10 text-yellow-800 dark:text-yellow-300',
  },
  {
    href: '/community-pest-alert',
    icon: MapPin,
    title: 'pestAlerts',
    description: 'pest_alerts_desc',
    className: 'bg-red-500/10 text-red-800 dark:text-red-300',
  },
];

const tools = [
  { href: "/crop-recommender", icon: LandPlot, title: "cropRecommender" },
  { href: "/fertilizer-calculator", icon: BaggageClaim, title: "fertilizerCalculator" },
  { href: "/market-analysis", icon: TrendingUp, title: "marketAnalysis" },
  { href: "/schemes", icon: BookCopy, title: "govSchemes" },
  { href: "/profit-prediction", icon: CircleDollarSign, title: "profitPrediction" },
];

import { useTranslation } from "react-i18next";

export default function Home() {
  // Since this is a server component, we can't use the hook directly.
  // For full i18n in RSC, a library like 'next-international' would be needed.
  // For this project, we'll keep main pages as client components to use the i18n hook.
  // Or we pass the t function down from a client parent.
  // For simplicity, we will make this a client component.
  // Oh wait, I can't convert it here. I'll make a new component.
  return <HomePageClient />;
}

function HomePageClient() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">{t('welcome_to_agri')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          {t('tagline')}
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Voice Assistant Card */}
        <Card className="md:col-span-2 lg:col-span-3 group relative overflow-hidden h-full flex flex-col justify-between p-6 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-primary to-green-700 text-primary-foreground">
             <Link href="/assistant" className="absolute inset-0 z-10" aria-label={t('voice_assistant_cta')}/>
            <div>
              <CardHeader className="p-0">
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  <Mic className="w-10 h-10 p-2 bg-primary-foreground/20 rounded-full" />
                  {t('voice_command_center')}
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-primary-foreground/80 text-lg mt-2">
                {t('voice_command_desc')}
              </CardDescription>
            </div>
            <div className="mt-6 text-right font-mono text-sm opacity-70 z-0">
              {t('voice_command_example')}
            </div>
        </Card>

        {/* Bento Grid */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Thermometer/> {t('weather')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-5xl font-bold">32°C</p>
                    <p className="text-muted-foreground">{t('sunny')}</p>
                </div>
                <Button variant="secondary" size="lg" className="btn-48">{t('play_audio')}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wheat/> {t('market_ticker')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex overflow-x-hidden">
                <p className="whitespace-nowrap animate-marquee">
                    <span className="mx-4">{t('market_ticker_tomato')}</span>
                    <span className="mx-4">{t('market_ticker_onion')}</span>
                    <span className="mx-4">{t('market_ticker_potato')}</span>
                    <span className="mx-4">{t('market_ticker_wheat')}</span>
                </p>
                 <p className="absolute top-0 whitespace-nowrap animate-marquee2">
                    <span className="mx-4">{t('market_ticker_tomato')}</span>
                    <span className="mx-4">{t('market_ticker_onion')}</span>
                    <span className="mx-4">{t('market_ticker_potato')}</span>
                    <span className="mx-4">{t('market_ticker_wheat')}</span>
                </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Action Cards */}
        {quickActions.map((feature) => (
          <Card key={feature.title} className={`group relative overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${feature.className}`}>
            <Link href={feature.href} className="absolute inset-0 z-10" aria-label={t(feature.title)}/>
            <CardHeader className="flex-1 p-5">
              <feature.icon className="w-10 h-10 mb-2" />
              <CardTitle className="text-xl font-bold">
                {t(feature.title)}
              </CardTitle>
              <CardDescription className="text-base text-current/80">
                {t(feature.description)}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

       <Card>
          <CardHeader>
            <CardTitle>{t('all_tools')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map(tool => (
               <Link href={tool.href} key={tool.href} className="flex flex-col items-center justify-center p-4 rounded-lg bg-background hover:bg-muted/80 text-center transition-colors">
                  <tool.icon className="w-10 h-10 mb-2 text-primary"/>
                  <span className="font-semibold text-sm">{t(tool.title)}</span>
               </Link>
            ))}
          </CardContent>
       </Card>
    </div>
  );
}

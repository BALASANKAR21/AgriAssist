import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Mic, MapPin, BookText } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/data';

const features = [
  {
    href: '/voice-ledger',
    icon: BookText,
    title: 'Voice Ledger',
    description: 'Track your expenses using just your voice.',
    image: placeholderImages.find(p => p.id === 'voice-ledger'),
    bgColor: 'bg-green-100',
    textColor: 'text-green-900',
  },
  {
    href: '/community-pest-alert',
    icon: MapPin,
    title: 'Pest Alerts',
    description: 'See and report pest activity in your area.',
    image: placeholderImages.find(p => p.id === 'pest-alert'),
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-900',
  },
  {
    href: '/voice-ledger#insights',
    icon: Lightbulb,
    title: 'AI Insights',
    description: 'Get smart recommendations based on your data.',
    image: placeholderImages.find(p => p.id === 'ai-insights'),
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-900',
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">Welcome to AgriAssist</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Your AI-powered assistant for smarter, more efficient farming. Use your voice to manage your farm.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Main Voice Command Card */}
        <Link href="/voice-ledger" className="lg:col-span-3">
          <Card className="group relative overflow-hidden h-full flex flex-col justify-between p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-primary to-green-700 text-primary-foreground">
            <div>
              <CardHeader className="p-0">
                <CardTitle className="font-headline text-3xl font-bold flex items-center gap-3">
                  <Mic className="w-10 h-10 p-2 bg-primary-foreground/20 rounded-full" />
                  Voice Command Center
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-primary-foreground/80 text-lg mt-2">
                Tap here to start logging expenses, ask questions, or navigate the app with your voice.
              </CardDescription>
            </div>
            <div className="mt-6 text-right font-mono text-sm opacity-70">
              Try: "Log 50 dollars for seeds"
            </div>
          </Card>
        </Link>
        
        {/* Feature Cards */}
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title}>
            <Card className="group relative overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {feature.image && (
                 <div className="relative h-48 w-full">
                    <Image
                      src={feature.image.imageUrl}
                      alt={feature.image.description}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={feature.image.imageHint}
                    />
                 </div>
              )}
              <CardHeader className="flex-1">
                <CardTitle className="font-headline text-2xl font-bold flex items-center gap-3">
                  <feature.icon className="w-6 h-6 text-primary" />
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import { mockMarketPrices } from "@/lib/data";
import { TrendingUp, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

const sellHoldAdvice = {
    "sell": {
        title: "Recommendation: Sell",
        reason: "Prices are currently high and have shown strong upward momentum over the past week. It's a good time to lock in profits.",
        className: "bg-green-50 border-green-200 text-green-900",
    },
    "hold": {
        title: "Recommendation: Hold",
        reason: "Prices have been stagnant or declining. It might be better to wait for a potential market recovery before selling.",
        className: "bg-orange-50 border-orange-200 text-orange-900",
    }
}

// Simple logic to decide whether to sell or hold
const currentAdvice = mockMarketPrices[mockMarketPrices.length - 1].price > mockMarketPrices[0].price ? sellHoldAdvice.sell : sellHoldAdvice.hold;

export default function MarketAnalysisPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp /> Market Price Trends (Tomato)
            </CardTitle>
            <CardDescription>Price per Quintal over the last 10 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockMarketPrices}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#388E3C" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={currentAdvice.className}>
           <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
                <Scale /> {currentAdvice.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{currentAdvice.reason}</p>
            <div className="mt-4 flex gap-4">
                <Button className="h-12 text-lg bg-primary">Sell Now</Button>
                <Button variant="secondary" className="h-12 text-lg">Set Price Alert</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

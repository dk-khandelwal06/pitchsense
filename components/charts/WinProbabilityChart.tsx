"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

interface DeliveryChartData {
  ball_index: number;
  display_over: string;
  batter: string;
  bowler: string;
  total_runs: number;
  is_wicket: boolean;
  event: string;
  chasing_win_probability: number;
  defending_win_probability: number;
}

interface WinProbabilityChartProps {
  data: DeliveryChartData[];
  currentIndex?: number;
  chasingTeam: string;
  defendingTeam: string;
  onSelectDelivery?: (index: number) => void;
}

export function WinProbabilityChart({
  data,
  currentIndex = 0,
  chasingTeam,
  defendingTeam,
  onSelectDelivery,
}: WinProbabilityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-pitch-muted text-sm border border-dashed border-pitch-border rounded-xl">
        No delivery probability data available.
      </div>
    );
  }

  // Format data for Recharts (convert probabilities to 0-100%)
  const chartData = data.map((d) => ({
    ...d,
    chasingPercent: Math.round(d.chasing_win_probability * 1000) / 10,
    defendingPercent: Math.round(d.defending_win_probability * 1000) / 10,
  }));

  const currentOver = data[currentIndex]?.display_over || "";

  return (
    <div className="w-full bg-pitch-secondary/60 rounded-2xl p-4 border border-pitch-border shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-2 border-b border-pitch-border/50 gap-2">
        <div>
          <h3 className="font-semibold text-pitch-ivory text-sm sm:text-base flex items-center space-x-2">
            <span>Win Probability Engine</span>
            <span className="text-xs bg-pitch-forest text-pitch-lime px-2 py-0.5 rounded border border-pitch-border">
              Logistic Regression
            </span>
          </h3>
          <p className="text-xs text-pitch-muted">
            Ball-by-ball probability evolution across Innings 2
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-pitch-lime inline-block" />
            <span className="text-pitch-ivory">{chasingTeam} (Chasing)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-pitch-orange inline-block" />
            <span className="text-pitch-muted">{defendingTeam} (Defending)</span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            onClick={(e) => {
              if (e && e.activeTooltipIndex !== undefined && onSelectDelivery) {
                onSelectDelivery(e.activeTooltipIndex);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2F5F50" opacity={0.4} />
            <XAxis
              dataKey="display_over"
              stroke="#A3C2B4"
              fontSize={11}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={25}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#A3C2B4"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip chasingTeam={chasingTeam} defendingTeam={defendingTeam} />} />
            <ReferenceLine y={50} stroke="#E69B53" strokeDasharray="4 4" opacity={0.6} />
            {currentOver && (
              <ReferenceLine
                x={currentOver}
                stroke="#C5ED68"
                strokeWidth={2}
                label={{
                  value: "Current",
                  position: "top",
                  fill: "#C5ED68",
                  fontSize: 10,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="chasingPercent"
              stroke="#C5ED68"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: "#C5ED68", stroke: "#183D32", strokeWidth: 2 }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-pitch-muted mt-2 pt-2 border-t border-pitch-border/30">
        <span>Click anywhere along the curve to scrub deliveries</span>
        <span className="font-mono">Trained on 138K IPL deliveries (Cricsheet)</span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, chasingTeam, defendingTeam }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-pitch-charcoal/95 text-pitch-ivory p-3 rounded-lg border border-pitch-border shadow-xl text-xs space-y-1.5 backdrop-blur-sm min-w-[190px]">
        <div className="font-bold flex items-center justify-between border-b border-pitch-border/50 pb-1">
          <span>Over {data.display_over}</span>
          <span className="font-mono text-pitch-lime font-bold">{data.chasingPercent}% Win</span>
        </div>
        <div className="text-pitch-muted">
          <div>Bowler: <span className="text-pitch-ivory font-medium">{data.bowler}</span></div>
          <div>Batter: <span className="text-pitch-ivory font-medium">{data.batter}</span></div>
          <div>Outcome: <span className="text-pitch-lime font-bold">{data.is_wicket ? `WICKET (${data.wicket_kind})` : `${data.total_runs} runs`}</span></div>
        </div>
        <div className="pt-1 border-t border-pitch-border/50 text-[11px] flex justify-between font-mono">
          <span className="text-pitch-lime">{chasingTeam}: {data.chasingPercent}%</span>
          <span className="text-pitch-orange">{defendingTeam}: {data.defendingPercent}%</span>
        </div>
      </div>
    );
  }
  return null;
}


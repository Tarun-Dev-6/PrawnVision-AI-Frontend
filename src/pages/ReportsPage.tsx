import { TrendingUp, BarChart3, PieChart, Download, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";

const weeklyData = [
  { day: "Mon", count: 15000 },
  { day: "Tue", count: 22000 },
  { day: "Wed", count: 18500 },
  { day: "Thu", count: 28000 },
  { day: "Fri", count: 25000 },
  { day: "Sat", count: 12000 },
  { day: "Sun", count: 8000 },
];

const maxCount = Math.max(...weeklyData.map((d) => d.count));

export const ReportsPage = () => {
  return (
    <AppLayout>
      <div className="px-5 pt-6 safe-area-inset-top">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-slide-down">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Reports</h1>
            <p className="text-muted-foreground text-sm">
              Analytics & insights
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {["Today", "This Week", "This Month", "All Time"].map((period, i) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                i === 1
                  ? "ocean-gradient text-primary-foreground shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={TrendingUp}
            label="Total Counted"
            value="128.5K"
            trend={{ value: 23, isPositive: true }}
            variant="primary"
          />
          <StatCard
            icon={BarChart3}
            label="Avg. per Batch"
            value="18.4K"
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Weekly Chart */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Weekly Overview</h3>
            <button className="flex items-center gap-1.5 text-sm text-primary font-medium">
              <Calendar className="h-4 w-4" />
              Jan 8-14
            </button>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-40">
            {weeklyData.map((item, index) => (
              <div key={item.day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full ocean-gradient rounded-t-lg transition-all hover:brightness-110"
                  style={{
                    height: `${(item.count / maxCount) * 100}%`,
                    animationDelay: `${index * 50}ms`,
                  }}
                />
                <span className="text-xs text-muted-foreground mt-2">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Total this week</p>
              <p className="text-xl font-bold text-foreground">128,500</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Batches completed</p>
              <p className="text-xl font-bold text-foreground">7</p>
            </div>
          </div>
        </div>

        {/* Accuracy Report */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6 animate-scale-in">
          <h3 className="font-semibold text-foreground mb-4">Detection Accuracy</h3>
          
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeDasharray={`${98.5 * 2.51} ${100 * 2.51}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(200 80% 35%)" />
                    <stop offset="100%" stopColor="hsl(175 65% 45%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-foreground">98.5%</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">High Confidence</span>
                <span className="text-sm font-semibold text-foreground">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Medium Confidence</span>
                <span className="text-sm font-semibold text-foreground">6%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Low Confidence</span>
                <span className="text-sm font-semibold text-foreground">2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-secondary rounded-2xl p-5 animate-scale-in">
          <h3 className="font-semibold text-foreground mb-3">Export Data</h3>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              CSV
            </Button>
            <Button variant="outline" className="flex-1">
              PDF
            </Button>
            <Button variant="outline" className="flex-1">
              Excel
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;

import { Camera, TrendingUp, Package, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/common/StatCard";
import { BatchCard, Batch } from "@/components/common/BatchCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Mock data - replace with API calls
const mockBatches: Batch[] = [
  {
    id: "1",
    name: "Pond A - Batch 001",
    createdAt: "2024-01-15",
    totalCount: 125000,
    imageCount: 15,
    status: "active",
  },
  {
    id: "2",
    name: "Pond B - Batch 002",
    createdAt: "2024-01-14",
    totalCount: 98500,
    imageCount: 12,
    status: "completed",
  },
  {
    id: "3",
    name: "Pond C - Batch 003",
    createdAt: "2024-01-13",
    totalCount: 0,
    imageCount: 0,
    status: "pending",
  },
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <AppLayout>
      <div className="px-5 pt-6 safe-area-inset-top">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-slide-down">
          <div>
            <p className="text-muted-foreground text-sm">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-foreground">
              {user?.name || "User"}
            </h1>
          </div>
          <Button
            variant="capture"
            size="icon-lg"
            onClick={() => navigate("/capture")}
          >
            <Camera className="h-6 w-6" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard
            icon={Package}
            label="Total Batches"
            value={mockBatches.length}
            variant="primary"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Counted"
            value="223.5K"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            icon={Camera}
            label="Scans Today"
            value={8}
          />
          <StatCard
            icon={Clock}
            label="Avg. Accuracy"
            value="98.5%"
            variant="accent"
          />
        </div>

        {/* Recent Batches */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Batches</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/history")}
              className="text-primary"
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {mockBatches.map((batch, index) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                onClick={() => navigate(`/batch/${batch.id}`)}
                className={`animation-delay-${index * 100}`}
              />
            ))}
          </div>
        </div>

        {/* Quick Action */}
        <div className="ocean-gradient rounded-2xl p-6 shadow-elevated animate-scale-in">
          <h3 className="text-lg font-semibold text-primary-foreground mb-2">
            Start New Batch
          </h3>
          <p className="text-primary-foreground/80 text-sm mb-4">
            Create a new batch to start counting shrimp seeds
          </p>
          <Button
            variant="glass"
            onClick={() => navigate("/capture")}
          >
            <Camera className="h-4 w-4 mr-2" />
            Start Counting
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;

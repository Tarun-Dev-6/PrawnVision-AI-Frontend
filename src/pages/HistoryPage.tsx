import { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BatchCard, Batch } from "@/components/common/BatchCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data - replace with API calls
const mockHistory: Batch[] = [
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
  {
    id: "4",
    name: "Pond A - Batch 004",
    createdAt: "2024-01-12",
    totalCount: 150000,
    imageCount: 18,
    status: "completed",
  },
  {
    id: "5",
    name: "Pond D - Batch 005",
    createdAt: "2024-01-11",
    totalCount: 87500,
    imageCount: 10,
    status: "completed",
  },
];

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredBatches = mockHistory.filter((batch) => {
    const matchesSearch = batch.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || batch.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="px-5 pt-6 safe-area-inset-top">
        {/* Header */}
        <div className="mb-6 animate-slide-down">
          <h1 className="text-2xl font-bold text-foreground mb-1">History</h1>
          <p className="text-muted-foreground text-sm">
            View and manage your batch history
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {["all", "active", "completed", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                filterStatus === status
                  ? "ocean-gradient text-primary-foreground shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredBatches.length} batch{filteredBatches.length !== 1 && "es"} found
          </p>
          <button className="flex items-center gap-1.5 text-sm text-primary font-medium">
            <Calendar className="h-4 w-4" />
            Date Range
          </button>
        </div>

        {/* Batch List */}
        <div className="space-y-4">
          {filteredBatches.length > 0 ? (
            filteredBatches.map((batch, index) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                onClick={() => navigate(`/batch/${batch.id}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No batches found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default HistoryPage;

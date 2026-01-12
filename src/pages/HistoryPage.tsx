import { Clock, ImageIcon } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

// Mock data - replace with API calls
interface CaptureRecord {
  id: string;
  imageUrl: string;
  count: number;
  capturedAt: string;
}

const mockCaptures: CaptureRecord[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&h=300&fit=crop",
    count: 2456,
    capturedAt: "2024-01-15 14:30",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&h=300&fit=crop",
    count: 1823,
    capturedAt: "2024-01-15 10:15",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&h=300&fit=crop",
    count: 3102,
    capturedAt: "2024-01-14 16:45",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&h=300&fit=crop",
    count: 987,
    capturedAt: "2024-01-14 09:20",
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&h=300&fit=crop",
    count: 4521,
    capturedAt: "2024-01-13 11:00",
  },
];

export const HistoryPage = () => {
  return (
    <AppLayout>
      <div className="px-5 pt-6">

        {/* Capture List */}
        <div className="space-y-4">
          {mockCaptures.length > 0 ? (
            mockCaptures.map((capture, index) => (
              <div
                key={capture.id}
                className="bg-card rounded-2xl shadow-soft overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="relative h-40 bg-secondary">
                  <img
                    src={capture.imageUrl}
                    alt={`Capture ${capture.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {capture.count.toLocaleString()} seeds
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{capture.capturedAt}</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {capture.count.toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No captures yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Start capturing to see your history
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default HistoryPage;

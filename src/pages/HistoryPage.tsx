import { useEffect, useState } from "react";
import { Clock, Trash2, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ImagePreviewModal } from "@/components/ImagePreviewModal";
import { useToast } from "@/hooks/use-toast";
import {
  getLocalCaptures,
  deleteLocalCapture,
  LocalCapture,
} from "@/services/localCaptures";
import { resolveLocalImage } from "@/services/storage";

export const HistoryPage = () => {
  const { toast } = useToast();

  const [captures, setCaptures] = useState<LocalCapture[]>([]);
  const [imageUris, setImageUris] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<{ url: string; count: number } | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = getLocalCaptures();
      setCaptures(data);

      const map: Record<number, string> = {};
      for (const c of data) {
        const uri = await resolveLocalImage(c.imagePath);
        map[c.id] = uri;
        console.log("Resolved image:", uri);
      }

      setImageUris(map);
      setLoading(false);
    };

    load();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleDelete = (id: number) => {
    deleteLocalCapture(id);
    setCaptures(prev => prev.filter(c => c.id !== id));
    toast({ title: "Deleted", description: "Capture removed" });
  };

  return (
    <AppLayout>
      <div className="px-5 pt-6">
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && captures.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No captures yet
          </div>
        )}

        {!loading && captures.length > 0 && (
          <div className="space-y-4">
            {captures.map((c, i) => (
              <div key={c.id} className="bg-card rounded-2xl shadow-soft overflow-hidden">
                <div
                  className="relative h-40 cursor-pointer"
                  onClick={() => setPreview({ url: imageUris[c.id], count: c.count })}
                >
                  <img
                    src={imageUris[c.id]}
                    className="w-full h-full object-cover"
                    onError={() => console.error("FAILED:", imageUris[c.id])}
                  />
                  <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {c.count} seeds
                  </div>
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{formatDate(c.capturedAt)}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {preview && (
        <ImagePreviewModal
          isOpen={true}
          onClose={() => setPreview(null)}
          imageUrl={preview.url}
          count={preview.count}
        />
      )}
    </AppLayout>
  );
};

export default HistoryPage;

import { useState, useEffect } from "react";
import { Clock, ImageIcon, Trash2, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { getCaptures, deleteCapture, API_BASE_URL, CaptureRecord } from "@/services/api";
import { ImagePreviewModal } from "@/components/ImagePreviewModal";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const HistoryPage = () => {
  const { toast } = useToast();
  const [captures, setCaptures] = useState<CaptureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; count: number } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
  // Fix backend timestamp: "YYYY-MM-DD HH:mm:ss"
  const safeDate = dateString.replace(" ", "T");
  const date = new Date(safeDate);

  if (isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const fetchCaptures = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCaptures();
      setCaptures(data);
    } catch (err) {
      console.error("Failed to fetch captures:", err);
      setError("Unable to load history. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptures();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteCapture(id);
      setCaptures((prev) => prev.filter((c) => c.id !== id));
      toast({
        title: "Deleted",
        description: "Capture has been removed.",
      });
    } catch (err) {
      console.error("Failed to delete capture:", err);
      toast({
        title: "Delete Failed",
        description: "Unable to delete capture.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("/")) {
      return `${API_BASE_URL}${imageUrl}`;
    }
    return imageUrl;
  };

  return (
    <AppLayout>
      <div className="px-5 pt-6">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={fetchCaptures}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {/* History List */}
        {!loading && !error && (
          <div className="space-y-4">
            {captures.length > 0 ? (
              captures.map((capture, index) => (
                <div
                  key={capture.id}
                  className="bg-card rounded-2xl shadow-soft overflow-hidden animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  <div
                    className="relative h-40 bg-secondary cursor-pointer"
                    onClick={() =>
                      setPreviewImage({
                        url: getImageUrl(capture.image_url),
                        count: capture.count,
                      })
                    }
                  >
                    <img
                      src={getImageUrl(capture.image_url)}
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
                      <span className="text-sm">
                        {formatDate(capture.captured_at)}
                      </span>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center"
                          disabled={deletingId === capture.id}
                        >
                          {deletingId === capture.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Capture?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(capture.id)}
                            className="bg-destructive"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">No captures yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {previewImage && (
        <ImagePreviewModal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          imageUrl={previewImage.url}
          count={previewImage.count}
        />
      )}
    </AppLayout>
  );
};

export default HistoryPage;



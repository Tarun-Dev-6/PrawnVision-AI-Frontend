import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  count?: number;
}

export const ImagePreviewModal = ({
  isOpen,
  onClose,
  imageUrl,
  count,
}: ImagePreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
        <VisuallyHidden>
          <DialogTitle>Image Preview</DialogTitle>
        </VisuallyHidden>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Image */}
        <div className="flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        </div>

        {/* Count Badge */}
        {count !== undefined && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-lg font-bold shadow-lg">
            {count.toLocaleString()} seeds
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;

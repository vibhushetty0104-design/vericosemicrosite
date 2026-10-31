import React, { useRef, useState } from 'react';
import { useAccessibleDialog } from '../utils/useAccessibleDialog';
import { Upload, Image as ImageIcon, Video, Trash2, Eye, X, Play, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface UploadedMediaItem {
  id: string;
  type: 'image' | 'video';
  name: string;
  size: string;
  dataUrl: string;
  timestamp: string;
}

interface MediaUploaderProps {
  mediaItems: UploadedMediaItem[];
  onAddMedia: (item: UploadedMediaItem) => void;
  onRemoveMedia: (id: string) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  mediaItems,
  onAddMedia,
  onRemoveMedia,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [activePreview, setActivePreview] = useState<UploadedMediaItem | null>(null);
  const previewDialogRef = useRef<HTMLDivElement>(null);
  useAccessibleDialog(activePreview !== null, () => setActivePreview(null), previewDialogRef);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const images = mediaItems.filter(m => m.type === 'image');
  const videos = mediaItems.filter(m => m.type === 'video');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    setErrorMsg(null);

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select valid image files (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg('Image file size exceeds 15MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onAddMedia({
            id: 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            type: 'image',
            name: file.name,
            size: formatFileSize(file.size),
            dataUrl: e.target.result as string,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoFiles = (files: FileList | null) => {
    if (!files) return;
    setErrorMsg(null);

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('video/')) {
        setErrorMsg('Please select valid video files (MP4, WebM, MOV).');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setErrorMsg('Video file size exceeds 50MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onAddMedia({
            id: 'vid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            type: 'video',
            name: file.name,
            size: formatFileSize(file.size),
            dataUrl: e.target.result as string,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-white border border-mv-outline/70 rounded-3xl p-6 sm:p-7 shadow-2xs">
      
      {/* Header and Guidelines */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-mv-outline/60 gap-3 mb-5">
        <div>
          <h3 className="font-serif text-base font-semibold text-mv-forest flex items-center gap-2">
            <Upload className="w-4 h-4 text-mv-forest" />
            <span>Attach Visual Evidence (Photos &amp; Video Clips)</span>
          </h3>
          <p className="text-xs text-mv-ink-muted mt-1">
            Add images of leg varicosities or a brief standing video to contextualize your doctor consultation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-mv-ink-muted">
          <span className="bg-mv-cream border border-mv-outline/60 px-2.5 py-1 rounded-full">{images.length} Photos</span>
          <span>·</span>
          <span className="bg-mv-cream border border-mv-outline/60 px-2.5 py-1 rounded-full">{videos.length} Videos</span>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Dual Upload Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        
        {/* Photo Upload Trigger */}
        <div
          onClick={() => imageInputRef.current?.click()}
          className="border border-dashed border-mv-outline/80 hover:border-mv-forest bg-[#FAF7F2] hover:bg-mv-cream rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
        >
          <input
            type="file"
            ref={imageInputRef}
            onChange={(e) => handleImageFiles(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-white border border-mv-outline/70 flex items-center justify-center text-mv-forest mb-2.5 group-hover:scale-105 transition-transform shadow-2xs">
            <ImageIcon className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-mv-forest">
            Upload Leg / Vein Photos
          </span>
          <span className="text-[11px] text-mv-ink-muted mt-0.5">
            Select multiple PNG, JPG, or WebP
          </span>
        </div>

        {/* Video Upload Trigger */}
        <div
          onClick={() => videoInputRef.current?.click()}
          className="border border-dashed border-mv-outline/80 hover:border-mv-terracotta bg-[#FAF7F2] hover:bg-mv-cream rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
        >
          <input
            type="file"
            ref={videoInputRef}
            onChange={(e) => handleVideoFiles(e.target.files)}
            multiple
            accept="video/*"
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-white border border-mv-outline/70 flex items-center justify-center text-mv-terracotta mb-2.5 group-hover:scale-105 transition-transform shadow-2xs">
            <Video className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-mv-forest">
            Upload Standing / Walking Video
          </span>
          <span className="text-[11px] text-mv-ink-muted mt-0.5">
            Short clip showing calves/ankles (MP4, WebM)
          </span>
        </div>

      </div>

      {/* Uploaded Media Gallery */}
      {mediaItems.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-mv-forest mb-3 flex items-center justify-between">
            <span>Attached Media ({mediaItems.length})</span>
            <span className="text-[11px] text-mv-ink-muted">Click preview to inspect or remove</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[#FAF7F2] border border-mv-outline/70 rounded-2xl overflow-hidden flex flex-col shadow-2xs"
              >
                {/* Thumbnail container */}
                <div className="h-28 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  {item.type === 'image' ? (
                    <img
                      src={item.dataUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                      <video
                        src={item.dataUrl}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white">
                        <Play className="w-4 h-4 translate-x-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setActivePreview(item)}
                      className="p-2 bg-white/95 hover:bg-white text-mv-forest rounded-full text-xs shadow-xs"
                      title="Inspect preview"
                      aria-label={`Preview ${item.name}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveMedia(item.id)}
                      className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs shadow-xs"
                      title="Remove item"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Caption Info */}
                <div className="p-2.5 text-[10px] text-mv-ink-muted bg-white flex items-center justify-between border-t border-mv-outline/60">
                  <span className="truncate max-w-[100px] font-medium text-mv-forest" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-mv-ink-muted shrink-0 font-mono">{item.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photography Guide Note */}
      <div className="mt-5 pt-3.5 border-t border-mv-outline/60 flex items-start gap-2 text-[12px] text-mv-ink-muted leading-relaxed">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          <strong className="text-mv-forest">Photography tip:</strong> Stand upright against a plain background in bright, indirect light. Take one photo of the front of your legs, one from behind showing the calves, and one close-up of any prominent bulges or skin discoloration.
        </span>
      </div>

      {/* Modal Lightbox for Media Preview */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActivePreview(null);
          }}
        >
          <div
            ref={previewDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-preview-title"
            tabIndex={-1}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col focus:outline-none border border-mv-outline/70"
          >
            <div className="p-4 bg-mv-forest text-white flex items-center justify-between text-xs font-semibold">
              <h3 id="media-preview-title" className="truncate">{activePreview.name}</h3>
              <button
                onClick={() => setActivePreview(null)}
                aria-label="Close preview"
                className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-black flex items-center justify-center max-h-[70vh]">
              {activePreview.type === 'image' ? (
                <img
                  src={activePreview.dataUrl}
                  alt={activePreview.name}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              ) : (
                <video
                  src={activePreview.dataUrl}
                  controls
                  autoPlay
                  className="max-h-[60vh] max-w-full"
                />
              )}
            </div>

            <div className="p-4 bg-[#FAF7F2] flex items-center justify-between text-xs border-t border-mv-outline/60">
              <span className="text-mv-ink-muted font-mono">Size: {activePreview.size}</span>
              <button
                onClick={() => {
                  onRemoveMedia(activePreview.id);
                  setActivePreview(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove From Assessment</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

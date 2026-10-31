import React from 'react';
import { MediaUploader, UploadedMediaItem } from './MediaUploader';
import { Camera, Video, ShieldCheck, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';

interface ClinicalMediaSectionProps {
  mediaItems: UploadedMediaItem[];
  onAddMedia: (item: UploadedMediaItem) => void;
  onRemoveMedia: (id: string) => void;
  onNavigateToAssessment: () => void;
  onOpenBooking: () => void;
}

export const ClinicalMediaSection: React.FC<ClinicalMediaSectionProps> = ({
  mediaItems,
  onAddMedia,
  onRemoveMedia,
  onNavigateToAssessment,
  onOpenBooking,
}) => {
  const images = mediaItems.filter(m => m.type === 'image');
  const videos = mediaItems.filter(m => m.type === 'video');

  return (
    <section id="media-upload" className="py-16 bg-[#FAF7F2] border-b border-mv-outline/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 pb-6 border-b border-mv-outline/60 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] font-semibold text-mv-terracotta bg-mv-terracotta/10 px-3 py-1 rounded-full mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Visual Tele-Triage &amp; Clinical Context</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-mv-forest tracking-tight">
              Upload Photos &amp; Videos of Your Leg Veins
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-mv-ink-muted max-w-2xl leading-relaxed">
              Attach multiple photos of your visible veins, swelling, or skin pigmentation, along with short standing or walking video clips. These are securely compiled into your clinical summary report and linked to your appointment chart.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-mv-ink-muted bg-white border border-mv-outline/70 px-3.5 py-1.5 rounded-full shadow-2xs">
              Attached: <strong className="text-mv-forest">{images.length} Photos</strong>, <strong className="text-mv-forest">{videos.length} Videos</strong>
            </span>
          </div>
        </div>

        {/* 2-Column Layout: Media Uploader + Photo Guidance Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Uploader */}
          <div className="lg:col-span-8">
            <MediaUploader
              mediaItems={mediaItems}
              onAddMedia={onAddMedia}
              onRemoveMedia={onRemoveMedia}
            />

            {/* Quick Actions with Uploaded Media */}
            {mediaItems.length > 0 && (
              <div className="mt-5 bg-white border border-mv-outline/70 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="text-xs text-mv-ink-muted">
                  <strong className="text-mv-forest block mb-1">Media Ready:</strong>
                  Your {mediaItems.length} file(s) stay on this device only. They are not uploaded, not sent with any request, and not included in the PDF summary (which lists only how many you added).
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={onNavigateToAssessment}
                    className="px-4 py-2 text-xs font-semibold text-mv-forest bg-white border border-mv-outline/70 rounded-full hover:bg-mv-cream transition-colors cursor-pointer tap-tactile min-h-[40px]"
                  >
                    Go to Questionnaire
                  </button>
                  <button
                    onClick={onOpenBooking}
                    className="px-4 py-2 text-xs font-semibold text-white bg-mv-terracotta hover:bg-[#B34E35] rounded-full transition-colors cursor-pointer tap-tactile min-h-[40px]"
                  >
                    Request an appointment (demo)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Photography Best Practice Guide */}
          <div className="lg:col-span-4 space-y-5">
            
            <div className="bg-white border border-mv-outline/70 rounded-3xl p-6 shadow-2xs">
              <h3 className="font-serif text-base font-semibold text-mv-forest mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-mv-forest" />
                <span>How to Capture Informative Vein Photos</span>
              </h3>

              <div className="space-y-3.5 text-xs text-mv-ink-muted">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-mv-cream text-mv-forest font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px] border border-mv-outline/60">
                    1
                  </div>
                  <div>
                    <strong className="text-mv-forest block mb-0.5">Stand Upright (Do not lay down):</strong>
                    Veins collapse when legs are elevated. Standing allows gravity to fill diseased veins to their true visible volume.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-mv-cream text-mv-forest font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px] border border-mv-outline/60">
                    2
                  </div>
                  <div>
                    <strong className="text-mv-forest block mb-0.5">Use Bright, Indirect Light:</strong>
                    Natural daylight or direct side lighting casts soft shadows that highlight raised vein cords and contours.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-mv-cream text-mv-forest font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px] border border-mv-outline/60">
                    3
                  </div>
                  <div>
                    <strong className="text-mv-forest block mb-0.5">3 Recommended Photo Angles:</strong>
                    <span>(A) Front view of thighs &amp; shins, (B) Posterior calf view from behind, and (C) Close-up of inner ankle gaiter zone.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-mv-cream text-mv-forest font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px] border border-mv-outline/60">
                    4
                  </div>
                  <div>
                    <strong className="text-mv-forest block mb-0.5">Optional 5-Second Video:</strong>
                    Record a slow 360-degree rotation of your lower legs while standing on flat ground.
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy notice card */}
            <div className="bg-white border border-mv-outline/60 rounded-2xl p-5 text-xs text-mv-ink-muted space-y-2">
              <div className="flex items-center gap-2 text-mv-forest font-semibold">
                <HelpCircle className="w-4 h-4 text-mv-forest" />
                <span>Patient Privacy Protection</span>
              </div>
              <p className="leading-relaxed text-[12px]">
                All photos and videos are stored in your private browser session. When submitting an appointment or downloading your PDF report, they remain encrypted and accessible only to Meridian clinical staff.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

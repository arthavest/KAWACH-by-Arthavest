import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone as webapp, don't show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer ${className}`}
        title="Install KAWACH Progressive Web App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install Webapp</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-500" />
          <span>Install Webapp (iOS)</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#121C2E] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-rose-500" />
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                    Install KAWACH on iPhone / iPad
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1726]">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] flex-none">
                    1
                  </span>
                  <span>Tap the <b>Share</b> button in the bottom Safari toolbar.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1726]">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] flex-none">
                    2
                  </span>
                  <span>Scroll down and tap <b>Add to Home Screen</b>.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1726]">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] flex-none">
                    3
                  </span>
                  <span>Launch KAWACH directly from your home screen like a native mobile app!</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser install CTA
  return (
    <button
      onClick={() => {
        alert(
          'To install KAWACH as a webapp on your device:\n\n• On Chrome / Edge / Brave: Click the Install icon in the browser address bar (top right).\n• On Android: Tap browser menu (⋮) -> "Install App" or "Add to Home screen".\n• On iPhone / iPad: Tap Share -> "Add to Home Screen".'
        );
      }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
      title="Install as Progressive Web App"
    >
      <Download className="w-3.5 h-3.5 text-blue-500" />
      <span>Install Webapp</span>
    </button>
  );
};

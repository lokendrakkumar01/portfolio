import { useState } from 'react';
import { Download, FileText, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { useCurrentResume } from '../../hooks/useResume';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { downloadResumeFile } from '../../utils/download';

export default function ResumePage() {
  const { data, isLoading } = useCurrentResume();
  const resume = data?.data;
  const [isFullscreen, setIsFullscreen] = useState(false);

  const googleDocsViewerUrl = resume?.fileUrl
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(resume.fileUrl)}&embedded=true`
    : '';

  return (
    <>
      <SEO title="Resume / CV" description="Latest Resume & CV of Lokendra Kumar" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="Resume / CV" subtitle="My professional profile & experience summary" center />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-3xl" />
            <Skeleton className="h-[70vh] w-full rounded-3xl" />
          </div>
        ) : !resume ? (
          <EmptyState
            icon={FileText}
            title="Resume not available"
            description="The resume will be uploaded soon. Please check back later."
          />
        ) : (
          <div className="space-y-6">
            {/* Resume Info Header Card */}
            <div className="bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                  <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-extrabold text-text text-base sm:text-lg">{resume.fileName}</h3>
                  <p className="text-xs font-semibold text-muted mt-0.5">
                    Version {resume.version} · {formatFileSize(resume.fileSize)} · Uploaded {formatDate(resume.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <a href={resume.fileUrl} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none">
                  <Button variant="outline" size="md" icon={<ExternalLink className="w-4 h-4" />} className="w-full sm:w-auto">
                    Open Original PDF
                  </Button>
                </a>
                <Button
                  size="md"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => downloadResumeFile(resume.fileUrl, resume.fileName || 'Lokendra_Kumar_Resume.pdf')}
                  className="w-full sm:w-auto flex-1 sm:flex-none"
                >
                  Download Resume
                </Button>
              </div>
            </div>

            {/* Embedded PDF Viewer Container */}
            <div
              className={`bg-card border border-border shadow-2xl transition-all duration-300 flex flex-col ${
                isFullscreen
                  ? 'fixed inset-0 z-[100] rounded-none border-none bg-surface'
                  : 'relative rounded-3xl overflow-hidden min-h-[75vh]'
              }`}
            >
              {/* Viewer Control Bar */}
              <div className="bg-surface/90 backdrop-blur-md px-5 py-3.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-bold text-text ml-2 truncate max-w-xs">{resume.fileName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm active:scale-95"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize2 className="w-4 h-4 text-primary" />
                        <span>Exit Fullscreen</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-4 h-4 text-primary" />
                        <span>Fullscreen Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* PDF Viewer Iframe */}
              <div className="flex-1 w-full h-full relative bg-surface/50">
                <iframe
                  src={googleDocsViewerUrl}
                  title="Resume PDF Viewer"
                  className="w-full h-full border-none"
                  style={{ minHeight: isFullscreen ? 'calc(100vh - 56px)' : '72vh' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
import { useState } from 'react';
import { Download, FileText, ExternalLink, Maximize2 } from 'lucide-react';
import { SEO } from '../../components/common/SEO';
import { SectionHeading } from '../../components/common/SectionHeading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { useCurrentResume } from '../../hooks/useResume';
import { formatDate, formatFileSize } from '../../utils/formatters';

export default function ResumePage() {
  const { data, isLoading } = useCurrentResume();
  const resume = data?.data;
  const [iframeError, setIframeError] = useState(false);

  return (
    <>
      <SEO title="Resume / CV" description="My latest resume and CV" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading title="Resume / CV" subtitle="My professional profile & experience summary" center />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-[65vh] w-full rounded-2xl" />
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
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-base">{resume.fileName}</h3>
                  <p className="text-xs text-muted mt-0.5">
                    Version {resume.version} · {formatFileSize(resume.fileSize)} · Uploaded {formatDate(resume.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a href={resume.fileUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="md" icon={<ExternalLink className="w-4 h-4" />}>
                    Open PDF
                  </Button>
                </a>
                <a href={resume.fileUrl} download target="_blank" rel="noreferrer">
                  <Button size="md" icon={<Download className="w-4 h-4" />}>
                    Download Resume
                  </Button>
                </a>
              </div>
            </div>

            {/* Embedded PDF Viewer Container */}
            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{ minHeight: '75vh' }}>
              {/* Viewer Control Bar */}
              <div className="bg-surface px-5 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-muted font-medium ml-2">{resume.fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-card transition-colors"
                    title="Fullscreen / Open in new tab"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* PDF Viewer Body */}
              <div className="flex-1 w-full h-full relative bg-surface/50">
                {!iframeError ? (
                  <object
                    data={resume.fileUrl}
                    type="application/pdf"
                    className="w-full h-full min-h-[70vh]"
                    onError={() => setIframeError(true)}
                  >
                    {/* Fallback if object element cannot render PDF inline */}
                    <div className="flex flex-col items-center justify-center p-12 text-center h-full space-y-4">
                      <FileText className="w-16 h-16 text-primary animate-bounce" />
                      <h3 className="text-lg font-semibold text-text">PDF Document Ready</h3>
                      <p className="text-sm text-muted max-w-md">
                        Your browser doesn't support inline PDF preview. You can view or download it directly using the buttons below.
                      </p>
                      <div className="flex gap-3 pt-2">
                        <a href={resume.fileUrl} target="_blank" rel="noreferrer">
                          <Button variant="outline" icon={<ExternalLink className="w-4 h-4" />}>
                            View PDF
                          </Button>
                        </a>
                        <a href={resume.fileUrl} download>
                          <Button icon={<Download className="w-4 h-4" />}>
                            Download PDF
                          </Button>
                        </a>
                      </div>
                    </div>
                  </object>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center h-full space-y-4">
                    <FileText className="w-16 h-16 text-primary" />
                    <h3 className="text-lg font-semibold text-text">PDF Ready to View</h3>
                    <p className="text-sm text-muted max-w-md">
                      Click below to open or download the complete PDF resume.
                    </p>
                    <div className="flex gap-3 pt-2">
                      <a href={resume.fileUrl} target="_blank" rel="noreferrer">
                        <Button variant="outline" icon={<ExternalLink className="w-4 h-4" />}>
                          Open PDF
                        </Button>
                      </a>
                      <a href={resume.fileUrl} download>
                        <Button icon={<Download className="w-4 h-4" />}>
                          Download PDF
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export const downloadResumeFile = async (fileUrl: string, customName = 'Lokendra_Kumar_Resume.pdf') => {
  if (!fileUrl) return;

  const fileName = customName.toLowerCase().endsWith('.pdf') ? customName : `${customName}.pdf`;

  try {
    const response = await fetch(fileUrl, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    const blobUrl = window.URL.createObjectURL(pdfBlob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.warn('Direct blob download fallback:', error);
    let downloadUrl = fileUrl;
    if (fileUrl.includes('cloudinary.com') && fileUrl.includes('/raw/upload/')) {
      downloadUrl = fileUrl.replace('/raw/upload/', `/raw/upload/fl_attachment:${encodeURIComponent(fileName)}/`);
    }
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

import { getApiBaseUrl } from '../services/api';

/**
 * Reliable resume handler:
 * - openPreview: opens the intact PDF directly in a new browser tab for immediate viewing.
 * - download: streams the complete uncorrupted PDF from the backend /resume endpoint
 *   (or static fallback) directly to the user's browser Downloads directory.
 */
export const downloadResume = async (openPreview = false) => {
  const filename = 'Sarthak_Mehrotra_Resume.pdf';
  const directPdfUrl = `/${filename}`;

  if (openPreview) {
    // Opens in native browser PDF reader tab immediately
    window.open(directPdfUrl, '_blank', 'noopener,noreferrer');
    return { success: true, action: 'preview' };
  }

  // Attempt direct download via FastAPI /resume attachment endpoint
  const backendUrl = getApiBaseUrl();
  const backendDownloadUrl = `${backendUrl}/resume`;

  try {
    const test = await fetch(backendDownloadUrl, { method: 'HEAD' });
    if (test.ok) {
      triggerDownload(backendDownloadUrl, filename);
      return { success: true, action: 'download', source: 'backend' };
    }
  } catch (err) {
    console.warn('Backend /resume endpoint not reachable, falling back to static file:', err);
  }

  // Fallback to static public file with download attribute
  triggerDownload(directPdfUrl, filename);
  return { success: true, action: 'download', source: 'static' };
};

function triggerDownload(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.setAttribute('target', '_blank');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 500);
}

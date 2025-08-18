// hooks/usePDFGenerator.ts
import { useState, useCallback } from 'react';

interface UsePDFGeneratorProps {
  darkMode: boolean;
  activeTimeRange: string;
}

export const usePDFGenerator = ({ darkMode, activeTimeRange }: UsePDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = useCallback(async (elementRef: React.RefObject<HTMLElement>) => {
    if (!elementRef.current || typeof window === 'undefined') return;
    
    setIsGenerating(true);
    
    try {
      // Load libraries with proper error handling
      const loadLibraries = async () => {
        try {
          const [html2canvasModule, jsPDFModule] = await Promise.all([
            import('html2canvas'),
            import('jspdf')
          ]);
          return {
            html2canvas: html2canvasModule.default,
            jsPDF: jsPDFModule.default
          };
        } catch (error) {
          console.error('Failed to load PDF libraries:', error);
          throw new Error('PDF libraries failed to load. Please refresh and try again.');
        }
      };

      const { html2canvas, jsPDF } = await loadLibraries();
      
      // Wait for any pending renders and styles to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a style element to override problematic CSS
      const styleOverride = document.createElement('style');
      styleOverride.textContent = `
        * {
          color-scheme: none !important;
        }
        .bg-gray-50 { background-color: #f9fafb !important; }
        .bg-gray-100 { background-color: #f3f4f6 !important; }
        .bg-gray-800 { background-color: #1f2937 !important; }
        .bg-gray-900 { background-color: #111827 !important; }
        .text-white { color: #ffffff !important; }
        .text-gray-900 { color: #111827 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-300 { color: #d1d5db !important; }
        .text-blue-600 { color: #2563eb !important; }
        .text-green-500 { color: #10b981 !important; }
        .text-red-500 { color: #ef4444 !important; }
        .border-gray-200 { border-color: #e5e7eb !important; }
        .border-gray-700 { border-color: #374151 !important; }
      `;
      document.head.appendChild(styleOverride);
      
      try {
        // Capture the element with enhanced options
        const canvas = await html2canvas(elementRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: darkMode ? '#111827' : '#ffffff',
          logging: false,
          removeContainer: true,
          async: true,
          foreignObjectRendering: false, // Disable to avoid CSS parsing issues
          ignoreElements: (element) => {
            // Skip elements that might cause color parsing issues
            const classList = element.classList;
            return classList.contains('animate-spin') || 
                   element.tagName === 'STYLE' ||
                   element.hasAttribute('data-ignore-pdf');
          },
          onclone: (clonedDoc, element) => {
            // Force simple colors in cloned document
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el: any) => {
              if (el.style) {
                // Remove any problematic CSS properties
                el.style.colorScheme = 'normal';
                el.style.filter = 'none';
                
                // Convert any modern color functions to simple hex/rgb
                const computedStyle = window.getComputedStyle(element);
                if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('oklch')) {
                  el.style.backgroundColor = darkMode ? '#1f2937' : '#ffffff';
                }
                if (computedStyle.color && computedStyle.color.includes('oklch')) {
                  el.style.color = darkMode ? '#ffffff' : '#111827';
                }
              }
            });
            
            // Ensure proper scaling
            clonedDoc.body.style.transform = 'scale(1)';
            clonedDoc.body.style.transformOrigin = 'top left';
            clonedDoc.body.style.width = element.scrollWidth + 'px';
            clonedDoc.body.style.height = element.scrollHeight + 'px';
          }
        });
        
        // Convert to PDF
        const imgData = canvas.toDataURL('image/png', 0.95);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
        
        // Calculate dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add header
        pdf.setFontSize(18);
        pdf.text('Financial Dashboard Report', pdfWidth / 2, 20, { align: 'center' });
        
        pdf.setFontSize(10);
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        pdf.text(`Generated: ${currentDate}`, pdfWidth / 2, 28, { align: 'center' });
        pdf.text(`Period: ${activeTimeRange}`, pdfWidth / 2, 34, { align: 'center' });
        
        // Add dashboard image
        const startY = 40;
        const availableHeight = pdfHeight - startY - 10;
        
        if (imgHeight <= availableHeight) {
          // Single page
          pdf.addImage(imgData, 'PNG', 0, startY, imgWidth, imgHeight);
        } else {
          // Multiple pages
          let currentHeight = imgHeight;
          let sourceY = 0;
          let pageCount = 0;
          
          while (currentHeight > 0) {
            if (pageCount > 0) {
              pdf.addPage();
            }
            
            const pageImageHeight = Math.min(currentHeight, availableHeight);
            
            // Create a temporary canvas for this page section
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = (pageImageHeight * canvas.width) / imgWidth;
            
            if (tempCtx) {
              tempCtx.drawImage(
                canvas,
                0, sourceY, canvas.width, tempCanvas.height,
                0, 0, canvas.width, tempCanvas.height
              );
              
              const tempImgData = tempCanvas.toDataURL('image/png', 0.95);
              pdf.addImage(tempImgData, 'PNG', 0, startY, imgWidth, pageImageHeight);
            }
            
            currentHeight -= availableHeight;
            sourceY += (availableHeight * canvas.width) / imgWidth;
            pageCount++;
          }
        }
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString()
          .slice(0, 19)
          .replace(/:/g, '-')
          .replace('T', '_');
        const filename = `financial-dashboard-${activeTimeRange.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`;
        
        pdf.save(filename);
        
        return { success: true, filename };
        
      } finally {
        // Clean up the style override
        document.head.removeChild(styleOverride);
      }
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      
      let message = 'Failed to generate PDF. ';
      if (error instanceof Error) {
        if (error.message.includes('libraries failed to load')) {
          message += 'Please refresh the page and try again.';
        } else if (error.message.includes('html2canvas') || error.message.includes('oklch')) {
          message += 'Screen capture failed due to CSS compatibility. Try using browser print instead.';
        } else {
          message += error.message;
        }
      } else {
        message += 'Unknown error occurred.';
      }
      
      // Fallback to browser print
      if (confirm(message + '\n\nWould you like to use browser print instead?')) {
        window.print();
      }
      
    } finally {
      setIsGenerating(false);
    }
  }, [darkMode, activeTimeRange]);

  return {
    generatePDF,
    isGenerating
  };
};
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
      // Use dynamic imports with proper error handling
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
      
      // Wait for any pending renders
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Capture the element
      const canvas = await html2canvas(elementRef.current, {
        scale: 1.2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        logging: false,
        removeContainer: true,
        async: true,
        onclone: (clonedDoc) => {
          // Ensure proper styling in cloned document
          const clonedElement = clonedDoc.body;
          clonedElement.style.transform = 'scale(1)';
          clonedElement.style.transformOrigin = 'top left';
        }
      });
      
      // Convert to PDF
      const imgData = canvas.toDataURL('image/png', 0.8);
      const imgWidth = 210; // A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add header
      pdf.setFontSize(18);
      pdf.text('Financial Dashboard Report', 105, 20, { align: 'center' });
      
      pdf.setFontSize(10);
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Generated: ${currentDate} | Period: ${activeTimeRange}`, 105, 30, { align: 'center' });
      
      // Add dashboard image
      const startY = 40;
      const availableHeight = 250; // Remaining space on page
      const finalImgHeight = Math.min(imgHeight, availableHeight);
      
      pdf.addImage(imgData, 'PNG', 0, startY, imgWidth, finalImgHeight);
      
      // If content is too long, add continuation pages
      if (imgHeight > availableHeight) {
        let remainingHeight = imgHeight - availableHeight;
        let currentY = -availableHeight;
        
        while (remainingHeight > 0) {
          pdf.addPage();
          const nextHeight = Math.min(remainingHeight, 280);
          pdf.addImage(imgData, 'PNG', 0, currentY, imgWidth, imgHeight);
          currentY -= 280;
          remainingHeight -= 280;
        }
      }
      
      // Save with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `financial-dashboard-${activeTimeRange.toLowerCase().replace(' ', '')}-${timestamp}.pdf`;
      
      pdf.save(filename);
      
      return { success: true, filename };
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      
      let message = 'Failed to generate PDF. ';
      if (error instanceof Error) {
        if (error.message.includes('libraries failed to load')) {
          message += 'Please refresh the page and try again.';
        } else if (error.message.includes('html2canvas')) {
          message += 'Screen capture failed. Try again.';
        } else {
          message += error.message;
        }
      } else {
        message += 'Unknown error occurred.';
      }
      
      throw new Error(message);
      
    } finally {
      setIsGenerating(false);
    }
  }, [darkMode, activeTimeRange]);

  return {
    generatePDF,
    isGenerating
  };
};
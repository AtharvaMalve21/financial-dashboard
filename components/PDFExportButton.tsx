"use client";
import { useState } from 'react';
import { Download } from 'lucide-react';

interface PDFExportButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  darkMode: boolean;
  activeTimeRange: string;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ 
  targetRef, 
  darkMode, 
  activeTimeRange 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    if (!targetRef.current) return;
    
    setIsGenerating(true);
    
    try {
      // Simple window.print() fallback
      if (!window.html2canvas) {
        window.print();
        return;
      }
      
      const html2canvas = await import('html2canvas');
      const jsPDF = await import('jspdf');
      
      const canvas = await html2canvas.default(targetRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF.default();
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.text('Financial Dashboard Report', 105, 15, { align: 'center' });
      pdf.addImage(imgData, 'PNG', 0, 25, imgWidth, Math.min(imgHeight, 270));
      pdf.save(`dashboard-${Date.now()}.pdf`);
      
    } catch (error) {
      console.error('Export failed:', error);
      // Fallback to browser print
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 
        ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'} 
        bg-green-600 text-white text-sm font-medium shadow-sm hover:shadow-md`}
    >
      <Download className="h-4 w-4" />
      <span>{isGenerating ? 'Exporting...' : 'Export PDF'}</span>
    </button>
  );
};

export default PDFExportButton;
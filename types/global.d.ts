// types/global.d.ts
declare global {
  interface Window {
    html2canvas?: any;
    jsPDF?: any;
  }
}

declare module 'html2canvas' {
  interface Html2CanvasOptions {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    backgroundColor?: string | null;
    logging?: boolean;
    height?: number;
    width?: number;
    scrollX?: number;
    scrollY?: number;
    x?: number;
    y?: number;
    async?: boolean;
    removeContainer?: boolean;
    foreignObjectRendering?: boolean;
    imageTimeout?: number;
    ignoreElements?: (element: HTMLElement) => boolean;
    onclone?: (clonedDoc: Document, element: HTMLElement) => void;
  }

  function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>;

  export default html2canvas;
}

declare module 'jspdf' {
  type OrientationType = 'portrait' | 'landscape' | 'p' | 'l';
  type UnitType = 'mm' | 'cm' | 'in' | 'px' | 'pt';
  type FormatType = 'a3' | 'a4' | 'a5' | 'letter' | 'legal' | [number, number];

  interface jsPDFOptions {
    orientation?: OrientationType;
    unit?: UnitType;
    format?: FormatType;
    compress?: boolean;
    precision?: number;
  }

  interface TextOptions {
    align?: 'left' | 'center' | 'right' | 'justify';
    angle?: number;
    renderingMode?: 'fill' | 'stroke' | 'fillThenStroke' | 'invisible' | 'fillAndAddForClipping' | 'strokeAndAddForClipping' | 'fillThenStrokeAndAddForClipping' | 'addToPathForClipping';
    charSpace?: number;
    horizontalScale?: number;
    maxWidth?: number;
  }

  class jsPDF {
    constructor(options?: jsPDFOptions);
    constructor(
      orientation?: OrientationType,
      unit?: UnitType,
      format?: FormatType
    );
    
    // Text methods
    setFontSize(size: number): jsPDF;
    setFont(fontName: string, fontStyle?: string): jsPDF;
    text(text: string | string[], x: number, y: number, options?: TextOptions): jsPDF;
    
    // Image methods
    addImage(
      imageData: string | HTMLImageElement | HTMLCanvasElement,
      format: string,
      x: number,
      y: number,
      width?: number,
      height?: number,
      alias?: string,
      compression?: 'NONE' | 'FAST' | 'MEDIUM' | 'SLOW',
      rotation?: number
    ): jsPDF;
    
    // Page methods
    addPage(format?: FormatType, orientation?: OrientationType): jsPDF;
    deletePage(targetPage: number): jsPDF;
    setPage(page: number): jsPDF;
    
    // Document properties
    getPageWidth(): number;
    getPageHeight(): number;
    internal: {
      pageSize: {
        width: number;
        height: number;
      };
    };
    
    // Output methods
    save(filename?: string): jsPDF;
    output(type?: string, options?: any): any;
  }

  export { jsPDF };
  export default jsPDF;
}

export {};
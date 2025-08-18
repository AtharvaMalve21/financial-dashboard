"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";
import {
  Menu,
  Bell,
  User,
  TrendingUp,
  TrendingDown,
  Eye,
  Sun,
  Moon,
  BarChart3,
  PieChart,
  Users,
  CreditCard,
  Download,
} from "lucide-react";

// Mock data
const aumData = { value: "₹2,45,67,890", change: "+12.5%", isPositive: true };
const sipData = { value: "₹45,23,567", change: "-2.3%", isPositive: false };

const statCards = [
  { title: "Purchases", value: "₹12,34,567", count: "143" },
  { title: "Redemptions", value: "₹8,45,123", count: "89" },
  { title: "Rejected Transactions", value: "₹1,23,456", count: "12" },
  { title: "SIP Rejections", value: "₹45,678", count: "8" },
  { title: "New SIP", value: "₹23,45,678", count: "67" },
];

const clientsData = [
  { x: 10, y: 20, z: 300, name: "Mumbai" },
  { x: 25, y: 35, z: 200, name: "Delhi" },
  { x: 40, y: 15, z: 400, name: "Bangalore" },
  { x: 60, y: 45, z: 150, name: "Chennai" },
  { x: 75, y: 25, z: 250, name: "Kolkata" },
];

const sipBusinessData = [
  { month: "Jan", sip: 12000, business: 15000 },
  { month: "Feb", sip: 15000, business: 18000 },
  { month: "Mar", sip: 18000, business: 22000 },
  { month: "Apr", sip: 14000, business: 19000 },
  { month: "May", sip: 20000, business: 25000 },
  { month: "Jun", sip: 22000, business: 28000 },
];

const monthlyMisData = [
  { month: "Jan", mutual: 5000, insurance: 3000, assets: 4000 },
  { month: "Feb", mutual: 6000, insurance: 3500, assets: 4500 },
  { month: "Mar", mutual: 7000, insurance: 4000, assets: 5000 },
  { month: "Apr", mutual: 6500, insurance: 3800, assets: 4800 },
  { month: "May", mutual: 8000, insurance: 4200, assets: 5500 },
  { month: "Jun", mutual: 9000, insurance: 4500, assets: 6000 },
];

const navItems = [
  "CRM",
  "Utilities",
  "Insurance",
  "Assets",
  "Mutual",
  "Research",
  "Transact Online",
  "Goal GPS",
  "Financial Planning",
  "Wealth Report",
  "Other",
];

const timeRanges = ["3 Days", "7 Days", "10 Days", "30 Days"];

const FinancialDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState("30 Days");
  const [loading, setLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTimeRangeChange = async (range: string) => {
    setLoading(true);
    setActiveTimeRange(range);
    // Simulate API call
    setTimeout(() => setLoading(false), 800);
  };

  // Enhanced PDF generation with proper OKLCH/color fixes
  const generatePDF = async () => {
    if (!dashboardRef.current) {
      alert("Dashboard not ready. Please wait and try again.");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Wait for any pending renders
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create comprehensive style override to fix OKLCH and modern CSS issues
      const styleOverride = document.createElement("style");
      styleOverride.id = "pdf-style-override";
      styleOverride.textContent = `
        /* Force simple color values for PDF export */
        * {
          color-scheme: none !important;
          -webkit-color-scheme: none !important;
        }
        
        /* Override Tailwind classes with hex colors */
        .bg-gray-50 { background-color: #f9fafb !important; }
        .bg-gray-100 { background-color: #f3f4f6 !important; }
        .bg-gray-200 { background-color: #e5e7eb !important; }
        .bg-gray-300 { background-color: #d1d5db !important; }
        .bg-gray-700 { background-color: #374151 !important; }
        .bg-gray-800 { background-color: #1f2937 !important; }
        .bg-gray-900 { background-color: #111827 !important; }
        .bg-white { background-color: #ffffff !important; }
        .bg-blue-600 { background-color: #2563eb !important; }
        .bg-green-600 { background-color: #16a34a !important; }
        .bg-red-500 { background-color: #ef4444 !important; }
        
        .text-white { color: #ffffff !important; }
        .text-gray-900 { color: #111827 !important; }
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-gray-500 { color: #6b7280 !important; }
        .text-gray-400 { color: #9ca3af !important; }
        .text-gray-300 { color: #d1d5db !important; }
        .text-blue-600 { color: #2563eb !important; }
        .text-green-500 { color: #22c55e !important; }
        .text-red-500 { color: #ef4444 !important; }
        
        .border-gray-200 { border-color: #e5e7eb !important; }
        .border-gray-700 { border-color: #374151 !important; }
        
        /* Force all elements to use simple colors */
        [style*="oklch"], [style*="color-mix"], [style*="lab"] {
          color: ${darkMode ? "#ffffff" : "#111827"} !important;
          background-color: ${darkMode ? "#1f2937" : "#ffffff"} !important;
        }
        
        /* Disable problematic CSS features */
        * {
          backdrop-filter: none !important;
          filter: none !important;
          mask: none !important;
          clip-path: none !important;
        }
      `;
      document.head.appendChild(styleOverride);

      // Dynamic import with retry logic
      let html2canvas: any, jsPDF: any;
      let retries = 3;

      while (retries > 0) {
        try {
          const [html2canvasModule, jsPDFModule] = await Promise.all([
            import("html2canvas"),
            import("jspdf"),
          ]);
          html2canvas = html2canvasModule.default;
          jsPDF = jsPDFModule.default;
          break;
        } catch (importError) {
          retries--;
          if (retries === 0) {
            throw new Error(
              "Failed to load PDF libraries after multiple attempts"
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      // Enhanced capture options
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: darkMode ? "#111827" : "#ffffff",
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false, // Disable to avoid CSS parsing issues
        ignoreElements: (element) => {
          // Skip problematic elements
          const classList = Array.from(element.classList);
          const hasProblematicClass = classList.some(
            (cls) =>
              cls.includes("animate-") ||
              cls.includes("transition-") ||
              element.tagName === "STYLE"
          );
          return hasProblematicClass || element.hasAttribute("data-ignore-pdf");
        },
        onclone: (clonedDoc, element) => {
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el: any) => {
            if (el.style) {
              // ✅ Use clonedDoc’s window, not the main window
              const styles = clonedDoc.defaultView?.getComputedStyle(el);

              el.style.colorScheme = "none";
              el.style.filter = "none";
              el.style.backdropFilter = "none";
              el.style.mask = "none";
              el.style.clipPath = "none";

              if (styles) {
                if (
                  styles.backgroundColor?.includes("oklch") ||
                  styles.backgroundColor?.includes("color-mix") ||
                  styles.backgroundColor?.includes("lab")
                ) {
                  el.style.backgroundColor = darkMode ? "#1f2937" : "#ffffff";
                }

                if (
                  styles.color?.includes("oklch") ||
                  styles.color?.includes("color-mix") ||
                  styles.color?.includes("lab")
                ) {
                  el.style.color = darkMode ? "#ffffff" : "#111827";
                }

                if (
                  styles.borderColor?.includes("oklch") ||
                  styles.borderColor?.includes("color-mix") ||
                  styles.borderColor?.includes("lab")
                ) {
                  el.style.borderColor = darkMode ? "#374151" : "#e5e7eb";
                }
              }
            }
          });

          clonedDoc.body.style.transform = "scale(1)";
          clonedDoc.body.style.transformOrigin = "top left";
          clonedDoc.body.style.width = element.scrollWidth + "px";
          clonedDoc.body.style.height = element.scrollHeight + "px";
        },
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add header
      pdf.setFontSize(18);
      pdf.text("Financial Dashboard Report", pdfWidth / 2, 20, {
        align: "center",
      });

      pdf.setFontSize(10);
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      pdf.text(`Generated: ${currentDate}`, pdfWidth / 2, 28, {
        align: "center",
      });
      pdf.text(`Period: ${activeTimeRange}`, pdfWidth / 2, 34, {
        align: "center",
      });

      // Add dashboard image
      const startY = 40;
      const availableHeight = pdfHeight - startY - 10;

      if (imgHeight <= availableHeight) {
        // Single page
        pdf.addImage(imgData, "PNG", 0, startY, imgWidth, imgHeight);
      } else {
        // Multiple pages for long dashboards
        let currentHeight = imgHeight;
        let sourceY = 0;
        let pageCount = 0;

        while (currentHeight > 0) {
          if (pageCount > 0) {
            pdf.addPage();
          }

          const pageImageHeight = Math.min(currentHeight, availableHeight);

          // Create temporary canvas for this page section
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          tempCanvas.width = canvas.width;
          tempCanvas.height = (pageImageHeight * canvas.width) / imgWidth;

          if (tempCtx) {
            tempCtx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              tempCanvas.height,
              0,
              0,
              canvas.width,
              tempCanvas.height
            );

            const tempImgData = tempCanvas.toDataURL("image/png", 0.95);
            pdf.addImage(
              tempImgData,
              "PNG",
              0,
              startY,
              imgWidth,
              pageImageHeight
            );
          }

          currentHeight -= availableHeight;
          sourceY += (availableHeight * canvas.width) / imgWidth;
          pageCount++;
        }
      }

      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-")
        .replace("T", "_");
      const filename = `financial-dashboard-${activeTimeRange
        .toLowerCase()
        .replace(/\s+/g, "-")}-${timestamp}.pdf`;

      pdf.save(filename);

      // Cleanup
      const styleElement = document.getElementById("pdf-style-override");
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    } catch (error: unknown) {
      console.error("PDF Generation Error:", error);

      let errorMsg = "PDF generation failed. ";
      if (error instanceof Error) {
        if (error.message.includes("load PDF libraries")) {
          errorMsg += "Please refresh the page and try again.";
        } else if (
          error.message.includes("oklch") ||
          error.message.includes("color function")
        ) {
          errorMsg +=
            "Color compatibility issue detected. Using browser print instead.";
          window.print();
          return;
        } else {
          errorMsg += "Please try again or use browser print (Ctrl+P).";
        }
      }

      if (
        confirm(errorMsg + "\n\nWould you like to use browser print instead?")
      ) {
        window.print();
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const theme = darkMode ? "dark" : "";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Navigation */}
      <nav
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-b px-4 py-3`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">FinDash</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Enhanced PDF Export Button */}
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF || loading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 
                ${
                  isGeneratingPDF || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-700"
                } bg-green-600 text-white text-sm font-medium shadow-sm hover:shadow-md`}
            >
              <Download className="h-4 w-4" />
              <span>{isGeneratingPDF ? "Generating..." : "Export PDF"}</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md transition-colors ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <Bell className="h-5 w-5 cursor-pointer" />
            <User className="h-5 w-5 cursor-pointer" />
            <Menu className="h-5 w-5 cursor-pointer lg:hidden" />
          </div>
        </div>
      </nav>

      {/* Dashboard Content - Wrapped in ref for PDF capture */}
      <div ref={dashboardRef} className="max-w-7xl mx-auto px-4 py-6">
        {/* PDF Generation Loading Overlay */}
        {isGeneratingPDF && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-6 rounded-lg shadow-lg flex items-center space-x-4`}
            >
              <div
                className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                data-ignore-pdf
              ></div>
              <span className="text-lg font-medium">
                Generating PDF Report...
              </span>
            </div>
          </div>
        )}

        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AUM</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{aumData.value}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    aumData.isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  MoM {aumData.change}
                </span>
                <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>View Report</span>
                </button>
              </div>
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">SIP</h3>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{sipData.value}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    sipData.isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  MoM {sipData.change}
                </span>
                <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>View Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                  ${
                    activeTimeRange === range
                      ? "bg-blue-600 text-white shadow-md"
                      : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-4 rounded-lg shadow-sm`}
            >
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {card.title}
              </h4>
              <p className="text-xl font-bold mb-1">{card.value}</p>
              <p className="text-sm text-gray-400">{card.count} transactions</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Clients Bubble Chart */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-sm col-span-1`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Clients Distribution
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                  data-ignore-pdf
                ></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart data={clientsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                  <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                      color: darkMode ? "#f9fafb" : "#111827",
                    }}
                  />
                  <Scatter dataKey="z" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* SIP Business Chart */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-sm col-span-1`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              SIP Business
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                  data-ignore-pdf
                ></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={sipBusinessData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={darkMode ? "#9ca3af" : "#6b7280"}
                  />
                  <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                      color: darkMode ? "#f9fafb" : "#111827",
                    }}
                  />
                  <Bar dataKey="sip" fill="#3b82f6" />
                  <Line
                    type="monotone"
                    dataKey="business"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Monthly MIS Chart */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-sm col-span-1 lg:col-span-2 xl:col-span-1`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Monthly MIS
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                  data-ignore-pdf
                ></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyMisData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={darkMode ? "#9ca3af" : "#6b7280"}
                  />
                  <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                      color: darkMode ? "#f9fafb" : "#111827",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mutual"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="insurance"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="assets"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Additional Info Panel */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-sm mt-6`}
        >
          <h3 className="text-lg font-semibold mb-4">Dashboard Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">
                Current Period: {activeTimeRange}
              </p>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Data refreshed automatically
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Total Transactions: 319</p>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Across all categories
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Success Rate: 94.2%</p>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Above industry average
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;

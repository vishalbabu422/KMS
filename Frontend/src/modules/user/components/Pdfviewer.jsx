import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

/* 🔹 Required worker config */
pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/* 🔹 Theme Configuration */
const THEMES = {
  light: {
    bg: "#f8f9fa",
    panel: "#ffffff",
    border: "#dee2e6",
    text: "#212529",
    thumbActive: "#e9ecef",
    headerBg: "#ffffff",
    buttonBorder: "#212529",
    buttonText: "#212529",
    buttonDisabled: "#adb5bd"
  },
  dark: {
    bg: "#1e1e1e",
    panel: "#2b2b2b",
    border: "#3c3c3c",
    text: "#f1f1f1",
    thumbActive: "#3a3a3a",
    headerBg: "#252526",
    buttonBorder: "#f1f1f1",
    buttonText: "#f1f1f1",
    buttonDisabled: "#6c757d"
  },
  teal: {
    bg: "#e6f4f3",
    panel: "#f0fbfa",
    border: "#9ad3cf",
    text: "#0f4c4a",
    thumbActive: "#c7ebe8",
    headerBg: "#e0f2f1",
    buttonBorder: "#0f4c4a",
    buttonText: "#0f4c4a",
    buttonDisabled: "#7aaead"
  }
};

const PdfViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [scale, setScale] = useState(1.0); // ✅ DEFAULT 100%
  const [theme, setTheme] = useState("light");
  const [showThumbs, setShowThumbs] = useState(true);

  const t = THEMES[theme];

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPageInput("1");
  };

  const jumpToPage = () => {
    const page = Number(pageInput);
    if (!numPages) return;

    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    } else {
      setPageInput(String(pageNumber));
    }
  };

  /* 🔹 Reusable themed button */
  const ThemedButton = ({ onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn btn-sm me-1 d-flex"
      style={{
        border: `1px solid ${t.buttonBorder}`,
        color: disabled ? t.buttonDisabled : t.buttonText,
        background: "transparent",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer"
      }}
    >
      {children}
    </button>
  );

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file;
    link.download = "document.pdf";
    link.click();
  };

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = file;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow.print();
  };

  return (
    <div style={{ width: "100%", color: t.text }}>

      {/* 🔹 HEADER / TOOLBAR */}
      <div
        className="d-none d-md-flex justify-content-between align-items-center mb-2 px-2 py-2"
        style={{
          background: t.headerBg,
          border: `1px solid ${t.border}`,
          borderRadius: "4px"
        }}
      >
        {/* Prev / Next + Page Jump */}
        <div className="d-flex align-items-center">
          <ThemedButton
            disabled={pageNumber <= 1}
            onClick={() => {
              setPageNumber(p => p - 1);
              setPageInput(String(pageNumber - 1));
            }}
          >
            ◀<span className="d-none d-xl-flex">Prev</span> 
          </ThemedButton>

          <input
            type="text"
            value={pageInput}
            onChange={e => setPageInput(e.target.value.replace(/\D/g, ""))}
            onBlur={jumpToPage}
            onKeyDown={e => e.key === "Enter" && jumpToPage()}
            style={{
              width: "40px",
              textAlign: "center",
              margin: "0 4px",
              border: `1px solid ${t.border}`,
              background: t.panel,
              color: t.text,
              borderRadius: "4px"
            }}
          />

          <span className="mx-1">/ {numPages || "-"}</span>

          <ThemedButton
            disabled={pageNumber >= numPages}
            onClick={() => {
              setPageNumber(p => p + 1);
              setPageInput(String(pageNumber + 1));
            }}
          >
            <span className="d-none d-xl-flex">Next</span> ▶
          </ThemedButton>
        </div>

        {/* Zoom */}
        <div className="d-flex align-items-center">
          <ThemedButton onClick={() => setScale(s => Math.max(0.6, s - 0.1))}>
            −
          </ThemedButton>
          <span className="mx-2">{Math.round(scale * 100)}%</span>
          <ThemedButton onClick={() => setScale(s => Math.min(2.5, s + 0.1))}>
            +
          </ThemedButton>
        </div>

        {/* Theme */}
        <div className="d-none">
          <select
            className="form-select form-select-sm"
            value={theme}
            onChange={e => setTheme(e.target.value)}
            style={{
              background: t.panel,
              color: t.text,
              border: `1px solid ${t.border}`
            }}
          >
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="teal">🌿 Teal</option>
          </select>
        </div>

        {/* Actions */}
        <div className="d-flex">
          <ThemedButton onClick={handleDownload}>⬇<span className="d-none d-xl-block">Download</span></ThemedButton>
          <ThemedButton onClick={handlePrint}>🖨<span className="d-none d-xl-block">Print</span></ThemedButton>
        </div>
      </div>

      {/* 🔹 PDF AREA */}
      <div
        style={{
          height: "680px",
          display: "flex",
          border: `1px solid ${t.border}`,
          background: t.bg
        }}
      >
        {/* Thumbnails */}
        <div
          style={{
            width: showThumbs ? "120px" : "0px",
            transition: "width 0.3s ease",
            overflowY: "auto",
            overflowX: "hidden",
            borderRight: showThumbs ? `1px solid ${t.border}` : "none",
            background: t.panel
          }}
        >
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages || 0)).map((_, index) => (
              <div
                key={index}
                onClick={() => {
                  setPageNumber(index + 1);
                  setPageInput(String(index + 1));
                }}
                style={{
                  padding: "6px",
                  cursor: "pointer",
                  background:
                    pageNumber === index + 1 ? t.thumbActive : "transparent"
                }}
              >
                <Page
                  pageNumber={index + 1}
                  width={95}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>

        {/* Collapse / Expand Icon */}
        <div
          onClick={() => setShowThumbs(v => !v)}
          style={{
            width: "18px",
            cursor: "pointer",
            background: t.panel,
            borderRight: `1px solid ${t.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none"
          }}
        >
          {showThumbs ? "❮" : "❯"}
        </div>

        {/* Main Viewer */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            background: t.bg
          }}
        >
          <Document file={file}>
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;

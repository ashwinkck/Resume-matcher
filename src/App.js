import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// Removed the direct imports for jspdf and html2canvas, as they will be loaded from a CDN.

// All styles are embedded here to ensure compilation and include new styles for all features.
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --primary-color: #ef4444;
      --primary-hover: #dc2626;
      --percentage-color: #3b82f6;
      --strengths-color: #22c55e;
      --weakness-color: #f97316;
      --suggestion-color: #8b5cf6;
      --background-color: #000000;
      --card-background: #111111;
      --text-primary: #f9fafb;
      --text-secondary: #a1a1aa;
      --border-color: #3f3f46;
      --input-bg: #18181b;
    }

    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background-color: var(--background-color);
      color: var(--text-primary);
    }

    /* --- SPLASH SCREEN STYLES --- */
    .splash-screen {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-color: #000000; display: flex; align-items: center; justify-content: center; z-index: 1000;
      animation: fadeOut 1s ease-out 1.5s forwards;
    }
    .splash-screen img {
      width: 150px; animation: zoomIn 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }
    @keyframes zoomIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; visibility: hidden; } }

    /* --- MAIN APP STYLES --- */
    .app-wrapper {
      opacity: 0; animation: fadeInApp 0.5s ease-in 2.5s forwards;
    }
    @keyframes fadeInApp { from { opacity: 0; } to { opacity: 1; } }

    .app-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 2rem 1rem; min-height: 100vh; box-sizing: border-box;
    }

    .card {
      background-color: var(--card-background); border-radius: 1.5rem; border: 1px solid var(--border-color);
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.1); padding: 2.5rem; width: 100%; max-width: 700px;
      box-sizing: border-box; transition: all 0.3s ease-in-out;
    }

    .logo-container {
      margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center;
    }
    .logo-container img { max-width: 120px; height: auto; }

    .header { text-align: center; margin-bottom: 2rem; }
    .header h1 { font-size: 2.25rem; font-weight: 700; margin: 0; }
    .header p { margin-top: 0.5rem; font-size: 1rem; color: var(--text-secondary); }

    .form-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .input-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; }

    textarea {
      width: 100%; padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid var(--border-color);
      background-color: var(--input-bg); color: var(--text-primary); font-family: 'Inter', sans-serif;
      font-size: 1rem; box-sizing: border-box; min-height: 120px;
    }
    textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3); }

    .file-drop-zone {
      border: 2px dashed var(--border-color); border-radius: 0.75rem; padding: 2rem; text-align: center;
      cursor: pointer; transition: border-color 0.3s, background-color 0.3s; background-color: var(--input-bg);
    }
    .file-drop-zone.drag-over { border-color: var(--primary-color); background-color: rgba(239, 68, 68, 0.1); }
    .upload-prompt { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--text-secondary); }
    .upload-icon { color: var(--primary-color); margin-bottom: 0.5rem; }
    .file-name { color: var(--primary-color); font-weight: 600; }

    .submit-btn {
      display: flex; align-items: center; justify-content: center; gap: 0.75rem; width: 100%;
      padding: 0.875rem 1.5rem; font-size: 1rem; font-weight: 600; color: #ffffff;
      background-color: var(--primary-color); border: none; border-radius: 0.75rem; cursor: pointer;
      transition: all 0.3s ease;
    }
    .submit-btn:hover:not(:disabled) { background-color: var(--primary-hover); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2); }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spinner-icon { animation: spin 1s linear infinite; }

    /* --- NEW FEATURE STYLES --- */
    .results-container { width: 100%; max-width: 700px; margin-top: 2rem; }
    .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .results-header h2 { font-size: 1.75rem; color: var(--text-primary); margin: 0; }
    .download-btn {
      background-color: var(--input-bg); border: 1px solid var(--border-color); color: var(--text-secondary);
      padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s;
    }
    .download-btn:hover:not([disabled]) { background-color: var(--border-color); color: var(--text-primary); }
    .download-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .result-section {
        background-color: var(--card-background); border: 1px solid var(--border-color);
        border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem;
    }
    .result-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .result-section-title { display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem; font-weight: 600; }
    .result-section-title svg { width: 24px; height: 24px; }
    .result-section-body { color: var(--text-secondary); line-height: 1.6; white-space: pre-wrap; }
    
    .copy-btn {
      background-color: transparent; border: 1px solid var(--border-color); color: var(--text-secondary);
      padding: 0.25rem 0.75rem; font-size: 0.8rem; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s;
    }
    .copy-btn:hover { background-color: var(--border-color); color: var(--text-primary); }

    /* Color coding for sections */
    .percentage-card .result-section-title { color: var(--percentage-color); }
    .strengths-card .result-section-title { color: var(--strengths-color); }
    .weakness-card .result-section-title { color: var(--weakness-color); }
    .suggestion-card .result-section-title { color: var(--suggestion-color); }
    .percentage-value { font-size: 1.5rem; font-weight: 700; color: var(--percentage-color); }

    .error-box {
      display: flex; justify-content: space-between; align-items: center; background-color: var(--error-bg);
      color: var(--error-text); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;
      border: 1px solid #b91c1c;
    }
    .error-box p { margin: 0; font-weight: 500; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--error-text); }

    @media (max-width: 640px) {
      .app-container { padding: 1rem; }
      .header h1 { font-size: 1.75rem; }
      .card { padding: 1.5rem; }
    }
  `}</style>
);

// --- HELPER ICONS ---
const IconTarget = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-5c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z"/></svg>);
const IconTrendingUp = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>);
const IconTrendingDown = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6h-6z"/></svg>);
const IconLightbulb = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.686 2 6 4.686 6 8c0 2.481 1.489 4.635 3.656 5.512V15H8v2h8v-2h-1.656v-1.488C16.511 12.635 18 10.481 18 8c0-3.314-2.686-6-6-6zm0 2c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4zm-1 14h2v4h-2v-4z"/></svg>);

// --- MAIN APP COMPONENT ---
function App() {
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [pdfScriptsLoaded, setPdfScriptsLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const reportRef = useRef(null);

  // --- UPDATED: SCRIPT LOADING LOGIC ---
  useEffect(() => {
    // Load PDF generation scripts from a CDN
    const scripts = [
      { id: 'jspdf', src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js' },
      { id: 'html2canvas', src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js' }
    ];

    let loadedCount = 0;
    
    scripts.forEach(({ id, src }) => {
        if (document.getElementById(id)) {
            loadedCount++;
            if (loadedCount === scripts.length) setPdfScriptsLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = () => {
            loadedCount++;
            if (loadedCount === scripts.length) {
                setPdfScriptsLoaded(true);
            }
        };
        document.body.appendChild(script);
    });

    const splashTimer = setTimeout(() => setIsSplashDone(true), 2500);
    return () => clearTimeout(splashTimer);
  }, []);

  const parseAIResult = (text) => {
    const cleanedText = text.replace(/\*\*/g, '').replace(/^\s*\d+\.\s*/gm, '');
    const sections = {
      percentage: 'N/A',
      strengths: 'Not found.',
      weakness: 'Not found.',
      suggestions: 'Not found.'
    };
    const percentageMatch = cleanedText.match(/Match Percentage:\s*(\d+%)/);
    if (percentageMatch) sections.percentage = percentageMatch[1];
    const strengthsMatch = cleanedText.match(/Key Strengths:\s*([\s\S]*?)(?=Weak Areas:|Smart Suggestions:|$)/);
    if (strengthsMatch) sections.strengths = strengthsMatch[1].trim();
    const weaknessMatch = cleanedText.match(/Weak Areas:\s*([\s\S]*?)(?=Smart Suggestions:|$)/);
    if (weaknessMatch) sections.weakness = weaknessMatch[1].trim();
    const suggestionsMatch = cleanedText.match(/Smart Suggestions:\s*([\s\S]*?)$/);
    if (suggestionsMatch) sections.suggestions = suggestionsMatch[1].trim();
    return sections;
  };
  
  const copyToClipboard = (textToCopy) => {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };
  
  // --- UPDATED: PDF DOWNLOAD LOGIC ---
  const handleDownloadPdf = () => {
    if (!pdfScriptsLoaded) {
        console.error("PDF generation scripts not loaded yet.");
        return;
    }
    const reportElement = reportRef.current;
    const { jsPDF } = window.jspdf; // Access the library from the window object
    
    if (reportElement) {
        window.html2canvas(reportElement, { backgroundColor: '#111111' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('resume-match-report.pdf');
        });
    }
  };


  const handleSubmit = async () => {
    if (!resume || !jd) {
      setError("Please upload a resume and enter a job description.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError('');
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jd", jd);
    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const parsedResult = parseAIResult(response.data.result);
      setResult(parsedResult);
    } catch (err) {
      console.error(err);
      setError("Failed to get a response from the backend.");
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setError('');
    } else {
      setResume(null);
      setError('Please upload a valid PDF file.');
    }
  };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); handleFileChange({ target: e.dataTransfer }); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <>
      <Styles />
      {!isSplashDone && (
        <div className="splash-screen">
          <img src="/sycamore.jpg" alt="Logo" />
        </div>
      )}
      
      <div className="app-wrapper" style={{ visibility: isSplashDone ? 'visible' : 'hidden' }}>
        <div className="app-container">
          <div className="card">
            <div className="header">
              <div className="logo-container">
                <img src="/sycamore.jpg" alt="Logo" />
              </div>
              <h1>AI Resume Matcher</h1>
              <p>Upload a resume and job description to see the match score.</p>
            </div>
            {error && (
              <div className="error-box"><p>{error}</p><button onClick={() => setError('')} className="close-btn">&times;</button></div>
            )}
            <div className="form-container">
              <div className="input-group">
                <label>Job Description</label>
                <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={8} placeholder="Paste the job description here..."/>
              </div>
              <div className="input-group">
                <label>Upload Resume (PDF only)</label>
                <div className="file-drop-zone" onClick={() => fileInputRef.current.click()} onDrop={handleDrop} onDragOver={handleDragOver}>
                  <input type="file" accept=".pdf" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }}/>
                  {resume ? (<p className="file-name">Selected: {resume.name}</p>) : (<div className="upload-prompt"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="upload-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><p>Drag & Drop PDF here</p></div>)}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="submit-btn">{loading ? <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="spinner-icon"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"/></svg> : '🎯 Match Resume'}{loading && <span>Matching...</span>}</button>
            </div>
          </div>

          {result && !loading && (
            <div className="results-container" ref={reportRef}>
              <div className="results-header">
                <h2>Match Report</h2>
                <button onClick={handleDownloadPdf} className="download-btn" disabled={!pdfScriptsLoaded}>
                  {pdfScriptsLoaded ? 'Download PDF' : 'Loading...'}
                </button>
              </div>
              
              <div className="result-section percentage-card">
                <div className="result-section-header">
                  <span className="result-section-title"><IconTarget/> Match Percentage</span>
                </div>
                <div className="result-section-body">
                  <span className="percentage-value">{result.percentage}</span>
                </div>
              </div>

              <div className="result-section strengths-card">
                <div className="result-section-header">
                  <span className="result-section-title"><IconTrendingUp/> Key Strengths</span>
                  <button onClick={() => copyToClipboard(result.strengths)} className="copy-btn">Copy</button>
                </div>
                <div className="result-section-body">{result.strengths}</div>
              </div>

              <div className="result-section weakness-card">
                <div className="result-section-header">
                  <span className="result-section-title"><IconTrendingDown/> Weak Areas</span>
                  <button onClick={() => copyToClipboard(result.weakness)} className="copy-btn">Copy</button>
                </div>
                <div className="result-section-body">{result.weakness}</div>
              </div>

              <div className="result-section suggestion-card">
                <div className="result-section-header">
                  <span className="result-section-title"><IconLightbulb/> Smart Suggestions</span>
                  <button onClick={() => copyToClipboard(result.suggestions)} className="copy-btn">Copy</button>
                </div>
                <div className="result-section-body">{result.suggestions}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

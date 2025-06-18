import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// All necessary styles, including the new splash screen animations, are embedded here.
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --primary-color: #ef4444;
      --primary-hover: #dc2626;
      --percentage-color: #3b82f6;
      --background-color: #000000;
      --card-background: #000000;
      --text-primary: #f9fafb;
      --text-secondary: #a1a1aa;
      --border-color: #3f3f46;
      --input-bg: #18181b;
      --error-bg: #450a0a;
      --error-text: #fecaca;
      --success-bg: #166534;
    }

    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background-color: var(--background-color);
      color: var(--text-primary);
    }

    /* --- SPLASH SCREEN STYLES --- */
    .splash-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeOut 1s ease-out 1.5s forwards; /* Fade out after 1.5s */
    }

    .splash-screen img {
      width: 150px; /* Initial size of the logo */
      animation: zoomIn 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; /* Zoom in animation */
    }

    @keyframes zoomIn {
      from {
        transform: scale(0.5);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
        visibility: hidden; /* Hide the element after animation */
      }
    }


    /* --- MAIN APP STYLES --- */
    .app-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      min-height: 100vh;
      box-sizing: border-box;
      /* Starts hidden and fades in */
      opacity: 0;
      animation: fadeInApp 0.5s ease-in 2.5s forwards;
    }
    
    @keyframes fadeInApp {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }


    .card {
      background-color: var(--card-background);
      border-radius: 0;
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.1);
      padding: 2.5rem;
      width: 100%;
      max-width: 650px;
      box-sizing: border-box;
      transition: all 0.3s ease-in-out;
    }

    .logo-container {
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-container img {
      max-width: 120px;
      height: auto;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2.25rem;
      font-weight: 700;
      margin: 0;
    }

    .header p {
      margin-top: 0.5rem;
      font-size: 1rem;
      color: var(--text-secondary);
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .input-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
      background-color: var(--input-bg);
      color: var(--text-primary);
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      box-sizing: border-box;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
    }

    .file-drop-zone {
      border: 2px dashed var(--border-color);
      border-radius: 0.75rem;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.3s, background-color 0.3s;
      background-color: var(--input-bg);
    }

    .file-drop-zone.drag-over {
      border-color: var(--primary-color);
      background-color: rgba(239, 68, 68, 0.1);
    }

    .upload-prompt {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
    }

    .upload-icon {
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    .file-name {
      color: var(--primary-color);
      font-weight: 600;
    }

    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: #ffffff;
      background-color: var(--primary-color);
      border: none;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      background-color: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .spinner-icon {
      animation: spin 1s linear infinite;
    }

    .result-card {
      margin-top: 2rem;
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.15);
      background-color: var(--card-background);
      border-radius: 0;
    }

    .result-card h2 {
      text-align: center;
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
      color: var(--primary-color);
    }

    .result-box {
      background-color: #111111;
      color: #e5e7eb;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
      white-space: pre-line;
      word-wrap: break-word;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      border: 1px solid var(--border-color);
    }
    
    .result-box .keyword {
      background-color: var(--primary-color);
      color: #ffffff;
      padding: 0.15rem 0.6rem;
      border-radius: 0.375rem;
      font-weight: 600;
    }

    .result-box .percentage {
      color: var(--percentage-color);
      font-weight: 700;
    }

    .error-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--error-bg);
      color: var(--error-text);
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid #b91c1c;
    }

    .error-box p {
      margin: 0;
      font-weight: 500;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--error-text);
    }

    @media (max-width: 640px) {
      .app-container { padding: 1rem; }
      .header h1 { font-size: 1.75rem; }
      .card { padding: 1.5rem; border-radius: 0; }
      .result-card { padding: 1.5rem; border-radius: 0; }
    }
  `}</style>
);

// This component handles keyword formatting.
const FormattedResult = ({ text }) => {
  const cleanedText = text.replace(/\d+\.\s/g, '').replace(/\*\*/g, '');
  const keywords = ["Match Percentage:", "Key Strengths:", "Weak Areas:", "Smart Suggestions:"];
  const masterRegex = new RegExp(`(${keywords.join('|')}|\\d+%)`, 'g');
  const parts = cleanedText.split(masterRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        if (/^\d+%$/.test(part.trim())) {
          return <strong key={index} className="percentage">{part}</strong>;
        }
        if (keywords.includes(part)) {
          if (part === "Match Percentage:") {
            return <strong key={index} className="keyword">{part}</strong>;
          }
          return (
            <React.Fragment key={index}>
              <br /><strong className="keyword">{part}</strong><br />
            </React.Fragment>
          );
        }
        return part;
      })}
    </>
  );
};

// This component handles the typing animation.
const TypingResult = ({ fullText }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); 
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(prev => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 10);

    return () => clearInterval(intervalId); 
  }, [fullText]);

  return <FormattedResult text={displayedText} />;
};

function App() {
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSplashDone, setIsSplashDone] = useState(false); // State to control the splash screen
  const fileInputRef = useRef(null);
  
  // This effect runs once when the app loads to control the splash screen duration.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashDone(true);
    }, 2500); // The splash screen will be visible for 2.5 seconds

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setError('');
    } else {
      setResume(null);
      setError('Please upload a valid PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleSubmit = async () => {
    if (!resume || !jd) {
      setError("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    setResult('');
    setError('');

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jd", jd);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(response.data.result);
    } catch (error) {
      console.error(error);
      setError("Failed to get a response from the backend. Please ensure it's running and accessible.");
    }
    setLoading(false);
  };

  return (
    <>
      <Styles />

      {/* --- NEW SPLASH SCREEN LOGIC --- */}
      {!isSplashDone && (
        <div className="splash-screen">
          <img src="/sycamore.jpg" alt="Sycamore Logo" />
        </div>
      )}
      
      {/* The main app container is now controlled by the splash screen state */}
      <div className="app-container" style={{ visibility: isSplashDone ? 'visible' : 'hidden' }}>
        <div className="card">
          <div className="header">
            <div className="logo-container">
              <img src="/sycamore.jpg" alt="My Company Logo" />
            </div>
            <h1>AI Resume Matcher</h1>
            <p>Upload a resume and job description to see the match score.</p>
          </div>

          {error && (
            <div className="error-box">
              <p>{error}</p>
              <button onClick={() => setError('')} className="close-btn">&times;</button>
            </div>
          )}

          <div className="form-container">
            <div className="input-group">
              <label>Job Description</label>
              <textarea 
                value={jd} 
                onChange={(e) => setJd(e.target.value)} 
                rows={8}
                placeholder="Paste the job description here..."
              />
            </div>

            <div className="input-group">
              <label>Upload Resume (PDF only)</label>
              <div 
                className="file-drop-zone" 
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                {resume ? (
                  <p className="file-name">Selected: {resume.name}</p>
                ) : (
                  <div className="upload-prompt">
                    <UploadIcon />
                    <p>Drag & Drop PDF here, or click to select file</p>
                  </div>
                )}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="submit-btn">
              {loading ? <SpinnerIcon /> : '🎯 Match Resume'}
              {loading && <span>Matching...</span>}
            </button>
          </div>
        </div>

        {result && !loading && (
          <div className="card result-card">
            <h2>Match Result</h2>
            <div className="result-box">
              <TypingResult fullText={result} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Helper Components
const SpinnerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
    className="spinner-icon"
  >
    <path
      d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
      opacity=".25"
    />
    <path
      d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
    />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default App;

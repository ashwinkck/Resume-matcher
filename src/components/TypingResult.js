import React, { useState, useEffect } from 'react';

// This is a helper component to format the text after it has been "typed".
// It is kept inside this file because it is only used by TypingResult.
const FormattedResult = ({ text }) => {
  // First, clean the text of any Markdown asterisks.
  const cleanedText = text.replace(/\*\*/g, '');

  const keywords = [
    "Match Percentage:", 
    "Key Strengths:", 
    "Weak Areas:", 
    "Smart Suggestions:"
  ];

  // This regular expression finds all the patterns we want to style.
  const masterRegex = new RegExp(`(${keywords.join('|')}|\\d+\\.|\\d+%)`, 'g');
  
  // Split the text by the patterns.
  const parts = cleanedText.split(masterRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        // Find and style the percentage value with a "percentage" class.
        if (/^\d+%$/.test(part.trim())) {
          return <strong key={index} className="percentage">{part}</strong>;
        }
        
        // Find and style the main keywords.
        if (keywords.includes(part)) {
          // If it's the percentage line, don't add a line break.
          if (part === "Match Percentage:") {
            return <strong key={index} className="keyword">{part}</strong>;
          }
          // For all other keywords, add line breaks before and after.
          return (
            <React.Fragment key={index}>
              <br /><strong className="keyword">{part}</strong><br />
            </React.Fragment>
          );
        }

        // Find and style the numbered points.
        if (/^\d+\.$/.test(part.trim())) {
          return <strong key={index} className="keyword">{part}</strong>;
        }

        // Return any normal text.
        return part;
      })}
    </>
  );
};

// This is the main component that creates the typing animation.
const TypingResult = ({ fullText }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Reset the text each time a new result arrives.
    setDisplayedText(''); 
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(prev => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 20); // Adjust typing speed here (lower is faster)

    // Clean up the interval when the component is removed.
    return () => clearInterval(intervalId); 
  }, [fullText]);

  // The FormattedResult component is used to style the text as it's being typed.
  return <FormattedResult text={displayedText} />;
};

export default TypingResult;

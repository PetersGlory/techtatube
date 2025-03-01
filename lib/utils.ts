import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Function to parse the script content
export const parseScriptContent = (content: string) => {
  const sections = [];
  const lines = content.split('\n');
  
  let currentSection = null;
  let currentVisual = '';
  let currentNarration = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Title extraction (first line with ## is the title)
    if (line.startsWith('##') && sections.length === 0) {
      continue; // Skip the title as we already have it in the JSON
    }
    
    // New section detection
    if (line.startsWith('**(') && line.includes(')') && !line.startsWith('**(Visual:')) {
      // If we were processing a section, add it to the array
      if (currentSection) {
        sections.push({
          name: currentSection,
          visual: currentVisual.trim(),
          narration: currentNarration.trim()
        });
      }
      
      // Start a new section
      currentSection = line.replace(/\*\*/g, '').trim();
      currentVisual = '';
      currentNarration = '';
    } 
    // Visual cue detection
    else if (line.startsWith('**(Visual:')) {
      currentVisual = line.replace(/\*\*\(Visual:/g, '').replace(/\)\*\*/g, '').trim();
    } 
    // Narrator line detection
    else if (line.startsWith('**Narrator:')) {
      currentNarration = line.replace(/\*\*Narrator:/g, '').trim();
    }
    // If we're already in a narration section, append to it
    else if (currentSection && currentVisual && currentNarration) {
      currentNarration += ' ' + line;
    }
  }
  
  // Add the last section
  if (currentSection) {
    sections.push({
      name: currentSection,
      visual: currentVisual.trim(),
      narration: currentNarration.trim()
    });
  }
  
  return sections;
};
  
  // Extract title from content (the first line that starts with ##)
  export const getScriptTitle = (content: string, title: any) => {
    const firstLine = content.split('\n').find((line: string) => line.trim().startsWith('##'));
    if (firstLine) {
      return firstLine.replace(/##/g, '').trim();
    }
    return firstLine || title || "YouTube Script";
  };
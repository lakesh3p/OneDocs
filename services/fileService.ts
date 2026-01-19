import { FileHandle } from '../types';

// Helper to check if we are running in an iframe (likely cross-origin)
// where File System Access API triggers security errors.
const isRestrictedEnvironment = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export const downloadBlob = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const saveToLocalSystem = async (content: string, handle: FileHandle, type: 'docx' | 'html' | 'md' = 'html'): Promise<FileHandle> => {
  // Try Modern API if available and NOT in a restricted frame
  if ('showSaveFilePicker' in window && !isRestrictedEnvironment()) {
    try {
      const options = {
        types: [
          {
            description: 'Word Document',
            accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
          },
          {
            description: 'HTML Document',
            accept: { 'text/html': ['.html', '.htm'] },
          },
          {
            description: 'Markdown File',
            accept: { 'text/markdown': ['.md'] },
          },
          {
            description: 'Text File',
            accept: { 'text/plain': ['.txt'] },
          }
        ],
      };
      
      // If we already have a handle, use it; otherwise open picker
      const fileHandle = handle || await window.showSaveFilePicker!(options);
      const writable = await fileHandle.createWritable();
      
      if (fileHandle.name.endsWith('.docx')) {
        const fullHtml = `
          <!DOCTYPE html>
          <html>
            <head><meta charset="utf-8"><title>Document</title></head>
            <body>${content}</body>
          </html>
        `;
        if (window.htmlDocx) {
          const converted = window.htmlDocx.asBlob(fullHtml);
          await writable.write(converted);
        } else {
          await writable.write(content);
        }
      } else if (fileHandle.name.endsWith('.md')) {
        if (window.TurndownService) {
           const turndownService = new window.TurndownService();
           const markdown = turndownService.turndown(content);
           await writable.write(markdown);
        } else {
           await writable.write(content);
        }
      } else {
        await writable.write(content);
      }
      
      await writable.close();
      return fileHandle;
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return handle; 
      }
      console.warn('File System Access API failed (likely context restriction), using fallback.', err);
    }
  }

  // Fallback Logic
  if (type === 'docx') {
     const fullHtml = `<!DOCTYPE html><html><body>${content}</body></html>`;
     if (window.htmlDocx) {
        const converted = window.htmlDocx.asBlob(fullHtml);
        const url = URL.createObjectURL(converted);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
     }
  } else if (type === 'md') {
      if (window.TurndownService) {
          const turndownService = new window.TurndownService();
          const markdown = turndownService.turndown(content);
          downloadBlob(markdown, 'document.md', 'text/markdown');
      }
  } else {
     downloadBlob(content, 'document.html', 'text/html');
  }
  return null;
};

export const openFromLocalSystem = async (): Promise<{ content: string; handle: FileHandle; name: string } | null> => {
  if ('showOpenFilePicker' in window && !isRestrictedEnvironment()) {
    try {
      const [fileHandle] = await window.showOpenFilePicker!({
        types: [
          {
            description: 'All Supported',
            accept: {
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'text/html': ['.html', '.htm'],
              'text/markdown': ['.md'],
              'text/plain': ['.txt'],
            },
          },
        ],
        multiple: false,
      });
      
      const file = await fileHandle.getFile();
      let content = '';
      
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        if (window.mammoth) {
          const result = await window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
          content = result.value;
        }
      } else if (file.name.endsWith('.md')) {
         const text = await file.text();
         if (window.marked) {
             content = window.marked.parse(text);
         } else {
             content = `<pre>${text}</pre>`;
         }
      } else {
        content = await file.text();
      }

      return { content, handle: fileHandle, name: file.name };
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return null;
      }
      console.warn('File System Access API failed (likely context restriction), using fallback.', err);
    }
  }

  // Legacy Fallback
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx,.html,.htm,.txt,.md';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        let content = '';
        if (file.name.endsWith('.docx')) {
             const arrayBuffer = await file.arrayBuffer();
             if (window.mammoth) {
                const result = await window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                content = result.value;
             }
        } else if (file.name.endsWith('.md')) {
            const text = await file.text();
            if (window.marked) {
                content = window.marked.parse(text);
            }
        } else {
             content = await file.text();
        }
        resolve({ content, handle: null, name: file.name });
      } else {
        resolve(null);
      }
    };
    input.click();
  });
};

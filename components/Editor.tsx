import React, { useRef, useEffect, useState } from 'react';
import { EditorConfig, Comment } from '../types';

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  config: EditorConfig;
  scale: number;
  comments: Comment[];
}

const A4_HEIGHT_PX = 1123;
const A4_WIDTH_PX = 794;

export const Editor: React.FC<EditorProps> = ({ content, onChange, config, scale, comments }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const isMounted = useRef(false);

  // Monitor content height to automatically add/remove pages
  useEffect(() => {
    if (!editorRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        // Calculate needed pages based on content height.
        // We use Math.ceil to ensure the container is always large enough for the text.
        const needed = Math.max(1, Math.ceil(height / A4_HEIGHT_PX));
        setPageCount(needed);
      }
    });

    observer.observe(editorRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync content from props (only if different to prevent cursor jumps)
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
       // Check to avoid overwriting user input during typing if the update came from parent re-render
       if (!isMounted.current || content !== '') {
         editorRef.current.innerHTML = content;
       }
    }
    isMounted.current = true;
  }, [content]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
  };

  return (
    <div 
      className="flex justify-center w-full bg-gray-100 dark:bg-gray-900 overflow-auto h-full scrollbar-thin relative"
      style={{ padding: '3rem 1rem' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          editorRef.current?.focus();
        }
      }}
    >
      <style>{`
        .editor-content table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        .editor-content td, .editor-content th { border: 1px solid #ccc; padding: 8px; }
        .editor-content img { max-width: 100%; height: auto; display: block; }
        .editor-content p { margin-bottom: 0.5em; min-height: 1em; }
        .editor-content ul, .editor-content ol { margin-left: 1.5em; }
        
        .comment-highlight {
            background-color: #fef08a;
            border-bottom: 2px solid #eab308;
            cursor: pointer;
        }
        .dark .comment-highlight {
            background-color: #854d0e;
            border-bottom: 2px solid #ca8a04;
        }
        
        /* Visual Page Break Line */
        .page-break-line {
            position: absolute;
            left: 0;
            width: 100%;
            height: 1px;
            border-bottom: 1px dashed #ccc;
            pointer-events: none;
            z-index: 5;
        }
        .dark .page-break-line {
            border-bottom: 1px dashed #4b5563;
        }
      `}</style>

      <div
        className="relative bg-white dark:bg-gray-800 shadow-xl transition-transform duration-200 ease-out"
        style={{
          width: `${A4_WIDTH_PX}px`,
          // Ensure container grows with pages
          minHeight: `${pageCount * A4_HEIGHT_PX}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Render Visual Page Breaks */}
        {Array.from({ length: pageCount - 1 }).map((_, i) => (
            <div 
                key={i}
                className="page-break-line"
                style={{ top: `${(i + 1) * A4_HEIGHT_PX}px` }}
            />
        ))}

        {/* Page Numbers Indicator */}
        <div className="absolute top-0 right-[-40px] h-full flex flex-col pointer-events-none">
             {Array.from({length: pageCount}).map((_, i) => (
                 <div 
                    key={i} 
                    className="text-[10px] text-gray-400 font-medium text-right pr-2"
                    style={{ height: `${A4_HEIGHT_PX}px`, paddingTop: `${A4_HEIGHT_PX - 30}px` }}
                 >
                    {i + 1}
                 </div>
             ))}
        </div>

        <div
          ref={editorRef}
          contentEditable
          spellCheck={config.spellCheck}
          className="editor-content outline-none"
          style={{
            minHeight: `${pageCount * A4_HEIGHT_PX}px`,
            padding: config.margins,
            fontSize: config.fontSize,
            fontFamily: config.fontFamily,
            lineHeight: config.lineSpacing || '1.5',
            color: config.theme === 'dark' ? '#f3f4f6' : '#1f2937',
            overflowWrap: 'break-word',
            wordWrap: 'break-word'
          }}
          onInput={handleInput}
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
};
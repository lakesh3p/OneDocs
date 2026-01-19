import React, { useState, useEffect, useRef } from 'react';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Dashboard } from './components/Dashboard';
import { EditorConfig, FileHandle, RecentFile, TabName, Template, Comment } from './types';
import { saveToLocalSystem, openFromLocalSystem } from './services/fileService';
import { TEMPLATES } from './constants';
import { ArrowLeft, X, Search, Eye, MessageSquare } from 'lucide-react';

const DEFAULT_CONFIG: EditorConfig = {
  fontFamily: 'Inter',
  fontSize: '11pt',
  margins: '1in',
  orientation: 'portrait',
  showRuler: true,
  showStatusBar: true,
  theme: 'system',
  viewMode: 'paginated',
  lineSpacing: '1.15',
  spellCheck: true,
  isFocusMode: false,
};

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [content, setContent] = useState<string>(TEMPLATES[0].content);
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [config, setConfig] = useState<EditorConfig>(DEFAULT_CONFIG);
  const [fileName, setFileName] = useState<string>('Untitled Document');
  const [fileHandle, setFileHandle] = useState<FileHandle>(null);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [systemFonts, setSystemFonts] = useState<string[]>([]);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [zoomScale, setZoomScale] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const recognitionRef = useRef<any>(null);

  // Load System Fonts
  useEffect(() => {
    const loadFonts = async () => {
      if ('queryLocalFonts' in window) {
        try {
          const fonts = await window.queryLocalFonts!();
          const fontList: string[] = [];
          for await (const font of fonts) {
            if (!fontList.includes(font.family)) {
              fontList.push(font.family);
            }
          }
          setSystemFonts(fontList.sort());
        } catch (e) {
          console.log('Font access denied or not supported');
        }
      }
    };
    loadFonts();
  }, []);

  // Theme Handling
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = config.theme === 'dark' || 
      (config.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [config.theme]);

  // Load Recent Files
  useEffect(() => {
    const saved = localStorage.getItem('onedocs_recent_files');
    if (saved) {
      try {
        setRecentFiles(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Update Stats
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, ' ');
    setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
    setCharCount(text.length);
  }, [content]);

  // Voice Typing
  const toggleRecording = () => {
    if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
    } else {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (Recognition) {
            const recognition = new Recognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onresult = (event: any) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                document.execCommand('insertText', false, transcript + ' ');
            };
            
            recognition.onend = () => setIsRecording(false);
            recognition.start();
            recognitionRef.current = recognition;
            setIsRecording(true);
        } else {
            alert('Speech recognition not supported in this browser.');
        }
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          const imgHtml = `<img src="${readerEvent.target?.result}" style="max-width: 100%; height: auto; display: inline-block;" />`;
          execCommand('insertHTML', imgHtml);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const insertTable = () => {
    const html = `
      <table style="width:100%; border-collapse: collapse; margin: 10px 0; border: 1px solid #ccc;">
        <tr><td style="border:1px solid #ccc; padding: 5px;">&nbsp;</td><td style="border:1px solid #ccc; padding: 5px;">&nbsp;</td></tr>
        <tr><td style="border:1px solid #ccc; padding: 5px;">&nbsp;</td><td style="border:1px solid #ccc; padding: 5px;">&nbsp;</td></tr>
      </table><br/>
    `;
    execCommand('insertHTML', html);
  };

  const addComment = () => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
          const id = Date.now().toString();
          const text = prompt('Add your comment:');
          if (text) {
              const span = document.createElement('span');
              span.className = 'comment-highlight';
              span.setAttribute('data-comment-id', id);
              
              // Wrap selection
              const range = selection.getRangeAt(0);
              range.surroundContents(span);
              
              setComments([...comments, {
                  id,
                  text,
                  timestamp: Date.now(),
                  author: 'User',
                  highlightId: id
              }]);
          }
      } else {
          alert('Please select text to comment on.');
      }
  };

  const addToRecent = (name: string, fileContent: string) => {
    const newFile: RecentFile = {
      id: Date.now().toString(),
      title: name,
      lastModified: Date.now(),
      content: fileContent
    };
    const updated = [newFile, ...recentFiles.filter(f => f.title !== name)].slice(0, 10);
    setRecentFiles(updated);
    localStorage.setItem('onedocs_recent_files', JSON.stringify(updated));
  };

  const handleSave = async (type: 'docx'|'html'|'md' = 'html') => {
    // If auto-saving or generic save, use existing handle type if docx
    let saveType = type;
    if (fileHandle && fileHandle.name.endsWith('.docx')) saveType = 'docx';
    if (fileHandle && fileHandle.name.endsWith('.md')) saveType = 'md';

    const handle = await saveToLocalSystem(content, fileHandle, saveType);
    if (handle) {
      setFileHandle(handle);
      setFileName(handle.name);
      addToRecent(handle.name, content);
    }
  };

  const handleOpen = async () => {
    const result = await openFromLocalSystem();
    if (result) {
      setContent(result.content);
      setFileHandle(result.handle);
      setFileName(result.name);
      addToRecent(result.name, result.content);
      setView('editor');
    }
  };

  const handleFindReplace = () => {
    if (!findText) return;
    if (window.find && window.find(findText, false, false, true, false, true, false)) {
        // found
    } else {
        alert('Text not found');
    }
  };

  const handleReplaceAll = () => {
      if(!findText) return;
      const regex = new RegExp(findText, 'g');
      const newContent = content.replace(regex, replaceText);
      setContent(newContent); 
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden font-sans">
      {view === 'dashboard' ? (
        <Dashboard 
          recentFiles={recentFiles}
          onOpenRecent={(file) => {
            setContent(file.content);
            setFileName(file.title);
            setFileHandle(null);
            setView('editor');
          }}
          onDeleteRecent={(id) => {
             const updated = recentFiles.filter(f => f.id !== id);
             setRecentFiles(updated);
             localStorage.setItem('onedocs_recent_files', JSON.stringify(updated));
          }}
          onSelectTemplate={(tpl) => {
            setContent(tpl.content);
            setFileName(`${tpl.name} - Untitled`);
            setFileHandle(null);
            setView('editor');
          }}
        />
      ) : (
        <div className="flex flex-col h-full animate-fade-in">
          {/* Editor Header / Focus Mode hidden */}
          {!config.isFocusMode && (
              <div className="flex items-center justify-between px-3 py-1 bg-blue-700 text-white shadow-sm z-40 h-10 shrink-0">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setView('dashboard')} 
                    className="flex items-center space-x-1 p-1 pr-2 hover:bg-blue-600 rounded transition-colors text-xs font-medium"
                  >
                    <ArrowLeft size={16} />
                    <span>Home</span>
                  </button>
                  <div className="w-px h-4 bg-blue-500"></div>
                  <div className="flex flex-col justify-center">
                    <h1 className="text-xs font-semibold leading-none">{fileName}</h1>
                    <p className="text-[10px] opacity-80 leading-none mt-0.5">{fileHandle ? 'Saved locally' : 'Unsaved Draft'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    {comments.length > 0 && (
                        <div className="flex items-center space-x-1 text-[10px] bg-blue-800 px-2 py-0.5 rounded">
                            <MessageSquare size={12}/>
                            <span>{comments.length} Comments</span>
                        </div>
                    )}
                </div>
              </div>
          )}

          {config.isFocusMode && (
             <button 
                onClick={() => setConfig({...config, isFocusMode: false})}
                className="absolute top-4 right-4 z-50 bg-gray-800/50 hover:bg-gray-800 text-white p-2 rounded-full transition-colors"
                title="Exit Focus Mode"
            >
                <Eye size={20} />
            </button>
          )}

          <Toolbar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            execCommand={execCommand}
            insertImage={insertImage}
            insertTable={insertTable}
            config={config}
            setConfig={setConfig}
            onSave={handleSave}
            onOpen={handleOpen}
            onNew={() => {
                 if (confirm('Unsaved changes will be lost. Create new document?')) {
                     setContent(TEMPLATES[0].content);
                     setFileName('Untitled');
                     setFileHandle(null);
                 }
            }}
            onPrint={() => window.print()}
            systemFonts={systemFonts}
            toggleFindReplace={() => setShowFindReplace(!showFindReplace)}
            zoomIn={() => setZoomScale(prev => Math.min(prev + 0.1, 2))}
            zoomOut={() => setZoomScale(prev => Math.max(prev - 0.1, 0.5))}
            isRecording={isRecording}
            toggleRecording={toggleRecording}
            addComment={addComment}
          />

          {/* Find & Replace Bar */}
          {showFindReplace && !config.isFocusMode && (
              <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center space-x-2 animate-slide-up">
                  <Search size={16} className="text-gray-500"/>
                  <input 
                    className="text-sm px-2 py-1 border rounded w-40 dark:bg-gray-700 dark:text-white"
                    placeholder="Find..."
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                  />
                  <input 
                    className="text-sm px-2 py-1 border rounded w-40 dark:bg-gray-700 dark:text-white"
                    placeholder="Replace..."
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                  />
                  <button onClick={handleFindReplace} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Find Next</button>
                  <button onClick={handleReplaceAll} className="text-xs bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">Replace All</button>
                  <button onClick={() => setShowFindReplace(false)} className="ml-2 text-gray-500 hover:text-red-500"><X size={16}/></button>
              </div>
          )}

          <Editor 
            content={content}
            onChange={setContent}
            config={config}
            scale={zoomScale}
            comments={comments}
          />

          {/* Status Bar */}
          {config.showStatusBar && !config.isFocusMode && (
            <div className="flex justify-between items-center px-4 py-0.5 bg-blue-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 text-[10px] text-gray-600 dark:text-gray-400 shrink-0 select-none h-6">
              <div className="flex space-x-4">
                <span>Page 1 of 1</span>
                <span>{wordCount} words</span>
                <span>{charCount} chars</span>
              </div>
              <div className="flex space-x-4">
                <span className="uppercase">{config.orientation}</span>
                <span>{Math.round(zoomScale * 100)}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;

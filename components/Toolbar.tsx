import React from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, type LucideIcon,
  Undo, Redo, Image as ImageIcon, Link, Minus, 
  Printer, FileText, Download, Moon, Sun, Monitor,
  ZoomIn, ZoomOut, CheckSquare,
  Superscript, Subscript, Highlighter, Eraser,
  Type as TypeIcon, Copy, Scissors, Clipboard,
  Table as TableIcon, Search,
  Indent, Outdent, Mic, EyeOff, Stamp, MessageSquarePlus,
  FileCode
} from 'lucide-react';
import { TabName, EditorConfig } from '../types';
import { FONTS, FONT_SIZES } from '../constants';

interface ToolbarProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  execCommand: (command: string, value?: string) => void;
  insertImage: () => void;
  insertTable: () => void;
  config: EditorConfig;
  setConfig: (config: EditorConfig) => void;
  onSave: (type?: 'docx'|'html'|'md') => void;
  onOpen: () => void;
  onNew: () => void;
  onPrint: () => void;
  systemFonts: string[];
  toggleFindReplace: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  isRecording: boolean;
  toggleRecording: () => void;
  addComment: () => void;
}

const RibbonBtn: React.FC<{
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  active?: boolean;
  disabled?: boolean;
  color?: string;
  shortcut?: string;
  alert?: boolean;
}> = ({ icon: Icon, onClick, label, active, disabled, color, shortcut, alert }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={shortcut ? `${label} (${shortcut})` : label}
    className={`
      flex flex-col items-center justify-center px-3 py-1.5 h-full rounded transition-all min-w-[3.5rem] relative
      ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      ${active ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 shadow-inner' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
    `}
  >
    <Icon size={20} color={color} className={`mb-1 ${alert ? 'animate-pulse text-red-500' : ''}`} strokeWidth={1.5} />
    <span className="text-[10px] leading-tight text-center font-medium">{label}</span>
  </button>
);

const SmallBtn: React.FC<{
  icon: LucideIcon;
  onClick: () => void;
  title: string;
  active?: boolean;
}> = ({ icon: Icon, onClick, title, active }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${active ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-700 dark:text-gray-400'}`}
  >
    <Icon size={16} strokeWidth={2} />
  </button>
);

const GroupDivider = () => <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 mx-1 self-center" />;

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTab, setActiveTab, execCommand, insertImage, insertTable, config, setConfig,
  onSave, onOpen, onNew, onPrint, systemFonts, toggleFindReplace, zoomIn, zoomOut,
  isRecording, toggleRecording, addComment
}) => {
  
  const tabs: TabName[] = ['File', 'Home', 'Insert', 'Layout', 'Review', 'View'];
  const allFonts = systemFonts.length > 0 ? Array.from(new Set([...FONTS, ...systemFonts])) : FONTS;

  return (
    <div className={`flex flex-col w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-30 transition-all duration-300 select-none ${config.isFocusMode ? '-mt-40 hidden' : ''}`}>
      {/* Tab Headers */}
      <div className="flex px-4 pt-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 space-x-1">
        <div className="font-extrabold text-lg text-blue-600 dark:text-blue-400 mr-6 py-1 px-2 tracking-tight">OneDocs</div>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-5 py-1.5 text-sm font-medium transition-colors rounded-t-md mb-[-1px] border-t-2 border-x
              ${activeTab === tab 
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-gray-200 dark:border-gray-700 border-b-transparent border-t-blue-500' 
                : 'bg-transparent text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-200 dark:hover:bg-gray-800'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ribbon Content Panel */}
      <div className="h-28 px-4 py-2 flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-thin">
        
        {activeTab === 'File' && (
          <>
            <RibbonBtn icon={FileText} label="New" onClick={onNew} />
            <RibbonBtn icon={FileCode} label="Open" onClick={onOpen} />
            <RibbonBtn icon={CheckSquare} label="Save" onClick={() => onSave()} shortcut="Ctrl+S" />
            <GroupDivider />
            <RibbonBtn icon={Printer} label="Print" onClick={onPrint} />
            <RibbonBtn icon={Download} label="PDF" onClick={onPrint} />
            <RibbonBtn icon={TypeIcon} label="Docx" onClick={() => onSave('docx')} />
            <RibbonBtn icon={FileCode} label="Markdown" onClick={() => onSave('md')} />
          </>
        )}

        {activeTab === 'Home' && (
          <>
            <div className="flex flex-col space-y-1 h-full justify-center">
              <div className="flex space-x-1">
                <SmallBtn icon={Clipboard} onClick={() => execCommand('paste')} title="Paste" />
                <SmallBtn icon={Copy} onClick={() => execCommand('copy')} title="Copy" />
                <SmallBtn icon={Scissors} onClick={() => execCommand('cut')} title="Cut" />
              </div>
              <span className="text-[10px] text-gray-400 text-center">Clipboard</span>
            </div>
            
            <GroupDivider />
            
            <div className="flex flex-col space-y-2 h-full justify-center px-1">
               <div className="flex space-x-1">
                  <select 
                    className="h-6 w-32 text-xs border rounded px-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    value={config.fontFamily}
                    onChange={(e) => {
                      execCommand('fontName', e.target.value);
                      setConfig({ ...config, fontFamily: e.target.value });
                    }}
                  >
                    {allFonts.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select 
                    className="h-6 w-16 text-xs border rounded px-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    value={config.fontSize}
                    onChange={(e) => {
                      execCommand('fontSize', '4');
                      setConfig({ ...config, fontSize: e.target.value });
                    }}
                  >
                    {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
               <div className="flex space-x-1 items-center">
                  <SmallBtn icon={Bold} onClick={() => execCommand('bold')} title="Bold" />
                  <SmallBtn icon={Italic} onClick={() => execCommand('italic')} title="Italic" />
                  <SmallBtn icon={Underline} onClick={() => execCommand('underline')} title="Underline" />
                  <SmallBtn icon={Strikethrough} onClick={() => execCommand('strikeThrough')} title="Strikethrough" />
                  <SmallBtn icon={Subscript} onClick={() => execCommand('subscript')} title="Subscript" />
                  <SmallBtn icon={Superscript} onClick={() => execCommand('superscript')} title="Superscript" />
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <input type="color" className="w-5 h-5 p-0 border-0 rounded cursor-pointer" onChange={(e) => execCommand('foreColor', e.target.value)} title="Text Color" />
                  <SmallBtn icon={Highlighter} onClick={() => execCommand('hiliteColor', 'yellow')} title="Highlight" />
                  <SmallBtn icon={Eraser} onClick={() => execCommand('removeFormat')} title="Clear Format" />
               </div>
            </div>

            <GroupDivider />

            <div className="flex flex-col space-y-2 h-full justify-center px-1">
                <div className="flex space-x-1">
                   <SmallBtn icon={List} onClick={() => execCommand('insertUnorderedList')} title="Bullet List" />
                   <SmallBtn icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} title="Numbered List" />
                   <SmallBtn icon={Indent} onClick={() => execCommand('indent')} title="Increase Indent" />
                   <SmallBtn icon={Outdent} onClick={() => execCommand('outdent')} title="Decrease Indent" />
                </div>
                <div className="flex space-x-1">
                   <SmallBtn icon={AlignLeft} onClick={() => execCommand('justifyLeft')} title="Left Align" />
                   <SmallBtn icon={AlignCenter} onClick={() => execCommand('justifyCenter')} title="Center Align" />
                   <SmallBtn icon={AlignRight} onClick={() => execCommand('justifyRight')} title="Right Align" />
                   <SmallBtn icon={AlignJustify} onClick={() => execCommand('justifyFull')} title="Justify" />
                </div>
            </div>

            <GroupDivider />
            
            <RibbonBtn icon={Search} label="Find" onClick={toggleFindReplace} />
            <RibbonBtn 
                icon={Mic} 
                label={isRecording ? "Listening" : "Dictate"} 
                onClick={toggleRecording} 
                active={isRecording} 
                alert={isRecording}
            />
          </>
        )}

        {activeTab === 'Insert' && (
          <>
            <RibbonBtn icon={ImageIcon} label="Picture" onClick={insertImage} />
            <RibbonBtn icon={TableIcon} label="Table" onClick={insertTable} />
            <RibbonBtn icon={Link} label="Link" onClick={() => {
              const url = prompt('Enter URL:');
              if (url) execCommand('createLink', url);
            }} />
            <GroupDivider />
            <RibbonBtn icon={Minus} label="Line" onClick={() => execCommand('insertHorizontalRule')} />
            <RibbonBtn icon={TypeIcon} label="Page Break" onClick={() => {
                const html = '<div class="page-break"></div><br/>';
                execCommand('insertHTML', html);
            }} />
            <GroupDivider />
            <div className="flex flex-col space-y-1">
                <button onClick={() => execCommand('insertText', new Date().toLocaleDateString())} className="text-xs px-2 py-1 hover:bg-gray-100 rounded text-left">Date</button>
                <button onClick={() => execCommand('insertText', new Date().toLocaleTimeString())} className="text-xs px-2 py-1 hover:bg-gray-100 rounded text-left">Time</button>
            </div>
          </>
        )}

        {activeTab === 'Layout' && (
          <>
             <div className="flex flex-col space-y-2 p-1">
                <div className="flex items-center space-x-2">
                    <span className="text-xs w-16 text-gray-600 dark:text-gray-400">Margins:</span>
                    <select 
                        className="text-xs border rounded p-1 dark:bg-gray-700 dark:text-white"
                        value={config.margins}
                        onChange={(e) => setConfig({...config, margins: e.target.value})}
                    >
                        <option value="1in">Normal (1")</option>
                        <option value="0.5in">Narrow (0.5")</option>
                        <option value="2in">Wide (2")</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                     <span className="text-xs w-16 text-gray-600 dark:text-gray-400">Orient:</span>
                     <div className="flex bg-gray-200 dark:bg-gray-700 rounded p-0.5">
                         <button 
                            onClick={() => setConfig({...config, orientation: 'portrait'})}
                            className={`px-2 py-0.5 text-xs rounded ${config.orientation === 'portrait' ? 'bg-white text-blue-600 shadow' : ''}`}
                        >Portrait</button>
                         <button 
                            onClick={() => setConfig({...config, orientation: 'landscape'})}
                            className={`px-2 py-0.5 text-xs rounded ${config.orientation === 'landscape' ? 'bg-white text-blue-600 shadow' : ''}`}
                        >Landscp</button>
                     </div>
                </div>
             </div>
             <GroupDivider />
             <RibbonBtn icon={Stamp} label="Watermark" onClick={() => {
                 const text = prompt("Enter Watermark Text (leave empty to remove):", config.watermarkText);
                 setConfig({...config, watermarkText: text || undefined});
             }} />
          </>
        )}

        {activeTab === 'Review' && (
          <>
             <RibbonBtn icon={CheckSquare} label="Spell Check" active={config.spellCheck} onClick={() => setConfig({...config, spellCheck: !config.spellCheck})} />
             <RibbonBtn icon={MessageSquarePlus} label="New Comment" onClick={addComment} />
          </>
        )}

        {activeTab === 'View' && (
          <>
            <RibbonBtn icon={ZoomIn} label="Zoom In" onClick={zoomIn} />
            <RibbonBtn icon={ZoomOut} label="Zoom Out" onClick={zoomOut} />
            <RibbonBtn icon={Monitor} label="100%" onClick={() => document.documentElement.style.setProperty('--zoom', '1')} />
            <GroupDivider />
            <RibbonBtn 
                icon={config.theme === 'light' ? Sun : (config.theme === 'dark' ? Moon : Monitor)} 
                label={`Theme: ${config.theme}`}
                onClick={() => {
                    const next = config.theme === 'light' ? 'dark' : (config.theme === 'dark' ? 'system' : 'light');
                    setConfig({...config, theme: next});
                }} 
            />
            <RibbonBtn 
                icon={EyeOff} 
                label="Focus Mode" 
                onClick={() => setConfig({...config, isFocusMode: true})} 
            />
            <GroupDivider />
            <div className="flex flex-col items-start space-y-2 ml-2">
                <div className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        checked={config.showRuler}
                        onChange={(e) => setConfig({...config, showRuler: e.target.checked})}
                        id="showRuler"
                        className="rounded text-blue-600"
                    />
                    <label htmlFor="showRuler" className="text-xs select-none">Rulers</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        checked={config.showStatusBar}
                        onChange={(e) => setConfig({...config, showStatusBar: e.target.checked})}
                        id="showStatusBar"
                         className="rounded text-blue-600"
                    />
                    <label htmlFor="showStatusBar" className="text-xs select-none">Status Bar</label>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
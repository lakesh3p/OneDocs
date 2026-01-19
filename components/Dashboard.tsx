import React from 'react';
import { FileText, Trash2, Clock, FilePlus, Layout } from 'lucide-react';
import { RecentFile, Template } from '../types';
import { TEMPLATES } from '../constants';

interface DashboardProps {
  recentFiles: RecentFile[];
  onOpenRecent: (file: RecentFile) => void;
  onDeleteRecent: (id: string) => void;
  onSelectTemplate: (template: Template) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  recentFiles, onOpenRecent, onDeleteRecent, onSelectTemplate 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-auto p-8 transition-colors duration-200 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
              <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight mb-2">OneDocs</h1>
              <p className="text-gray-600 dark:text-gray-400">Create, edit, and manage your documents with ease.</p>
          </div>
        </div>

        {/* Templates Section */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
            <Layout className="mr-2" size={20}/> Start a new document
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="flex flex-col items-center group"
              >
                <div className="w-full aspect-[3/4] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm group-hover:shadow-lg group-hover:border-blue-500 transition-all mb-3 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 opacity-50"></div>
                    <FilePlus className="text-gray-400 group-hover:text-blue-500 transition-colors z-10" size={32}/>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 text-center group-hover:text-blue-600 transition-colors">{template.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{template.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Files Section */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <Clock className="mr-2" size={20}/> Recent Documents
            </h2>
            {recentFiles.length > 0 && (
                 <button 
                    onClick={() => {
                        if(confirm('Clear all recent files history?')) {
                             recentFiles.forEach(f => onDeleteRecent(f.id));
                        }
                    }}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                    Clear History
                </button>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[300px]">
            {recentFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FileText size={48} className="mb-4 opacity-30"/>
                <p>No recent files found. Create a new one!</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-750 text-gray-500 dark:text-gray-400 text-xs border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Last Modified</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentFiles.map(file => (
                    <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => onOpenRecent(file)}
                          className="flex items-center text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded mr-3">
                              <FileText size={18} className="text-blue-500" />
                          </div>
                          {file.title}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(file.lastModified).toLocaleDateString()} <span className="text-xs opacity-70 ml-1">{new Date(file.lastModified).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRecent(file.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
                          title="Remove from history"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

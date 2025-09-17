import React, { useMemo } from 'react';
import { UndoIcon, RedoIcon, CopyIcon, PasteIcon, UploadIcon, LinkIcon } from './icons';
import { Tooltip } from './Tooltip';

interface TextInputAreaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onCopy: () => void;
  onPaste: () => void;
  onFileUpload: (file: File) => void;
  onUrlChange: (url: string) => void;
  urlValue: string;
  onUrlImport: () => void;
}

const MAX_CHARS = 10000;

export const TextInputArea: React.FC<TextInputAreaProps> = ({ 
  value, onChange, isLoading, 
  onUndo, onRedo, canUndo, canRedo,
  onCopy, onPaste, onFileUpload,
  urlValue, onUrlChange, onUrlImport
}) => {
  const { words, characters } = useMemo(() => {
    const trimmedText = value.trim();
    return {
      words: trimmedText ? trimmedText.split(/\s+/).length : 0,
      characters: value.length,
    };
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileUpload(event.target.files[0]);
    }
  };

  return (
    <div>
      <div className="relative">
        <div className="absolute top-2 right-3 z-10 flex space-x-1">
            <Tooltip title="Copy Text" position="bottom">
                <button 
                    onClick={onCopy} 
                    disabled={isLoading || value.length === 0}
                    className="p-2 rounded-md text-gray-300 hover:bg-[var(--glass-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Copy"
                >
                    <CopyIcon className="h-5 w-5" />
                </button>
            </Tooltip>
            <Tooltip title="Paste Text" position="bottom">
                 <button 
                    onClick={onPaste} 
                    disabled={isLoading}
                    className="p-2 rounded-md text-gray-300 hover:bg-[var(--glass-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Paste"
                >
                    <PasteIcon className="h-5 w-5" />
                </button>
            </Tooltip>
            <Tooltip title="Undo (Ctrl+Z)" position="bottom">
                <button 
                    onClick={onUndo} 
                    disabled={!canUndo || isLoading} 
                    className="p-2 rounded-md text-gray-300 hover:bg-[var(--glass-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Undo"
                >
                    <UndoIcon className="h-5 w-5" />
                </button>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Y)" position="bottom">
                 <button 
                    onClick={onRedo} 
                    disabled={!canRedo || isLoading} 
                    className="p-2 rounded-md text-gray-300 hover:bg-[var(--glass-bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Redo"
                >
                    <RedoIcon className="h-5 w-5" />
                </button>
            </Tooltip>
        </div>
        <textarea
          value={value}
          onChange={onChange}
          placeholder="Paste your text here to begin analysis..."
          className="glassmorphic w-full h-48 md:h-64 p-4 pt-10 text-base leading-relaxed bg-transparent border-2 border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-[var(--accent-cyan)] focus:border-[var(--accent-cyan)] transition-shadow duration-200 resize-y text-gray-200 placeholder-gray-500"
          disabled={isLoading}
          maxLength={MAX_CHARS}
        />
        <div className="absolute bottom-3 right-3 flex items-center space-x-3 text-sm text-gray-400">
          <span>{words.toLocaleString()} words</span>
          <span className="text-gray-600">|</span>
          <span className={characters > MAX_CHARS ? 'font-bold text-red-500' : ''}>
            {characters.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
          </span>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex flex-col">
            <label 
                htmlFor="file-upload" 
                className="btn-3d inline-flex items-center justify-center px-4 py-2 border border-[var(--border-color)] rounded-md shadow-sm text-sm font-medium text-gray-200 bg-[var(--bg-dark-2)] hover:bg-[var(--accent-blue)] hover:text-white cursor-pointer w-full transition-colors"
            >
                <UploadIcon className="h-5 w-5 mr-2" />
                Upload File
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt" disabled={isLoading} />
            <p className="text-xs text-gray-400 text-center mt-1">Supports .txt (PDF/DOC coming soon)</p>
        </div>
        <div className="flex flex-col">
            <div className="flex">
                <input 
                    type="url"
                    value={urlValue}
                    onChange={(e) => onUrlChange(e.target.value)}
                    placeholder="Import from URL"
                    className="flex-grow min-w-0 p-2 text-sm bg-transparent text-gray-200 border border-[var(--border-color)] rounded-l-md focus:ring-1 focus:ring-[var(--accent-cyan)] focus:border-[var(--accent-cyan)] placeholder-gray-500"
                    disabled={isLoading}
                />
                <Tooltip title="Import text from the provided web link">
                  <button 
                      onClick={onUrlImport}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-[var(--border-color)] rounded-r-md bg-[var(--bg-dark-2)] hover:bg-[var(--accent-blue)] disabled:opacity-50"
                      disabled={isLoading || !urlValue}
                  >
                      <LinkIcon className="h-5 w-5 text-gray-300" />
                  </button>
                </Tooltip>
            </div>
             <p className="text-xs text-gray-400 text-center mt-1">Feature not yet available</p>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { AnalyzeIcon, GrammarCheckIcon, HumanizeIcon, PlagiarismIcon, CorrectGrammarIcon, ChevronDownIcon, ProofreadIcon, SummarizeIcon, TranslateIcon } from './icons';
import { Tooltip } from './Tooltip';

interface ActionMenuProps {
  onAnalyze: () => void;
  onGrammarCheck: () => void;
  onPlagiarismCheck: () => void;
  onCorrectGrammar: () => void;
  onHumanize: () => void;
  onProofread: () => void;
  onSummarize: () => void;
  onTranslate: () => void;
  isLoading: boolean;
  isCorrecting?: boolean;
  isProofreading?: boolean;
  isSummarizing?: boolean;
  isTranslating?: boolean;
  hasText: boolean;
}

const ActionButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  isPrimary?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon: React.ReactNode;
  text: string;
}> = ({ onClick, disabled, isPrimary = false, isLoading = false, loadingText = 'Processing...', icon, text }) => {
  const baseClasses = "w-full flex items-center justify-start text-left px-4 py-3 text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 btn-3d";
  const primaryClasses = "bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] text-black shadow-lg hover:shadow-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-cyan)] disabled:bg-gray-600 disabled:shadow-none";
  const secondaryClasses = "bg-[var(--glass-bg)] text-[var(--text-light)] border border-[var(--border-color)] hover:border-[var(--accent-cyan)] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </>
      ) : (
        <>
          <span className="mr-3">{icon}</span>
          {text}
        </>
      )}
    </button>
  );
};

export const ActionMenu: React.FC<ActionMenuProps> = (props) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isFullAnalysisLoading = props.isLoading && !props.isCorrecting && !props.isProofreading && !props.isSummarizing && !props.isTranslating;

  const handleMobileClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };
  
  const allActions = (
    <div className="space-y-3">
      <Tooltip title="Run a full analysis for AI content, writing quality, and plagiarism." className="w-full" position="right">
        <ActionButton
          onClick={() => handleMobileClick(props.onAnalyze)}
          disabled={props.isLoading || !props.hasText}
          isPrimary
          isLoading={isFullAnalysisLoading}
          loadingText="Analyzing..."
          icon={<AnalyzeIcon className="h-5 w-5" />}
          text="Analyze Text"
        />
      </Tooltip>
      <div className="pt-2">
        <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Refine & Check</h3>
      </div>
      <Tooltip title="Perform a comprehensive proofread for style, consistency, and flow." className="w-full" position="right">
        <ActionButton
          onClick={() => handleMobileClick(props.onProofread)}
          disabled={props.isLoading || !props.hasText}
          isLoading={props.isProofreading}
          loadingText="Proofreading..."
          icon={<ProofreadIcon className="h-5 w-5" />}
          text="Proofread"
        />
      </Tooltip>
      <Tooltip title="Perform a focused check for grammar, spelling, and style errors." className="w-full" position="right">
        <ActionButton
          onClick={() => handleMobileClick(props.onGrammarCheck)}
          disabled={props.isLoading || !props.hasText}
          isLoading={isFullAnalysisLoading}
          loadingText="Checking..."
          icon={<GrammarCheckIcon className="h-5 w-5" />}
          text="Grammar Check"
        />
      </Tooltip>
      <Tooltip title="Scan the text for potential plagiarism against online sources." className="w-full" position="right">
        <ActionButton
          onClick={() => handleMobileClick(props.onPlagiarismCheck)}
          disabled={props.isLoading || !props.hasText}
          isLoading={isFullAnalysisLoading}
          loadingText="Checking..."
          icon={<PlagiarismIcon className="h-5 w-5" />}
          text="Plagiarism Check"
        />
      </Tooltip>
      <div className="pt-2">
        <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rewrite</h3>
      </div>
      <Tooltip title="Generate a concise summary of the text." className="w-full" position="right">
        <ActionButton
          onClick={() => handleMobileClick(props.onSummarize)}
          disabled={props.isLoading || !props.hasText}
          isLoading={props.isSummarizing}
          loadingText="Summarizing..."
          icon={<SummarizeIcon className="h-5 w-5" />}
          text="Summarize"
        />
      </Tooltip>
      <Tooltip title="Translate the text to a different language." className="w-full" position="right">
        <ActionButton
          onClick={() => handleMobileClick(props.onTranslate)}
          disabled={props.isLoading || !props.hasText}
          isLoading={props.isTranslating}
          loadingText="Translating..."
          icon={<TranslateIcon className="h-5 w-5" />}
          text="Translate"
        />
      </Tooltip>
       <Tooltip title="Correct grammar and spelling for a specific dialect." className="w-full" position="right">
        <ActionButton
          onClick={() => handleMobileClick(props.onCorrectGrammar)}
          disabled={props.isLoading || !props.hasText}
          isLoading={props.isCorrecting}
          loadingText="Correcting..."
          icon={<CorrectGrammarIcon className="h-5 w-5" />}
          text="Correct Grammar"
        />
      </Tooltip>
      <Tooltip title="Open options to rewrite the text to sound more human-written." className="w-full" position="right">
        <ActionButton
          onClick={() => handleMobileClick(props.onHumanize)}
          disabled={props.isLoading || !props.hasText}
          icon={<HumanizeIcon className="h-5 w-5" />}
          text="Humanize"
        />
      </Tooltip>
    </div>
  );

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden lg:block">
        {allActions}
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden relative">
        <Tooltip title="Show all available actions" position="bottom">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg glassmorphic"
          >
            <span>Actions</span>
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </Tooltip>
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 glassmorphic rounded-lg z-20">
            {allActions}
          </div>
        )}
      </div>
    </>
  );
};
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { TextInputArea } from './components/TextInputArea';
import { ResultsPanel } from './components/ResultsPanel';
import { HighlightedText } from './components/HighlightedText';
import { HumanizeModal } from './components/HumanizeModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ActionMenu } from './components/ActionMenu';
import { ComparisonView } from './components/ComparisonView';
import { SummaryModal } from './components/SummaryModal';
import { TranslateModal } from './components/TranslateModal';
import { CorrectionModal } from './components/CorrectionModal';
import { TranslationPrompt } from './components/TranslationPrompt';
import { getAiHighlightColor, categoryToColor } from './utils/colorUtils';
import { AnalysisResult, AnalysisStatus, WritingSuggestion } from './types';
import { 
  analyzeText, 
  humanizeText, 
  checkGrammar, 
  checkPlagiarism, 
  correctGrammar,
  proofreadText,
  summarizeText,
  translateText,
  detectLanguage
} from './services/geminiService';
import { DEFAULT_TEXT, TAB_AI_DETECTION, TAB_WRITING_QUALITY, TAB_PLAGIARISM } from './constants';
import { AnalyzeIcon } from './components/icons';
import { useHistoryState } from './hooks/useHistoryState';
import { Footer } from './components/Footer';

type ReviewChangesState = {
  original: string;
  modified: string;
} | null;

function App() {
  const { 
    state: text, 
    setState: setText, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistoryState(DEFAULT_TEXT);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.Idle);
  const [error, setError] = useState<string | null>(null);
  const [isHumanizing, setIsHumanizing] = useState<boolean>(false);
  const [isCorrecting, setIsCorrecting] = useState<boolean>(false);
  const [isProofreading, setIsProofreading] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isHumanizeModalOpen, setIsHumanizeModalOpen] = useState<boolean>(false);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState<boolean>(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(TAB_AI_DETECTION);
  const [reviewChanges, setReviewChanges] = useState<ReviewChangesState>(null);
  const [url, setUrl] = useState<string>('');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [showTranslationPrompt, setShowTranslationPrompt] = useState<boolean>(false);


  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setStatus(AnalysisStatus.Loading);
    setError(null);
    setAnalysisResult(null);
    setShowTranslationPrompt(false);
    try {
      const [mainResult, plagiarismResult] = await Promise.all([
        analyzeText(text),
        checkPlagiarism(text)
      ]);

      const combinedResult: AnalysisResult = {
        ...mainResult,
        plagiarism: plagiarismResult,
      };
      
      setAnalysisResult(combinedResult);
      setStatus(AnalysisStatus.Success);
      setActiveTab(TAB_AI_DETECTION);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus(AnalysisStatus.Error);
    }
  };

  const handleGrammarCheck = async () => {
    if (!text.trim()) return;
    setStatus(AnalysisStatus.Loading);
    setError(null);
    setAnalysisResult(null);
    setShowTranslationPrompt(false);
    try {
      const result = await checkGrammar(text);
      setAnalysisResult({
        aiDetection: { overallScore: 0, modelBreakdown: [], highlightedPhrases: [] },
        writingQuality: result.writingQuality,
      });
      setStatus(AnalysisStatus.Success);
      setActiveTab(TAB_WRITING_QUALITY);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus(AnalysisStatus.Error);
    }
  };
  
  const handleProofread = async () => {
    if (!text.trim()) return;
    setIsProofreading(true);
    setStatus(AnalysisStatus.Loading); // Use main loading state
    setError(null);
    setAnalysisResult(null);
    setShowTranslationPrompt(false);
    try {
      const result = await proofreadText(text);
      setAnalysisResult({
        aiDetection: { overallScore: 0, modelBreakdown: [], highlightedPhrases: [] },
        writingQuality: result.writingQuality,
      });
      setStatus(AnalysisStatus.Success);
      setActiveTab(TAB_WRITING_QUALITY);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus(AnalysisStatus.Error);
    } finally {
      setIsProofreading(false);
    }
  };

  const handlePlagiarismCheck = async () => {
    if (!text.trim()) return;
    setStatus(AnalysisStatus.Loading);
    setError(null);
    setAnalysisResult(null);
    setShowTranslationPrompt(false);
    try {
      const result = await checkPlagiarism(text);
      setAnalysisResult({
        aiDetection: { overallScore: 0, modelBreakdown: [], highlightedPhrases: [] },
        writingQuality: [],
        plagiarism: result,
      });
      setStatus(AnalysisStatus.Success);
      setActiveTab(TAB_PLAGIARISM);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus(AnalysisStatus.Error);
    }
  };

  const handleCorrectionConfirm = async (dialect: string) => {
    if (!text.trim()) return;
    setIsCorrectionModalOpen(false);
    setIsCorrecting(true);
    setError(null);
    const originalText = text;
    try {
        const correctedText = await correctGrammar(text, dialect);
        setReviewChanges({ original: originalText, modified: correctedText });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        setStatus(AnalysisStatus.Error);
    } finally {
        setIsCorrecting(false);
    }
  };
  
  const handleSummarize = async () => {
    if (!text.trim()) return;
    setIsSummarizing(true);
    setError(null);
    try {
      const summaryText = await summarizeText(text);
      setSummary(summaryText);
      setIsSummaryModalOpen(true);
    } catch(err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus(AnalysisStatus.Error);
    } finally {
      setIsSummarizing(false);
    }
  }

  const handleHumanizeConfirm = async (
    tone: string, 
    level: string,
    sentenceComplexity: string,
    vocabularyRichness: string,
    textLength: string
  ) => {
    if (!text.trim()) return;
    setIsHumanizeModalOpen(false);
    setIsHumanizing(true);
    setError(null);
    const originalText = text;
    try {
        const humanizedText = await humanizeText(text, tone, level, sentenceComplexity, vocabularyRichness, textLength);
        setReviewChanges({ original: originalText, modified: humanizedText });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        setStatus(AnalysisStatus.Error);
    } finally {
        setIsHumanizing(false);
    }
  };
  
  const handleTranslateConfirm = async (language: string) => {
    if (!text.trim()) return;
    setIsTranslateModalOpen(false);
    setIsTranslating(true);
    setError(null);
    const originalText = text;
    try {
      const translatedText = await translateText(text, language);
      setReviewChanges({ original: originalText, modified: translatedText });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus(AnalysisStatus.Error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateToEnglish = async () => {
    if (!text.trim()) return;
    setShowTranslationPrompt(false);
    setIsTranslating(true);
    setError(null);
    const originalText = text;
    try {
      const translatedText = await translateText(text, 'English');
      setReviewChanges({ original: originalText, modified: translatedText });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus(AnalysisStatus.Error);
    } finally {
      setIsTranslating(false);
    }
  };
  
  const handleDismissTranslationPrompt = () => {
    setShowTranslationPrompt(false);
  };

  const handleAcceptChanges = () => {
    if (reviewChanges) {
      setText(reviewChanges.modified);
      setAnalysisResult(null);
      setStatus(AnalysisStatus.Idle);
      setReviewChanges(null);
    }
  };

  const handleDiscardChanges = () => {
    setReviewChanges(null);
  };
  
  const handleFeedbackSubmit = (feedbackText: string) => {
    console.log("--- User Feedback Submitted ---");
    console.log(feedbackText);
    console.log("-------------------------------");
    setIsFeedbackModalOpen(false);
  };

  const handleApplySuggestion = (suggestionToApply: WritingSuggestion) => {
    const newSentence = suggestionToApply.originalSentence.replace(
      suggestionToApply.originalPhrase,
      suggestionToApply.suggestion
    );
    const newText = text.replace(suggestionToApply.originalSentence, newSentence);
    setText(newText);

    setAnalysisResult(prevResult => {
      if (!prevResult) return null;
      return {
        ...prevResult,
        writingQuality: prevResult.writingQuality.filter(
          suggestion => suggestion !== suggestionToApply
        ),
      };
    });
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy text: ', err));
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to paste text: ', err);
    }
  };
  
  const handleFileUpload = (file: File) => {
    setError(null);
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setText(fileContent);
      };
      reader.onerror = () => {
        setError("Failed to read the uploaded file.");
        setStatus(AnalysisStatus.Error);
      }
      reader.readAsText(file);
    } else {
        setError("Unsupported file type. Please upload a .txt file.");
        // Temporarily show the error
        setTimeout(() => setError(null), 3000);
    }
  };

  const handleUrlImport = () => {
    console.log("Importing from URL:", url);
    setError("Importing from URL is not yet supported.");
    setTimeout(() => setError(null), 3000);
  };

  // Debounced language detection
  useEffect(() => {
    const handler = setTimeout(async () => {
      // Conditions to skip detection
      if (text.trim().length < 50 || status !== AnalysisStatus.Idle || reviewChanges) {
        setShowTranslationPrompt(false);
        return;
      }
      try {
        const lang = await detectLanguage(text);
        if (lang && !lang.toLowerCase().includes('english')) {
          setDetectedLanguage(lang);
          setShowTranslationPrompt(true);
        } else {
          setShowTranslationPrompt(false);
        }
      } catch (error) {
        console.error("Language detection failed:", error);
        setShowTranslationPrompt(false); // Hide on error
      }
    }, 1500); // 1.5-second delay after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [text, status, reviewChanges]);


  const highlights = useMemo(() => {
    if (!analysisResult) return [];
    const aiHighlights = (analysisResult.aiDetection?.highlightedPhrases || []).map(s => ({
      text: s.phrase,
      color: getAiHighlightColor(0.8),
      tooltip: `AI Signal: ${s.reason}`,
    }));
    const qualityHighlights = (analysisResult.writingQuality || []).map(s => ({
      text: s.originalPhrase,
      color: categoryToColor(s.category),
      tooltip: `[${s.category}] ${s.description}`,
    }));
    const combined = [...aiHighlights, ...qualityHighlights];
    const uniqueHighlights = Array.from(new Map(combined.map(item => [item.text, item])).values());
    return uniqueHighlights;
  }, [analysisResult]);

  const isAnalyzing = status === AnalysisStatus.Loading;
  const isLoading = isAnalyzing || isHumanizing || isCorrecting || isProofreading || isSummarizing || isTranslating;

  return (
    <div className="min-h-screen text-gray-100 font-sans flex flex-col">
      <Header onFeedbackClick={() => setIsFeedbackModalOpen(true)} />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 py-8">
          
          <aside className="sticky top-24 self-start z-30">
            <ActionMenu
              onAnalyze={handleAnalyze}
              onGrammarCheck={handleGrammarCheck}
              onPlagiarismCheck={handlePlagiarismCheck}
              onCorrectGrammar={() => setIsCorrectionModalOpen(true)}
              onHumanize={() => setIsHumanizeModalOpen(true)}
              onProofread={handleProofread}
              onSummarize={handleSummarize}
              onTranslate={() => setIsTranslateModalOpen(true)}
              isLoading={isLoading}
              isCorrecting={isCorrecting}
              isProofreading={isProofreading}
              isSummarizing={isSummarizing}
              isTranslating={isTranslating}
              hasText={!!text.trim()}
            />
          </aside>

          <main className="min-w-0">
            <div className="glassmorphic rounded-2xl p-4 md:p-6 lg:p-8">
              {showTranslationPrompt && detectedLanguage && (
                <TranslationPrompt
                  language={detectedLanguage}
                  onTranslate={handleTranslateToEnglish}
                  onDismiss={handleDismissTranslationPrompt}
                  isTranslating={isTranslating}
                />
              )}
              <TextInputArea
                value={text}
                onChange={(newValue) => {
                  setText(newValue);
                  // Hide prompt immediately on text change for better responsiveness.
                  // The useEffect will then re-evaluate whether to show it again after a delay.
                  if (showTranslationPrompt) setShowTranslationPrompt(false);
                }}
                isLoading={isLoading}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                onCopy={handleCopy}
                onPaste={handlePaste}
                onFileUpload={handleFileUpload}
                urlValue={url}
                onUrlChange={setUrl}
                onUrlImport={handleUrlImport}
              />
              
              {error && <div className="mt-6 text-center text-red-400 bg-red-900/40 p-4 rounded-lg">{error}</div>}
              
              {(isAnalyzing || (status === AnalysisStatus.Success && analysisResult)) ? (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glassmorphic p-4 md:p-6 rounded-xl min-h-[400px]">
                    <h2 className="text-xl font-bold mb-4 text-gray-200">Analyzed Text</h2>
                    <HighlightedText text={text} highlights={highlights} />
                  </div>
                  <div className="glassmorphic p-4 md:p-6 rounded-xl">
                    <ResultsPanel 
                        result={analysisResult} 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                        isLoading={isAnalyzing}
                        onApplySuggestion={handleApplySuggestion}
                    />
                  </div>
                </div>
              ) : (
                status === AnalysisStatus.Idle && !isLoading && (
                  <div className="mt-8 text-center p-12 glassmorphic rounded-2xl border-2 border-dashed border-[var(--border-color)]">
                      <AnalyzeIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h2 className="mt-4 text-2xl font-semibold text-gray-300">Ready to Analyze</h2>
                      <p className="mt-2 text-gray-400">Enter your text above and click an action to begin.</p>
                  </div>
                )
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />

      <HumanizeModal 
        isOpen={isHumanizeModalOpen}
        onClose={() => setIsHumanizeModalOpen(false)}
        onConfirm={handleHumanizeConfirm}
        isLoading={isHumanizing}
      />
      <CorrectionModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        onConfirm={handleCorrectionConfirm}
        isLoading={isCorrecting}
      />
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
      <SummaryModal 
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={summary}
      />
      <TranslateModal
        isOpen={isTranslateModalOpen}
        onClose={() => setIsTranslateModalOpen(false)}
        onConfirm={handleTranslateConfirm}
        isLoading={isTranslating}
      />
       {reviewChanges && (
        <ComparisonView
          originalText={reviewChanges.original}
          modifiedText={reviewChanges.modified}
          onAccept={handleAcceptChanges}
          onDiscard={handleDiscardChanges}
        />
      )}
    </div>
  );
}

export default App;

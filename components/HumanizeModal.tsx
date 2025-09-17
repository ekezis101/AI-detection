import React, { useState } from 'react';
import { 
    HUMANIZETONE_OPTIONS, 
    HUMANIZELEVEL_OPTIONS,
    SENTENCE_COMPLEXITY_OPTIONS,
    VOCABULARY_RICHNESS_OPTIONS,
    TEXT_LENGTH_OPTIONS
} from '../constants';
import { Tooltip } from './Tooltip';

interface HumanizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    tone: string, 
    level: string,
    sentenceComplexity: string,
    vocabularyRichness: string,
    textLength: string
  ) => void;
  isLoading: boolean;
}

const SelectInput: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[]}> = ({label, value, onChange, options}) => (
    <div>
        <label htmlFor={label} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <select
            id={label}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
            {options.map(option => <option key={option}>{option}</option>)}
        </select>
    </div>
);


export const HumanizeModal: React.FC<HumanizeModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [tone, setTone] = useState(HUMANIZETONE_OPTIONS[0]);
  const [level, setLevel] = useState(HUMANIZELEVEL_OPTIONS[1]);
  const [sentenceComplexity, setSentenceComplexity] = useState(SENTENCE_COMPLEXITY_OPTIONS[1]);
  const [vocabularyRichness, setVocabularyRichness] = useState(VOCABULARY_RICHNESS_OPTIONS[1]);
  const [textLength, setTextLength] = useState(TEXT_LENGTH_OPTIONS[1]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(tone, level, sentenceComplexity, vocabularyRichness, textLength);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 transform transition-all">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Humanize Text</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Adjust the controls to rewrite your text. The original text in the editor will be replaced.
        </p>
        <div className="mt-6 space-y-4">
            <Tooltip title="Choose the overall tone for the rewritten text.">
                <SelectInput label="Tone" value={tone} onChange={(e) => setTone(e.target.value)} options={HUMANIZETONE_OPTIONS} />
            </Tooltip>
            <Tooltip title="Control how much the text is changed. 'Subtle' makes minor changes, 'Strong' rewrites more extensively.">
                <SelectInput label="Intensity Level" value={level} onChange={(e) => setLevel(e.target.value)} options={HUMANIZELEVEL_OPTIONS} />
            </Tooltip>
             <Tooltip title="Define the complexity of sentence structures in the output.">
                <SelectInput label="Sentence Complexity" value={sentenceComplexity} onChange={(e) => setSentenceComplexity(e.target.value)} options={SENTENCE_COMPLEXITY_OPTIONS} />
            </Tooltip>
             <Tooltip title="Control the sophistication of the vocabulary used.">
                <SelectInput label="Vocabulary Richness" value={vocabularyRichness} onChange={(e) => setVocabularyRichness(e.target.value)} options={VOCABULARY_RICHNESS_OPTIONS} />
            </Tooltip>
            <Tooltip title="Guide the AI to make the rewritten text shorter, longer, or similar in length to the original.">
                 <SelectInput label="Text Length" value={textLength} onChange={(e) => setTextLength(e.target.value)} options={TEXT_LENGTH_OPTIONS} />
            </Tooltip>
        </div>
        <div className="mt-8 flex justify-end space-x-3">
          <Tooltip title="Close without making changes">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
          </Tooltip>
          <Tooltip title="Rewrite the text using the selected options">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isLoading ? (
                  <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Humanizing...
                  </>
              ) : 'Confirm & Humanize'}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Tooltip } from './Tooltip';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    // Simulate a quick async operation
    setTimeout(() => {
        onSubmit(feedback);
        setFeedback(''); // Reset for next time
        setIsSubmitting(false);
    }, 200);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 transform transition-all">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Submit Feedback</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We'd love to hear your thoughts or suggestions on how we can improve EKEZISOFFICAL WRITER.
        </p>
        <div className="mt-6">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you think..."
            className="w-full h-32 p-3 text-base leading-relaxed bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-y"
            disabled={isSubmitting}
            aria-label="Feedback input"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Tooltip title="Close the feedback form">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
          </Tooltip>
          <Tooltip title="Send your feedback to the team">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !feedback.trim()}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

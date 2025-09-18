<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1RR5sBC1iUcGd0728IVpO2GMtHIAw9chB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
   - Get your API key from: https://makersuite.google.com/app/apikey
3. Run the app:
   `npm run dev`

## Features

- **AI Content Detection**: Advanced forensic analysis to detect AI-generated text
- **Writing Quality Analysis**: Grammar, spelling, style, and clarity improvements
- **Plagiarism Detection**: Check for potential plagiarism against online sources
- **Text Humanization**: Rewrite AI-generated text to sound more human
- **Grammar Correction**: Fix grammar and spelling errors
- **Proofreading**: Comprehensive text review for professional writing
- **Text Summarization**: Generate concise summaries
- **Translation**: Translate text between multiple languages
- **Language Detection**: Automatic detection of text language

## Keyboard Shortcuts

- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Y` / `Cmd+Y` or `Ctrl+Shift+Z` / `Cmd+Shift+Z`: Redo
- `Ctrl+Enter` / `Cmd+Enter`: Accept changes in comparison view
- `Escape`: Discard changes in comparison view

## Error Handling

The application includes comprehensive error handling for:
- API failures
- Network issues
- Invalid responses
- Empty text validation
- File upload errors
- Clipboard operations

## Performance Optimizations

- Memoized components and calculations
- Debounced language detection
- Limited history size for undo/redo
- Optimized re-renders with useCallback
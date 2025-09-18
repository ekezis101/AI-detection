import { useState, useCallback } from 'react';

export const useHistoryState = (initialState: string) => {
  const [state, setState] = useState({
    history: [initialState],
    currentIndex: 0,
  });

  const set = useCallback((value: string) => {
    // If the new value is the same as the current one, do nothing
    if (value === state.history[state.currentIndex]) {
      return;
    }
    
    setState(prevState => {
      // Create a new history from the start up to the current index
      const newHistory = prevState.history.slice(0, prevState.currentIndex + 1);
      newHistory.push(value);
      
      // Limit history size to prevent memory issues
      const maxHistorySize = 50;
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        return {
          history: newHistory,
          currentIndex: newHistory.length - 1,
        };
      }
      
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prevState => {
      if (prevState.currentIndex > 0) {
        return {
          ...prevState,
          currentIndex: prevState.currentIndex - 1,
        };
      }
      return prevState;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prevState => {
      if (prevState.currentIndex < prevState.history.length - 1) {
        return {
          ...prevState,
          currentIndex: prevState.currentIndex + 1,
        };
      }
      return prevState;
    });
  }, []);

  // Update state when dependencies change
  useEffect(() => {
    setState(prevState => ({
        ...prevState,
    }));
  }, [state.currentIndex, state.history]);
  
  return {
    state: state.history[state.currentIndex],
    setState: set,
    undo,
    redo,
    canUndo: state.currentIndex > 0,
    canRedo: state.currentIndex < state.history.length - 1,
  };
};

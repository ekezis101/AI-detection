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
    
    // Create a new history from the start up to the current index
    const newHistory = state.history.slice(0, state.currentIndex + 1);
    newHistory.push(value);
    
    setState({
      history: newHistory,
      currentIndex: newHistory.length - 1,
    });
  }, [state.currentIndex, state.history]);

  const undo = useCallback(() => {
    if (state.currentIndex > 0) {
      setState(prevState => ({
        ...prevState,
        currentIndex: prevState.currentIndex - 1,
      }));
    }
  }, [state.currentIndex]);

  const redo = useCallback(() => {
    if (state.currentIndex < state.history.length - 1) {
      setState(prevState => ({
        ...prevState,
        currentIndex: prevState.currentIndex + 1,
      }));
    }
  }, [state.currentIndex, state.history.length]);
  
  return {
    state: state.history[state.currentIndex],
    setState: set,
    undo,
    redo,
    canUndo: state.currentIndex > 0,
    canRedo: state.currentIndex < state.history.length - 1,
  };
};

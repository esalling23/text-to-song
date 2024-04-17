'use client'

import React, {
  useReducer,
  useContext,
  createContext,
  useCallback,
  useMemo,
} from 'react';
import { combinedReducer, combinedState } from './reducer';

export const GameStateCtx = createContext();

export const GameStateCtxProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(combinedReducer, combinedState);

  const gameDispatch = useCallback(
    (action) => {
      if (typeof action === 'function') {
        action(gameDispatch, () => gameState);
      } else {
        dispatch(action);
      }
    },
    [dispatch, gameState],
  );

  const contextValue = useMemo(
    () => ({
      gameState,
      gameDispatch
    }),
    [
      gameState,
      gameDispatch,
    ],
  );

  return (
    <GameStateCtx.Provider value={contextValue}>
      {children}
    </GameStateCtx.Provider>
  );
};

export const useGameStateCtx = () => useContext(GameStateCtx);

export const withGameContext = (WrappedComponent) => () =>
  (
    <GameStateCtxProvider>
      <WrappedComponent />
    </GameStateCtxProvider>
  );

'use client'

import React, {
  useReducer,
  useContext,
  createContext,
  useCallback,
  useMemo,
} from 'react';
import { combinedReducer, combinedState } from './reducer';
import useSockets from '@/hooks/useSockets';

export const GameStateCtx = createContext();

export const GameStateCtxProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(combinedReducer, combinedState);

	const { isConnected, transport } = useSockets(dispatch);

  const contextValue = useMemo(
    () => ({
      gameState,
      gameDispatch: dispatch,
			isConnected,
			transport
    }),
    [
      gameState,
      dispatch,
			isConnected,
			transport
    ],
  );

  return (
    <GameStateCtx.Provider value={contextValue}>
      {isConnected && children}
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

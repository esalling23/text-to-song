'use client'

import React, {
  useReducer,
  useContext,
  createContext,
  useMemo,
	Dispatch,
	SetStateAction,
} from 'react';
import { combinedReducer, combinedState, initialState } from './reducer';
import useSockets from '@/hooks/useSockets';
import { Socket } from 'socket.io-client';
import { ACTION_TYPE } from './actions';

export const GameStateCtx = createContext({
	gameState: initialState,
	gameDispatch: {} as Dispatch<SetStateAction<typeof initialState>>,
	isConnected: false,
	transport: {} as Socket<any, any>
});

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

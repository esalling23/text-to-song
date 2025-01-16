'use client'

import React, {
  useReducer,
  useContext,
  createContext,
  useMemo,
} from 'react';
import { combinedReducer, combinedState, GameAction, GameState, initialState } from './reducer';
import useSockets from '@/hooks/useSockets';
import { Socket } from 'socket.io-client';
import { ACTION_TYPE } from './actions';

export const GameStateCtx = createContext({
	gameState: initialState,
	gameDispatch: {} as React.Dispatch<GameAction>,
	isConnected: false,
	transport: "None"
});

export const GameStateCtxProvider = ({ children }: { children: any }) => {
  const [gameState, dispatch] = useReducer<React.Reducer<GameState, GameAction>>(combinedReducer, combinedState);

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

export const withGameContext = (WrappedComponent: any) => {
  const WithContext = () => (
    <GameStateCtxProvider>
      <WrappedComponent />
    </GameStateCtxProvider>
  );
  return <WithContext />
}
  

'use client'
import { getGameRoom, getPlayerId, getSocketId } from '@/context/selectors';
import './DebugPanel.css'
import { useGameStateCtx } from '@/context';
import classNames from 'classnames';
import { useState } from 'react';

const DebugPanel = ({

}) => {
	const {
		gameState,
		gameDispatch,
		isConnected,
		transport,
	} = useGameStateCtx();

	const { gameId, gameCode } = getGameRoom(gameState);
	const playerId = getPlayerId(gameState);
	const socketId = getSocketId(gameState);

	const [isHidden, setIsHidden] = useState(true)

	const togglePanel = () => {
		setIsHidden(curr => !curr)
	}

	return (
		<div className="absolute top-0 left-0">
			<button onClick={togglePanel}>Toggle Debug</button>

			<div className={classNames(
				"panel", 
				{ 
					hidden: isHidden
				}
			)}>
				<p>Status: { isConnected ? "connected" : "disconnected" }</p>
				<p>Transport: { transport }</p>

				<hr />

				<p>Room Id: {gameId || 'null'}</p>
				<p>Code: {gameCode || 'null'}</p>
				<p>Player ID: {playerId || 'null'}</p>
				<p>Socket ID: {socketId || 'null'}</p>
			</div>
		</div>
	)
}

export default DebugPanel
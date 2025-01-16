'use client'
import { killGame } from "@/lib/api/game";
import useRefreshGame from "@/hooks/useRefreshGame";
import { useGameStateCtx } from "@/context";
import { useCallback } from "react";
import { getGameRoom, getSocketId } from "@/context/selectors";

const KillGameButton = () => {
	const { gameState, gameDispatch } = useGameStateCtx()
	const { gameId } = getGameRoom(gameState)
	const socketId = getSocketId(gameState)
	const { refreshGameData } = useRefreshGame(gameDispatch)
	
	const handleKillGame = useCallback(() => {
		if (!socketId || !gameId) return;

		killGame(gameId, socketId)
			.then(res => {
				refreshGameData(gameId)
			})
			.catch(console.error)
	}, [refreshGameData, gameId])

	if (!gameId) {
		return <></> // should we hide instead?
	}

	return (
		<button 
			onClick={handleKillGame}
			className="absolute right-0 top-0"
		>Kill Game</button>
	)
}

export default KillGameButton
import { useCallback, useEffect, useRef } from "react";
import { socket, SOCKET_EVENTS } from "../../socket";
import { clearRoom, initGame, setGameRoom, setGameState, setPlayers } from "@/context/actions";
import { GameUpdateData, PlayerData } from "@/lib/types";
import { getGame } from "@/lib/api/game";
import { Dispatch } from "@reduxjs/toolkit";

const useRefreshGame = (
	gameDispatch: Dispatch
) => {
	const onGameUpdated = useCallback(({ game, players }: GameUpdateData) => {
		console.log(`Game Updated -- Room ID: ${game.id}`)

		if (!game.isActive) {
			console.log('game inactive --- clearing local storage')
			window.localStorage.setItem('gameId', '')
			gameDispatch(clearRoom())
			return;
		}

		console.log('game updated --- setting local storage', { gameId: game.id })
		window.localStorage.setItem('gameId', game.id)

		gameDispatch(setGameRoom(game.id, game.gameCode))
		gameDispatch(setPlayers(players || []))
		if (game.isStarted) {
			gameDispatch(setGameState(game))
			// gameDispatch(initGame(res.data.game.rounds))
		}
	}, [gameDispatch])

	const refreshGameData = useCallback((gameId: string) => {
		// try to restore session
		getGame(gameId)
			.then((res: any) => onGameUpdated(res.data))
			.catch(err => {
				console.error({err})
				console.log('fetch game error --- clearing local storage')
				window.localStorage.setItem('gameId', '')
				window.localStorage.setItem('playerId', '')
				gameDispatch(clearRoom())
			})
	}, [gameDispatch, onGameUpdated])

	useEffect(() => {
		// Attempt session refresh
		const gameId = window.localStorage.getItem('gameId')

		if (gameId) {
			refreshGameData(gameId)
		}

		socket.on(SOCKET_EVENTS.REFRESH_GAME, refreshGameData)
		
    return () => {
			socket.off(SOCKET_EVENTS.REFRESH_GAME, refreshGameData);
    };
  }, [refreshGameData, gameDispatch]);

	return { onGameUpdated, refreshGameData }
}

export default useRefreshGame
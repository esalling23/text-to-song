'use client'
import { killGame } from "@/lib/api/game";

interface KillProps {
	gameId: string;
	socketId: string;
	onSuccess: Function;
}

const KillGameButton = ({ gameId, socketId, onSuccess }: KillProps) => {
	const handleKillGame = () => {
		if (!socketId || !gameId) return;

		killGame(gameId, socketId)
				.then(res => {
					console.log(res)
					onSuccess()
				})
				.catch(console.error)
	}

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
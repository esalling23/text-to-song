import { Guess, Player } from "@prisma/client"
import PlayerIcon from "../PlayerIcon"
import { getRoundGuesses } from "@/context/selectors"
import { useGameStateCtx } from "@/context"
import { useMemo } from "react"

interface PlayersDisplayProps {
	players: Array<Player>
}

const PlayersDisplay = ({
	players,
}: PlayersDisplayProps) => {
	const { gameState } = useGameStateCtx()
	const playerGuesses = getRoundGuesses(gameState)

	const playerIcons = useMemo(() => {
		return players.map((player: Player) => (
			<PlayerIcon
				key={player.id}
				name={player.displayName}
				hasGuessed={playerGuesses?.filter((g: Guess) => g.playerId === player.id).length > 0}
			/>
		))
	}, [players, playerGuesses])

	return <div style={{ display: 'flex', flexDirection: 'row' }}>
		{playerIcons}
	</div>
}

export default PlayersDisplay
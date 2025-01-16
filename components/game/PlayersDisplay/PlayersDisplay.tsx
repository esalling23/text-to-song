import { Guess, Player } from "@prisma/client"
import PlayerIcon from "../PlayerIcon"
import './PlayersDisplay.css'
import { getRoundGuesses } from "@/context/selectors"
import { useGameStateCtx } from "@/context"
import { useMemo } from "react"
import { MAX_PLAYERS } from "../../../lib/constants"
import { PlayerData } from "@/lib/types"

interface PlayersDisplayProps {
	players: Array<PlayerData>;
	isEmptyDisplayed: boolean;
}

const PlayersDisplay = ({
	players,
	isEmptyDisplayed
}: PlayersDisplayProps) => {
	const { gameState } = useGameStateCtx()
	const playerGuesses = getRoundGuesses(gameState)

	const playerIcons = useMemo(() => {
		const nonEmptySlots = players?.map((player: PlayerData) => (
			<PlayerIcon
				key={player.id}
				name={player.displayName}
				icon={player.icon}
				hasGuessed={playerGuesses?.filter((g: Guess) => g.playerId === player.id).length > 0}
			/>
		))

		if (isEmptyDisplayed) {
			const allSlots = [...nonEmptySlots, ...Array.from({ length: MAX_PLAYERS - nonEmptySlots.length }).map((_, i) => (
				<PlayerIcon 
					key={`empty-${i}`}
					isEmpty
					name=""
					icon={'empty'}
					hasGuessed={false}
				/>
			))]
			console.log({ allSlots })

			return allSlots
		}

		return nonEmptySlots
	}, [players, playerGuesses, isEmptyDisplayed])

	return <div 
		className="player-display-container w-full h-full absolute top-0 flex flex-row "
	>
		{playerIcons}
	</div>
}

export default PlayersDisplay
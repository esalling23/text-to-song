import { getCurrentRoundIndex, getGameRoom, getPlayersInRoom } from '@/context/selectors';
import { useGameStateCtx } from '@/context';
import { PlayerData } from '@/lib/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { poster } from '@/lib/fetchHelpers';
import PlayerScoreRow from '../PlayerScoreRow';

interface RoundScoresProps {
	scoreChanges: {
		[key: string]: number;
	};
}

const RoundScores = ({
	scoreChanges
}: RoundScoresProps) => {
	const { gameState, gameDispatch } = useGameStateCtx();

	const { gameId } = getGameRoom(gameState);
	const round = getCurrentRoundIndex(gameState)
	const playersInRoom = getPlayersInRoom(gameState);

	const [scoreCompleteCount, setScoreCompleteCount] = useState(0);
	const [nextRoundButton, setNextRoundButton] = useState(false)

	const onScoreComplete = useCallback(() => {
		setScoreCompleteCount(curr => curr + 1)
	}, [])

	const onNextRound = useCallback(() => {
		poster(`/api/game/${gameId}/round/complete`)
				.catch(console.error)
	}, [gameId])

	useEffect(() => {
		if (scoreCompleteCount >= playersInRoom.length) {
			setNextRoundButton(true)
		}
	}, [scoreCompleteCount, playersInRoom, gameId])

	const scoreRows = useMemo(() => {
		return playersInRoom?.map((data: PlayerData) => (
			<PlayerScoreRow
				id={data.id}
				key={data.id}
				displayName={data.displayName}
				fromScore={data.totalScore - scoreChanges[data.id]}
				toScore={data.totalScore}
				scoreChange={scoreChanges[data.id]}
				onScoreComplete={onScoreComplete}
			/>
		))
	}, [playersInRoom, onScoreComplete, scoreChanges])

	return (
		<div className="screen flex-center">
			<h2>Round {round + 1} complete! Let's check the scoreboard...</h2>

			<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
				{scoreRows}
			</div>

			{nextRoundButton && <button onClick={onNextRound}>Continue</button>}
		</div>
	)
}

export default RoundScores
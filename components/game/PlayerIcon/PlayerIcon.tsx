import { getIsPlaying } from '@/context/selectors';
import './PlayerIcon.css'
import classnames from 'classnames'
import { useGameStateCtx } from '@/context';

interface PlayerIconProps {
	name: string;
	hasGuessed: boolean;
}

const PlayerIcon = ({
	name,
	hasGuessed
}: PlayerIconProps) => {
	const { gameState } = useGameStateCtx()
	const isPlaying = getIsPlaying(gameState)
	return (
		<div className={classnames(
				"player-icon flex-center", 
				{ 'guess-waiting': isPlaying && !hasGuessed }
			)}>
			<div className="player-image flex-center">:)</div>
			<p className="player-name text-black">{name}</p>
		</div>
	)
}

export default PlayerIcon
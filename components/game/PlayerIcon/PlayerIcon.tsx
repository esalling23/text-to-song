import { getIsPlaying } from '@/context/selectors';
import './PlayerIcon.css'
import classnames from 'classnames'
import { useGameStateCtx } from '@/context';

import Image from 'next/image';
import PlayerIcons, { EmptyPlayerIcon } from '../../../lib/icons';
interface PlayerIconProps {
	name: string;
	hasGuessed: boolean;
	isEmpty?: boolean;
	icon?: string;
}

const PlayerIcon = ({
	name,
	hasGuessed,
	isEmpty = false,
	icon = 'saxophone'
}: PlayerIconProps) => {
	const { gameState } = useGameStateCtx()
	const isPlaying = getIsPlaying(gameState)
	return (
		<div className={classnames(
				"player-icon flex-center mx-2 md:mx-12 lg:mx-24", 
				{ 
					'guess-waiting': isPlaying && !hasGuessed,
					'empty': isEmpty
				}
			)}>
			<Image
				alt={`${icon || 'empty'} player icon`}
				className="player-image flex-center"
				width={150}
				height={150}
				src={PlayerIcons[icon] || EmptyPlayerIcon}
			/>
			<p className="player-name text-black">{name}</p>
		</div>
	)
}

export default PlayerIcon
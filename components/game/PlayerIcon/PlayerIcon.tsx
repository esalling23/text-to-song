import './PlayerIcon.css'

interface PlayerIconProps {
	name: string;
}

const PlayerIcon = ({
	name
}: PlayerIconProps) => {
	return (
		<div className="player-icon flex-center">
			<div className="player-image flex-center">:)</div>
			<p className="player-name text-black">{name}</p>
		</div>
	)
}

export default PlayerIcon
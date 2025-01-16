import classNames from "classnames";
import PlayerIcons from "../../../../lib/icons";
import { SOCKET_EVENTS } from "../../../../socket";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import './IconForm.css'
import { selectIcon } from "@/lib/api/player";

interface IconFormProps {
	playerId: string;
	gameCode: string;
	socket: any;
}

export interface IconEvent {
	gameCode: string;
	playerId: string;
	icon: string;
}

const IconForm = ({ playerId, gameCode, socket }: IconFormProps) => {
	const [activeIcon, setActiveIcon] = useState('')
	const [availableIcons, setAvailableIcons] = useState<Set<string>>(new Set(Object.keys(PlayerIcons)))

	useEffect(() => {
		function onSelectIcon({ gameCode: gCode, icon, playerId }: IconEvent) {
			console.log({ gameCode, icon })
			if (gameCode !== gCode) return
			// to do - validation
			setAvailableIcons(curr => new Set([...curr].filter(i => i !== icon)))
		}
		function onDeselectIcon({ gameCode: gCode, icon, playerId }: IconEvent) {
			console.log({ gameCode, icon })
			if (gameCode !== gCode) return

			setAvailableIcons(curr => new Set([...curr, icon]))
		}
		socket.on(SOCKET_EVENTS.SELECT_ICON, onSelectIcon)
		socket.on(SOCKET_EVENTS.DESELECT_ICON, onDeselectIcon)

		return () => {
			socket.off(SOCKET_EVENTS.SELECT_ICON, onSelectIcon)
			socket.off(SOCKET_EVENTS.DESELECT_ICON, onDeselectIcon)
		}
	}, [gameCode])

	const onSelectIcon = useCallback((icon: string) => {
		if (activeIcon) {
			console.log(SOCKET_EVENTS.DESELECT_ICON)
			socket.emit(SOCKET_EVENTS.DESELECT_ICON, { gameCode, playerId, icon: activeIcon })
		}

		selectIcon({ gameCode, playerId, icon })
			.then(() => {
				setActiveIcon(icon)
			})
			.catch(console.error)
	}, [gameCode, activeIcon])
	
	return (
		<div className="text-center">
			{Object.keys(PlayerIcons).map(key => (
				<button 
					onClick={() => onSelectIcon(key)} 
					key={key}
					disabled={!availableIcons.has(key)}
					className={classNames(
						{ 
							isSelected: activeIcon === key,
							isAvailable: availableIcons.has(key)
						}
					)}
				>
					<Image
						alt={`${key} icon option`}
						width={50}
						height={50}
						src={PlayerIcons[key]}
					/>
					</button>
			))}
		</div>
	)
}

export default IconForm
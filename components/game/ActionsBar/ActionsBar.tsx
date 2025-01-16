'use client'
import { useMemo } from "react"
import { usePathname } from "next/navigation"
import DebugPanel from "../../debug/DebugPanel";
import KillGameButton from "../../KillGameButton";

const sharedActions = [
	<DebugPanel key="debug-panel"/>
]

const ActionsBar = () => {
	const path = usePathname();
	
	const actions = useMemo(() => {
		if (path === '/game') {
			// group
			return [
				...sharedActions,
				<KillGameButton key="kill-game-button" />
			]
		}
		
		return sharedActions
	}, [path])

	return <div className="relative top-0 w-full flex flex-row h-12">
		{actions}
	</div>
}

export default ActionsBar
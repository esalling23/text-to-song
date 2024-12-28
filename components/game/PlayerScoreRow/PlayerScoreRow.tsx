import './PlayerScoreRow.css'
import { useEffect, useState } from "react";
import { motion } from 'motion/react'
import NumberFlow from '@number-flow/react'

interface PlayerScoreRowProps {
	id: string;
	displayName: string;
	fromScore: number;
	toScore: number;
	scoreChange: number;
	onScoreComplete: Function;
}

const scoreChangeVariants = {
	initial: { opacity: 0 },
	change: { opacity: 1 },
	total: { x: -100, opacity: 0, transition: { duration: 1, ease: 'easeOut' }}
}

const PlayerScoreRow = ({
	id,
	displayName,
	fromScore,
	toScore,
	scoreChange,
	onScoreComplete
}: PlayerScoreRowProps) => {
	const [hasAnimated, setHasAnimated] = useState(false)
	const [scoreValue, setScoreValue] = useState(fromScore)
	const [scoreComplete, setScoreComplete] = useState(false)

	const [animateStep, setAnimateStep] = useState<"change" | "total">("change")

	useEffect(() => {
		let timeout: NodeJS.Timeout
    if (scoreComplete) {
			timeout = setTimeout(() => {
				onScoreComplete()
			}, 2000)
		}

		return () => timeout && clearTimeout(timeout)
  }, [scoreComplete]);

	useEffect(() => {
		let timeout: NodeJS.Timeout
    if (!hasAnimated) {
			timeout = setTimeout(() => {
				setHasAnimated(true)
				setScoreValue(toScore)
			}, 3000)
		}
		
		return () => timeout && clearTimeout(timeout)
  }, [hasAnimated, toScore]);

	return (
		<div 
			key={id}
			className="player-score-row"
		>
			<p>{displayName}:</p>
			<NumberFlow
				animated={animateStep === "total"}
				value={scoreValue}
				spinTiming={{ duration: 1500, easing: 'ease-out' }}
				continuous={true}
				onAnimationsFinish={(_e: CustomEvent) => setScoreComplete(true)}
			/>

			<motion.div
				initial={{ opacity: 0 }}
				animate={animateStep}
				variants={scoreChangeVariants}
			>
				+ {scoreChange}
			</motion.div>
		</div>
	)
}

export default PlayerScoreRow
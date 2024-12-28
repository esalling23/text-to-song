import '../RoundResults.css'
import { motion } from "motion/react"
import { GuessData } from '@/lib/types';
import { useEffect, useState } from 'react';

const variants = {
	initial: { opacity: 0 },
	active: { opacity: 1 }
}

interface ResultsBlockProps {
	guess: GuessData;
	shouldAnimate: boolean;
	onAnimationComplete: Function;
}

const ResultsBlock = ({
	guess,
	shouldAnimate = false,
	onAnimationComplete
}: ResultsBlockProps) => {
	const [animateStatus, setAnimateStatus] = useState<"inactive" | "active" | "complete">(
		"inactive"
	);

	useEffect(() => {
		if (shouldAnimate) setAnimateStatus("active")
	}, [shouldAnimate])

	return <motion.div 
		key={`player-${guess.playerId}-guess`}
		variants={variants}
		animate={animateStatus}
		onAnimationComplete={() => {
			onAnimationComplete()
			setAnimateStatus("complete")
		}}
	>
		<motion.h1>Player {guess.playerId} guessed:</motion.h1>
		<motion.h2>{guess.title} by {guess.artist}</motion.h2>
		<motion.div 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { delay: 2 }}}
		>
			{guess.isCorrect ? '✅' : '❌'}
		</motion.div>
	</motion.div>
}

export default ResultsBlock
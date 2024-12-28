import { getRoundGuesses, getRoundSong, getSongLyrics } from '@/context/selectors';
import './RoundResults.css'
import { useGameStateCtx } from '@/context';
import { AnimatePresence, motion, useAnimate } from "motion/react"
import { GuessData } from '@/lib/types';
import { useMemo, useState } from 'react';
import ResultsBlock from './ResultsBlock';
import RoundScores from '../RoundScores';

const revealVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: { duration: 1, delay: 1 } },
	exit: { opacity: 0, transition: { duration: 0.5 } },
}

const RoundResults = () => {
	const { gameState } = useGameStateCtx();

	const lyrics = getSongLyrics(gameState);
	const guesses = getRoundGuesses(gameState);
	const song = getRoundSong(gameState);
	
	const [guessAnimateCount, setGuessAnimateCount] = useState(0)
	const [revealStep, setAnimateStep] = useState<"lyrics" | "answer" | "results" | "scores">("lyrics")

	const playerGuesses = useMemo(() => {
		if (!guesses || guesses.length === 0) return []

		return guesses.map((guess: GuessData, i: number) => (
			<ResultsBlock 
				key={guess.id}
				guess={guess} 
				shouldAnimate={i === guessAnimateCount}
				onAnimationComplete={() => setGuessAnimateCount(curr => curr + 1)}
			/>
		))
	}, [guesses, guessAnimateCount])

	const scoreChanges = useMemo(() => {
		return guesses.reduce((a: Object, { playerId, score }: GuessData) => {
			return {
				...a,
				[playerId]: score
			}
		}, {})
	}, [guesses])

	const onStepComplete = (nextStep: "lyrics" | "answer" | "results" | "scores") => () => 
		setTimeout(() => setAnimateStep(nextStep), 2000)

	const revealBlock = useMemo(() => {
		switch (revealStep) {
			case "lyrics": 
				return <motion.div
					key="lyrics-block"
					onAnimationComplete={onStepComplete("answer")}
					{...revealVariants}
				>
					<h3>The Song:</h3>
					<motion.p>{lyrics}</motion.p>
				</motion.div>

			case "answer":
				return <motion.div 
					key="answer-block"
					onAnimationComplete={onStepComplete("results")}
					{...revealVariants}
				>
					<h3>Correct Answer:</h3>
					<motion.h2>Title: {song.title} by</motion.h2>
					<motion.h3>Artist: {song.artist?.name}</motion.h3>
				</motion.div>

			case "results":
				return <motion.div
					key="results-block"
					onAnimationComplete={onStepComplete("scores")}
					{...revealVariants}
				>
					<h3>Player Guesses:</h3>
					{playerGuesses}
				</motion.div>

			case "scores":
				return <RoundScores scoreChanges={scoreChanges} />
		}
	}, [revealStep, scoreChanges])

	return (
		<div className="screen flex-center">
			<h2>Nice Guessing! Let's check out the big reveal...</h2>

			<AnimatePresence>
				{revealBlock}
			</AnimatePresence>
		</div>
	)
}

export default RoundResults
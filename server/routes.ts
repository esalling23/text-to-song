import { Router } from 'express';

import updatePlayerName from './routes/updatePlayerName';
import selectIcon from './routes/selectIcon';
import cleanupGames from './routes/cleanupGames';
import getAllGames from './routes/getAllGames';
import createGame from './routes/createGame';
import getGame from './routes/getGame';
import killGame from './routes/killGame';
import joinGame from './routes/joinGame';
import startGame from './routes/startGame';
import roundReplayClip from './routes/roundReplayClip';
import roundGuess from './routes/roundGuess';
import roundComplete from './routes/roundComplete';
import updateGameSocket from './routes/updateGameSocket';

const router = Router();

router.post('/player/update-name', updatePlayerName)
router.post('/player/icon', selectIcon)

router.patch('/games/cleanup', cleanupGames)

router.get('/game', getAllGames)
router.post('/game', createGame)
router.get('/game/:gameId', getGame)
router.delete('/game/:gameId', killGame)
router.patch('/game/:gameId', updateGameSocket)

router.post('/game/join', joinGame)
router.post('/game/:gameId/start', startGame)

router.post('/game/:gameId/round/replay', roundReplayClip)
router.post('/game/:gameId/round/guess', roundGuess)
router.post('/game/:gameId/round/complete', roundComplete)

export default router;

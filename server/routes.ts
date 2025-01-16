import { Router, NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { cleanSongData, findConnectedPlayers, generateRoomCode, getRoomName, getRoomState } from '../lib';
import { MIN_PLAYERS } from '../../lib/constants';
import { generateRounds } from '../gameplay';

import { gameCreationFailed, gameError, gameNotFound, notEnoughPlayers, playerAlreadyGuessed, playerNotInGame } from '../customError';
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

const router = Router();

router.post('/player/update-name', updatePlayerName)
router.post('/player/icon', selectIcon)

router.patch('/games/cleanup', cleanupGames)

router.get('/game', getAllGames)
router.post('/game', createGame)
router.get('/game/:gameId', getGame)
router.delete('/game/:gameId', killGame)
import updateGameSocket from './routes/updateGameSocket'; // Import the route handler
router.patch('/game/:gameId', updateGameSocket)

router.post('/game/join', joinGame)
router.post('/game/:gameId/start', startGame)

router.post('/game/:gameId/round/replay', roundReplayClip)
router.post('/game/:gameId/round/guess', roundGuess)
router.post('/game/:gameId/round/complete', roundComplete)

export default router;

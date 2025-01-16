import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest, SOCKET_EVENTS } from '../../socket';
import { cleanSongData } from '../lib';
import { gameNotFound, playerAlreadyGuessed, playerNotInGame } from '../customError';

const roundGuess = async (req: Request, res: Response, next: NextFunction) => {
  const { io } = getSocketFromRequest(req);
  const { gameId } = req.params;
  const { title, artist, playerId } = req.body;

  try {
    const game = await prisma.game.findUniqueOrThrow({
      where: {
        id: gameId,
        isActive: true,
        isStarted: true,
        isCompleted: false
      },
      include: {
        players: true,
        rounds: {
          include: {
            song: { include: { artist: true } },
            guesses: true
          }
        }
      }
    })

    if (!game) {
      return next(gameNotFound())
    }

    const player = game.players.find(p => p.id === playerId)
    if (!player) {
      return next(playerNotInGame())
    }

    // Sanity check for duplicate round guesses
    const round = game.rounds[game.roundIndex]
    // console.log({game, round})
    const currentRoundGuess = round.guesses.some(g => g.playerId === playerId)
    if (currentRoundGuess) next(playerAlreadyGuessed())

    // Create guess object
    const isCorrectTitle = cleanSongData(title) === cleanSongData(round.song.title)
    const isCorrectArtist = cleanSongData(artist) === cleanSongData(round.song.artist.name)
    const guess = await prisma.guess.create({
      data: {
        title,
        artist,
        player: { connect: { id: player.id } },
        round: { connect: { id: round.id } },
        isCorrect: isCorrectTitle && isCorrectArtist,
        score: (isCorrectArtist ? 50 : 0) + (isCorrectTitle ? 50 : 0)
      },
      include: { player: true }
    })

    // update player total score
    await prisma.player.update({
      where: {
        id: playerId
      },
      data: {
        totalScore: player.totalScore + guess.score
      }
    })


    // Send back all players & round guesses
    const updatedPlayers = await prisma.player.findMany({
      where: {
        gameId: game.id
      }
    })

    const roundGuesses = await prisma.guess.findMany({
      where: {
        roundId: round.id,
      },
      include: { player: true }
    })

    // console.log({updatedPlayers, roundGuesses})

    io.to(game.groupSocketId).emit(SOCKET_EVENTS.PLAYERS_UPDATED, updatedPlayers);
    io.to(game.groupSocketId).emit(SOCKET_EVENTS.ROUND_GUESS, roundGuesses);

    res.status(200).json({ game })
  } catch (err) {
    next(err);
  }
}



export default roundGuess

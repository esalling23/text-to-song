import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { findConnectedPlayers } from '../lib';

const getGame = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gameId = req.params.gameId;
    const game = await prisma.game.findUniqueOrThrow({
      where: { id: gameId },
      include: {
        rounds: {
          include: {
            song: { include: { artist: true } },
            guesses: true
          }
        }
      }
    })


    const players = await findConnectedPlayers(gameId);

    res.status(200).json({ game, players });
  } catch (err) {
    next(err) // Let the error handler deal with not found
  }
}


export default getGame

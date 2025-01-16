import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'
import { getSocketFromRequest } from '../../socket';

const cleanupGames = async (req: Request, res: Response, next: NextFunction) => {
  const { io } = getSocketFromRequest(req);

  const allGames = await prisma.game.findMany()

  const gamesToRemove = allGames.filter(game => {
    // REturn if game is NOT connected
    return !io.sockets.adapter.rooms.get(game.groupSocketId)
  }).map(game => game.id);

  await prisma.game.deleteMany({
    where: { id: { in: gamesToRemove } }
  })

  // console.log({ gamesRemoved })

  res.status(201).send({ message: 'success' })
}


export default cleanupGames

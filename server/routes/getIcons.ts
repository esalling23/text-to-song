import prisma from '../../prisma'
import { NextFunction, Request, Response } from "express";
import { getSocketFromRequest, SOCKET_EVENTS } from "../../socket";
import { gameError } from '../customError';
import { getRoomName } from '../lib';
import { findGameByCode } from '../queries/game';
import PlayerIcons from '../../lib/icons';

const getIcons = async (req: Request, res: Response, next: NextFunction) => {
  const { io } = getSocketFromRequest(req);
  const { gameCode } = req.body;

  try {
    const game = await findGameByCode(gameCode)

    const unavailableIcons = game?.players.map(player => player.icon) || []

    const availableIcons = Object.keys(PlayerIcons)
      .reduce((arr: Array<string>, icon: string) => {
        if (unavailableIcons.includes(icon)) return arr;
        return [...arr, icon]
      }, [])
    res.status(200).send(availableIcons)
  } catch (err) {
    next(err);
  }
}

export default getIcons
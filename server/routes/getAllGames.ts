import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma'

const getAllGames = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const games = await prisma.game.findMany({})
		res.status(200).json({ games });
	} catch(err) {
		next(err)
	}
}


export default getAllGames

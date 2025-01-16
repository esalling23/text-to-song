import prisma from '../../prisma'
import { NextFunction, Request, Response } from "express";
import { getSocketFromRequest, SOCKET_EVENTS } from "../../socket";
import { gameError } from '../customError';
import { getRoomName } from '../lib';

const selectIcon = async (req: Request, res: Response, next: NextFunction) => {
	const { io } = getSocketFromRequest(req);
	const { gameCode, icon, playerId } = req.body;

	if (!icon)
		throw gameError('Missing Icon')

	try {
		const playerWithIcon = await prisma.player.findFirst({
			where: {
				icon
			}
		}) 
		if (playerWithIcon)
			throw gameError('Icon in use')

		// update player icon
		await prisma.player.update({
			where: {
				id: playerId
			},
			data: {
				icon
			}
		})
		
		io.to(getRoomName(gameCode))
			.emit(SOCKET_EVENTS.SELECT_ICON, { gameCode, playerId, icon });

		res.status(200).send()
	} catch(err) {
		next(err);
	}
}

export default selectIcon
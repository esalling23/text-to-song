import prisma from "../../prisma"
const include = {
	rounds: { include: { 
		song: { include: { artist: true } },
		guesses: true
	} },
	players: { include: { guesses: true } }
}
export const findGameByCode = async (gameCode: string) => await prisma.game.findFirst({
	where: {
		gameCode
	},
	include
})
export const findGameById = async (id: string) => await prisma.game.findUniqueOrThrow({
	where: { id },
	include
})
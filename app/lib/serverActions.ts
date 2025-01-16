'use server';
import prisma from "../../prisma";
import { PlayerData } from "./types";

export async function updatePlayer(data: PlayerData) {
  
  const player = await prisma.player.update({
		where: {
			id: data.id
		},
		data: {
			displayName: data.displayName
		}
	});

	console.log(player);

  return { success: true, data: player };
}

export async function updateGameData(id: string) {
	const game = await prisma.game.findUniqueOrThrow({ where: { id } })

	if (!game) {
		return { success: false, error: 'No game found' }
	}

	return { success: true, data: game }
}
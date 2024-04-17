'use server';
import prisma from "../../prisma";
import { socket } from "../../socket";
import { CreateGameData } from "./types";

export async function createGame(data: CreateGameData) {
  // const creator = data.get("creator") as string;

	// const initPlayer = await prisma.player.findFirst({ where: { id: creator } })
	// console.log(initPlayer)
  const game = await prisma.game.create({
		data: {}
	});

	console.log(game);

  return { success: true, data: game };
}
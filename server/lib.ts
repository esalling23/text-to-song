export const getRoomName = (id: string) => `room-${id}`

export const generateRoomCode = (length = 4) => {
	// Create a new Uint8Array to store the random values.
	const array = new Uint8Array(length);

	// Get cryptographically strong random values and fill the array.
	crypto.getRandomValues(array);

	// Convert the array to a string of letters.
	const letters = String.fromCharCode(...Array.from(array.map(n => n % 26 + 97)));

	// Print the random string of letters.
	console.log(letters);
	return letters
}

interface RoomState {
	roomId: string;
	players: string[];
}
export const getRoomState = (io: any, room: string): RoomState => {
	const usersInRoom = io.sockets.adapter.rooms.get(room);
	return {
		roomId: room,
		players: usersInRoom ? Array.from(usersInRoom) : []
	}
}
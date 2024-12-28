## Socket Flow

Group Screen Refresh:

Socket will connect automatically with a NEW socket ID

A. Check LocalStorage for gameId
	A1. if no gameId, do nothing, offer create button
  B. if yes gameId, query for game data w/ current socket id
    B1. if no game found in query, return error & return to A1
		B2. if game found successfully, **update the game group socket id** & refresh all connected players
import combineReducers from 'react-combine-reducers';
import { ACTION_TYPE } from './actions';

export const initialState = {
	room: {
		socketId: null,
		isConnected: false,
		gameId: null,
		gameCode: null,
		playersInRoom: [],
	},
	gameplay: {
		isPlaying: false,
		rounds: [],
		roundGuesses: [],
		roundIndex: 0,
		guessCount: 0,
		scores: [],
	},
	player: {
		id: null,
		displayName: null,
		roundGuess: {
			title: null,
			artist: null
		},
	},
  screen: {
    current: null,
  },
};

const roomReducer = (state, action) => {
	console.log(action)
  switch (action.type) {
    case ACTION_TYPE.SET_SOCKET: {
      return {
        ...state,
        socketId: action.payload,
      };
		}
    case ACTION_TYPE.CLEAR_ROOM: {
      return {
        ...state,
        gameId: null,
				gameCode: null,
				isConnected: false
      };
		}
    case ACTION_TYPE.SET_ROOM: {
      return {
        ...state,
        gameId: action.payload.id,
				gameCode: action.payload.code,
				isConnected: !!action.payload.id
      };
		}
		case ACTION_TYPE.COMPLETE_GAME:
			return {
				...state,
				gameId: null,
				gameCode: null,
				playersInRoom: []
			}
    case ACTION_TYPE.SET_PLAYERS: {
      return {
        ...state,
        playersInRoom: action.payload,
      };
		}
    default:
      return state;
  }
};

const gameplayReducer = (state, { type, payload }) => {
  switch (type) {
		case ACTION_TYPE.COMPLETE_GAME:
		case ACTION_TYPE.CLEAR_ROOM: {
			return initialState.gameplay
		}
    case ACTION_TYPE.SET_GAME: {
      return {
        ...state,
				rounds: payload.rounds,
				roundsIndex: payload.roundIndex,
				isPlaying: payload.isStarted && !payload.isCompleted,
				roundGuesses: payload.rounds[payload.roundIndex]?.guesses
      };
		}
		case ACTION_TYPE.SET_ROUND_GUESSES:
      return {
        ...state,
        roundGuesses: payload
      };
		case ACTION_TYPE.COMPLETE_ROUND:
      return {
        ...state,
        roundIndex: state.roundIndex + 1,
				roundGuesses: [],
				guessCount: 0,
      };
		case ACTION_TYPE.INIT_GAME: {
			return {
				...state,
				rounds: payload,
				roundIndex: 0,
				isPlaying: true,
			}
		}
    default:
      return state;
  }
};

const playerReducer = (state, action) => {
  switch (action.type) {
		case ACTION_TYPE.CLEAR_ROOM: {
			return initialState.player
		}
		case ACTION_TYPE.COMPLETE_ROUND:
			return {
				...state,
				roundGuess: null,
			}
		case ACTION_TYPE.COMPLETE_GAME:
			return {
				...state,
				roundGuess: null,
			}
    case ACTION_TYPE.SET_PLAYER_ID:
      return {
        ...state,
        id: action.payload,
      };
    case ACTION_TYPE.SET_PLAYER_NAME:
      return {
        ...state,
        displayName: action.payload,
      };
    case ACTION_TYPE.SET_PLAYER_ROUND_GUESS:
      return {
        ...state,
        roundGuess: {
					title: action.payload.title,
					artist: action.payload.artist
				}
      };
    default:
      return state;
  }
};

const screenReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_SCREEN:
      return {
        ...state,
        current: action.payload,
      };
    default:
      return state;
  }
};

const [combinedReducer, combinedState] = combineReducers({
  screen: [screenReducer, initialState.screen],
  player: [playerReducer, initialState.player],
  room: [roomReducer, initialState.room],
	gameplay: [gameplayReducer, initialState.gameplay]
});

export { combinedReducer, combinedState };

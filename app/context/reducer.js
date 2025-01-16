import combineReducers from 'react-combine-reducers';
import { ACTION_TYPE } from './actions';
import { GameData, GuessData, PlayerData, RoundData } from '@/lib/types';

export const initialState = {
	room: {
		socketId: null as string | null,
		isConnected: false,
		gameId: null as string | null,
		gameCode: null as string | null,
		playersInRoom: [] as PlayerData[],
	},
	gameplay: {
		isPlaying: false,
		rounds: [] as RoundData[],
		roundGuesses: [] as GuessData[],
		roundIndex: 0,
	},
	player: {
		id: null as string | null,
		displayName: null as string | null,
		roundGuess: null as GuessData | null,
	},
  screen: {
    current: null as string | null,
  },
};

type GameState = typeof initialState
type GameAction = { type: ACTION_TYPE, payload?: any }

const roomReducer = (state: GameState['room'], action: GameAction): GameState['room'] => {
  switch (action.type) {
    case ACTION_TYPE.SET_SOCKET: {
      return {
        ...state,
        socketId: action.payload,
      };
		}
    case ACTION_TYPE.CLEAR_ROOM: {
      return initialState.room
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
			return initialState.room
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

const gameplayReducer = (state: GameState['gameplay'], action: GameAction): GameState['gameplay'] => {
  switch (action.type) {
		case ACTION_TYPE.COMPLETE_GAME:
		case ACTION_TYPE.CLEAR_ROOM: {
			return initialState.gameplay
		}
    case ACTION_TYPE.SET_GAME: {
			const currentRound = action.payload.rounds[action.payload.roundIndex]
      return {
        ...state,
				rounds: action.payload.rounds,
				roundIndex: action.payload.roundIndex,
				isPlaying: action.payload.isStarted && !action.payload.isCompleted,
				roundGuesses: currentRound?.guesses || []
      };
		}
		case ACTION_TYPE.SET_ROUND_GUESSES:
      return {
        ...state,
        roundGuesses: action.payload
      };
		case ACTION_TYPE.COMPLETE_ROUND:
      return {
        ...state,
        roundIndex: state.roundIndex + 1,
				roundGuesses: [],
      };
		case ACTION_TYPE.INIT_GAME: {
			return {
				...state,
				rounds: action.payload,
				roundIndex: 0,
				isPlaying: true,
			}
		}
    default:
      return state;
  }
};

const playerReducer = (state: GameState['player'], action: GameAction): GameState['player'] => {
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
        roundGuess: action.payload
      };
    default:
      return state;
  }
};

const screenReducer = (state: GameState['screen'], action: GameAction): GameState['screen'] => {
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

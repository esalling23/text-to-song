import combineReducers from 'react-combine-reducers';
import { ACTION_TYPE } from './actions';

export const initialState = {
	socket: {
		isConnected: false,
		roomId: null,
		playersInRoom: [],
	},
	player: {
		id: null,
		displayName: null,
	},
  screen: {
    current: null,
  },
};

const socketReducer = (state, action) => {
	console.log(state, action)
  switch (action.type) {
    case ACTION_TYPE.SET_ROOM: {
      return {
        ...state,
        roomId: action.payload,
				isConnected: !!action.payload
      };
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

const playerReducer = (state, action) => {
  switch (action.type) {
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
  socket: [socketReducer, initialState.socket],
});

export { combinedReducer, combinedState };

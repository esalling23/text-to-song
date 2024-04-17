import combineReducers from 'react-combine-reducers';
import { ACTION_TYPE } from './actions';

export const initialState = {
	socket: {
		isConnected: false,
		roomId: null,
		playersInRoom: [],
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
  socket: [socketReducer, initialState.socket],
});

export { combinedReducer, combinedState };

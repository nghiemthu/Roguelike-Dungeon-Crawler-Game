import { combineReducers } from 'redux';
import map from './map';
import player from './player';
import enemy from './enemy';

//import player from './player';

const rootReducer = combineReducers({
	map,
	player,
	enemy
})

export default rootReducer;

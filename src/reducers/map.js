import { handleActions } from 'redux-actions';
import { generateMap, updateGrid } from '../lib/game';
import * as types from '../constants/ActionTypes';
import { dungeons } from '../constants/dungeons';

const dungeon = dungeons[0];
const hasBoss = false;

const DEFAULT_ACTION = {
	level: 0,
	...generateMap(dungeon.mapSize, dungeon.roomCount, dungeon.minSize, 
					dungeon.maxSize, dungeon.healthCount, dungeon.enemyCount, hasBoss)
}

const actionsHandlers = {
	[types.HEALTH_COLLISION]: (state, { payload }) =>({
	    ...state,
	    healths: state.healths.filter(h => 
	    	(h.x != payload.player.position.x + payload.dir.left || h.y != payload.player.position.y + payload.dir.top ))
	}),
	[types.WEAPON_COLLISION]: (state) =>({
	    ...state,
	    weapon: {}
	}),
	[types.GATE_COLLISION]: (state, {payload}) =>({
	    ...state,
	    ...payload.map,
	    level: state.level+1
	})
} 

export default handleActions (
	actionsHandlers,
	DEFAULT_ACTION
)
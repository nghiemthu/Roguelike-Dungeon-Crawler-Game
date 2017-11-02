import { handleActions } from 'redux-actions';
import { generateRandomPos, playerMovement, takeDamage } from '../lib/game';
import * as types from '../constants/ActionTypes';

const DEFAULT_ACTION = {
	enemies: [],
	attackedEnemy: {},
	boss: []
};

const actionsHandlers = {
	[types.RANDOM_PLAYER_POSITION]: (state, { payload }) =>({
		...state,
		enemies: payload.map.enemies.map(e => {e.health = 40+ payload.map.level * 5; e.attack = 5 + payload.map.level * 4; return e})
	}),
	[types.ENEMY_COLLISION]: (state, {payload}) =>({
	    ...state,
	    enemies: takeDamage(state.enemies, payload.player, payload.dir),
	    attackedEnemy: payload.attackedEnemy
	}),
	[types.GATE_COLLISION]: (state, {payload}) =>({
	    ...state,
	    enemies: payload.map.enemies.map(e => {e.health = 20; e.attack = 5; return e}),
		boss:  payload.map.boss.map(e => {e.health = 200; e.attack = 20; return e})
	}),
	[types.BOSS_COLLISION]: (state, {payload}) =>({
	    ...state,
	    boss: (state.boss[0].health >= payload.player.attack) ? state.boss.map(e => {e.health -= payload.player.attack; return e}) : []
	})
} 

export default handleActions (
	actionsHandlers,
	DEFAULT_ACTION
)
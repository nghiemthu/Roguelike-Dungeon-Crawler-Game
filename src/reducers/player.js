import { handleActions } from 'redux-actions';
import { generateRandomPos, playerMovement, renderUnseenGrid } from '../lib/game';
import { weapons } from '../constants/weapon';
import * as types from '../constants/ActionTypes';

const DEFAULT_ACTION = {
	position: { x:-1, y:-1},
	health: 50,
	weapon: weapons[0],
	attack: 5,
	level: 1,
	nextlevel: 10,
	xp: 0,
	unseenGrid: null,
	lightOn: false
};

const actionsHandlers = {
	[types.RANDOM_PLAYER_POSITION]: (state, { payload }) =>({
		...state,
		position: payload.map.playerPos,
		unseenGrid: payload.map.unseenGrid
	}),
	[types.PLAYER_MOVEMENT]: (state, { payload }) =>({
	    ...state,
	    ...playerMovement(state, payload.dir, payload.map, payload.enemy, state.lightOn)
	 }),
	[types.HEALTH_COLLISION]: (state) =>({
	    ...state,
	    health: state.health + 20
	 }),
	[types.ENEMY_COLLISION]: (state, {payload}) =>({
	    ...state,
	    health: (payload.attackedEnemy.health > state.attack ) 
	    		? state.health - payload.attackedEnemy.attack : state.health,
	    xp: (payload.attackedEnemy.health > state.attack ) ? state.xp : state.xp + 20,
	    level: Math.floor(state.xp / 100) + 1
	}),
	[types.WEAPON_COLLISION]: (state) =>({
	    ...state,
	    weapon: weapons[state.weapon.level+1],
	    attack: state.weapon.attack + state.level * 10
	}),
	[types.GATE_COLLISION]: (state, {payload}) =>({
	    ...state,
	    position: payload.map.playerPos
	}),
	[types.BOSS_COLLISION]: (state, {payload}) =>({
	    ...state,
	    health: state.health - payload.enemy.boss[0].attack
	}),
	[types.TOGGLE_LIGHT]: (state, {payload}) =>({
	    ...state,
	    unseenGrid: (state.unseenGrid) ? null: renderUnseenGrid(payload.map.grid, state.position ),
	    lightOn: state.lightOn ? false : true
	})
} 

export default handleActions (
	actionsHandlers,
	DEFAULT_ACTION
)
import { createAction } from 'redux-actions'

import * as types from '../constants/ActionTypes'

export const randomPlayerPos = createAction(types.RANDOM_PLAYER_POSITION)
export const playerMovement = createAction(types.PLAYER_MOVEMENT)
export const healthCollision = createAction(types.HEALTH_COLLISION)
export const enemyCollision = createAction(types.ENEMY_COLLISION)
export const weaponCollision = createAction(types.WEAPON_COLLISION)
export const escapeGateCollision = createAction(types.GATE_COLLISION)
export const bossCollision = createAction(types.BOSS_COLLISION)
export const toggleLight = createAction(types.TOGGLE_LIGHT)


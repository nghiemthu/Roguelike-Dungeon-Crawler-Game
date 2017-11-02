import React from 'react';
import cn from 'classnames';

const tileClasses = (map, ground, player, enemy, pos) =>{
  const health = map.healths.some(h => (h.x == pos.x && h.y == pos.y));
  const escapeGate = map.escapeGate.x == pos.x && map.escapeGate.y == pos.y;
  const isEnemy = enemy.enemies.some(e => (e.x == pos.x && e.y == pos.y));
  const weapon = map.weapon.x == pos.x &&  map.weapon.y == pos.y;
  const isPlayer = (player.position.x == pos.x && player.position.y == pos.y);
  const isBoss = enemy.boss.some(b => (b.x == pos.x && b.y == pos.y));

  return cn('tile', {
    'ground': !!ground,
    'health': health,
    'enemy': isEnemy,
    'player': isPlayer,
    'weapon': weapon,
    'escapeGate': escapeGate,
    'boss': isBoss,
    'unseen': (player.unseenGrid) ? player.unseenGrid[pos.y][pos.x] : false
  })

}

export default ({map, ground, player, enemy, pos}) => (
	<div 
		className={tileClasses(map, ground, player, enemy, pos)}
	/>
)

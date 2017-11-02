import React from 'react';

import Tile from './tile';


const renderTile = (map, player, enemy, y) => (ground, x) => (
	<Tile 
		key={x}
		ground={ground}
		map={map}
		pos={{x, y}} 
		player={player}
		enemy={enemy}
	/>
)

const renderRow = (map, player, enemy) => (row, y) => (
	<div className='row'
		key={y}>
		{row.map(renderTile(map, player, enemy, y))}
	</div>
)

export default ({map, player, enemy}) => (
	<div className="grid">
		{map.grid.map(renderRow(map, player, enemy))}
	</div>
)

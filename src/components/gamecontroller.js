import React, { Component, PropTypes} from 'react';

export default class GameController extends Component {
	
	constructor (props) {
    	super(props)
    	
   	 	this.toggleLight = this.toggleLight.bind(this)
 	}

	render () {
		const { player, map } = this.props;
		const { actions } = this.props;

		return (
			<div>
			<ul>
				<li>Heath: {player.health}</li>
				<li>Weapon: {player.weapon.name}</li>
				<li>Attack: {player.attack}</li>
				<li>Level: {player.level}</li>
				<li>XP: {player.xp}</li>
				<li>Dungeon: {map.level + 1}</li>
				<button onClick={() => this.toggleLight()}>Toggle Light</button>
			</ul>
			</div>
		)
	}

	toggleLight(action) {
		this.props.actions.toggleLight({map: this.props.map});
	}
}

GameController.propTypes = {
  player: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

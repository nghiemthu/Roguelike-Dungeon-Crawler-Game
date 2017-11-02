import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import * as Actions from '../actions/index';

import GameController from './gamecontroller'
import Grid from './grid';
import { healthCollision, enemyCollision, attackedEnemy, weaponCollision, escapeGateCollision, generateMap, bossCollision } from '../lib/game';
import { dungeons } from '../constants/dungeons';

class App extends Component {

  constructor (props) {
  	super(props);
  	this.initPlayer();
  }

  componentDidMount() {
    window.onkeydown = this.handleKeyDown;
  }

  initPlayer = () => {
  	this.props.actions.randomPlayerPos({ map: this.props.map });
  }

  handleKeyDown = (e) => {
    let dir;
    const {map, player, enemy} = this.props;

    switch(e.keyCode) {
        case 37:
            dir = { top: 0, left: -1 , dir: 'LEFT'};
            break;
        case 38:
            dir = { top: -1, left: 0 , dir: 'UP'};
            break;
        case 39:
            dir = { top: 0, left: 1, dir: 'RIGHT'};
            break;
        case 40:
            dir = { top: 1, left: 0, dir: 'DOWN' };
            break;
        default:
            return;
    }

    const dungeon = dungeons[map.level + 1];

    const nextMap = (dungeon) ? generateMap(dungeon.mapSize, dungeon.roomCount, dungeon.minSize, 
                                dungeon.maxSize, dungeon.healthCount, dungeon.enemyCount, dungeon.hasBoss) : {};

    if (healthCollision(player, dir, map)) this.props.actions.healthCollision({ player, dir, map, enemy });
    if (escapeGateCollision(player, dir, map)) 
      this.props.actions.escapeGateCollision({ player, dir, map: nextMap });
    if (weaponCollision(player, dir, map)) this.props.actions.weaponCollision({ player, dir, map });
    if (enemyCollision(player, dir, enemy)) this.props.actions.enemyCollision(
      { player, dir, map, enemy, 
        attackedEnemy: attackedEnemy(player, dir, enemy)
      });

    if (bossCollision(player, dir, enemy)) this.props.actions.bossCollision({ player, dir, map, enemy});
   
    this.props.actions.playerMovement({ player, dir, map, enemy});
  }

  render() {
    var {map, player, enemy} = this.props;
    if (player.health <= 0) alert("You died!");
    if (enemy.boss[0]) if (enemy.boss[0].health<=0) alert("You win!");

    return (
      <div>
     	<h2>Dungeon Crawler</h2>
      <GameController 
        player={player}
        map={map}
        actions={this.props.actions}
      />
      
      <div className="grid-holder">
        <Grid 
          map={map} 
          player={player} 
          enemy={enemy}
        />
      </div>
     	
      </div>
    );
  }
}


App.propTypes = {
  map: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  enemy: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

export default connect(
  // map state to props
  (state) => ({ ...state }),
  // map dispatch to props,
  (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(App)

import { range } from 'ramda';
import { random } from './utils';

// var mapSize = 50;
// var roomCount = 10;
// var minSize = 5;
// var maxSize = 10;

const doesCollide = (room, rooms) => {
  return rooms
    .filter(r => r != room)
    .some(r => 
      !(room.x + room.w < r.x || r.x + r.w < room.x || room.y + room.h < r.y || r.y + r.h < room.y)
    );
};

const squashRooms = (rooms) => {
  
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < rooms.length; j++) {
        var room = rooms[j];
        while (true) {
            var old_position = {
                x: room.x,
                y: room.y
            };
            if (room.x > 1) room.x--;
            if (room.y > 1) room.y--;
            if ((room.x == 1) && (room.y == 1)) break;
            if (doesCollide(room, rooms)) {
                room.x = old_position.x;
                room.y = old_position.y;
                break;
            }
       }
    }
  }

  return rooms;
}

export const generateRooms = (mapSize, roomCount, minSize, maxSize) => {
  var rooms = [];

  for (var i=0; i< roomCount; i++) {  
    var room = {};
    
    room.x = random(1, mapSize - maxSize - 1 );
    room.y = random(1, mapSize - maxSize - 1 );
    room.w = random(minSize, maxSize - 1);
    room.h = random(minSize, maxSize - 1);

    if (doesCollide(room, rooms)) {
      i--;
      continue;
    }
    
    rooms.push(room);
  }
  rooms = squashRooms(rooms); 
  return rooms;
}

const getClosestRoom = (room, rooms) => {
  var center =  {
    x: room.x + room.w/2,
    y: room.y + room.h/2
  }
  var closestRoom = null;
  var closestDistance = 10000;
  
  rooms
    .filter(r => r != room)
    .map(checkRoom => {
      var checkRoomCenter = {
        x: checkRoom.x + room.w/2,
        y: checkRoom.y + room.h/2
      }

      var distance = Math.min(Math.abs(center.x - checkRoomCenter.x - room.w/2 - checkRoom.x/2),
                              Math.abs(center.y - checkRoomCenter.y - room.h/2 - checkRoom.h/2));

      if (distance < closestDistance) {
        closestDistance = distance;
        closestRoom = checkRoom;
      }
    });

  return closestRoom;
}

const generateCorridor = (rooms) => {

  var corridor = [];

  rooms.map(roomA => {
    var roomB = getClosestRoom(roomA, rooms);
    var pointA = {
      x: random(roomA.x, roomA.x + roomA.w - 1 ),
      y: random(roomA.y, roomA.y + roomA.h - 1)
    }
    
    var pointB = {
      x: random(roomB.x, roomB.x + roomB.w - 1),
      y: random(roomB.y, roomB.y + roomB.h - 1)
    }

    while((pointA.x != pointB.x) || (pointA.y != pointB.y)) {
      if (pointA.x != pointB.x) {
        if (pointB.x > pointA.x) pointB.x--;
        else pointB.x++;
      } else if (pointA.y != pointB.y) {
        if (pointB.y > pointA.y) pointB.y--;
        else pointB.y++;
      }
      
      corridor.push({x: pointB.x, y: pointB.y});
    }
  });

  return corridor;
}

export const generateBlank = (mapSize) => range(0, mapSize).map((r) => range(0,mapSize).map(t => 0));

export const generateGrid = (mapSize, rooms) => {
  
  var grid = generateBlank(mapSize);
  var corridor = generateCorridor(rooms);

  return grid
  .map((row, y) => 
    row.map((column, x) =>
      rooms.some((room) => 
        (x >= room.x && x < room.x + room.w && y >= room.y  && y < room.y + room.h)
        || corridor.some(c => (c.x == x && c.y == y)) 
      )
    )
  )
}


export const renderUnseenGrid = (grid, player) => {
  return grid
  .map((row, y) => 
    row.map((column, x) =>
        !(x > player.x - 4 && y > player.y - 4 && x < player.x + 4 && y < player.y + 4 )
      )
    )
}

export const generateMap = (mapSize, roomCount, minSize, maxSize, healthCount, enemyCount, hasBoss) => {
  var rooms = generateRooms(mapSize, roomCount, minSize,maxSize);
  var grid = generateGrid(mapSize, rooms);
  var availablePositions = generateRandomPositions(rooms, grid, 4 + healthCount + enemyCount);

  var playerPos = availablePositions[availablePositions.length -1];
  var weapon = availablePositions[availablePositions.length -2];
  var escapeGate = (hasBoss) ? {} : availablePositions[availablePositions.length -3];
  var healths = availablePositions.slice(4, healthCount + 4);
  var enemies = availablePositions.slice(healthCount + 4, healthCount + enemyCount + 4);
  
  var boss = (hasBoss) ? availablePositions.slice( 0, 4) : [];
  var unseenGrid = renderUnseenGrid(grid, playerPos);

  return {
    rooms,
    grid,
    playerPos,
    weapon,
    healths,
    enemies,
    escapeGate,
    boss,
    unseenGrid
  }
}

export const playerMovement = (player, dir, map, enemy, lightOn) => {
  const temp = {x: player.position.x, y: player.position.y};

  player.position.y += dir.top;
  player.position.x += dir.left;

  //Check collision with walls
  if (!map.grid[player.position.y][player.position.x]) {player.position.x = temp.x; player.position.y = temp.y};

  //Check collision with enemies
  if (enemy.enemies.some(e => e.x == player.position.x && e.y == player.position.y)
    ||enemy.boss.some(e => e.x == player.position.x && e.y == player.position.y)) 
    {player.position.x = temp.x; player.position.y = temp.y};
  
  if (!lightOn) player.unseenGrid = renderUnseenGrid(map.grid, player.position);

  return player;
}

export const healthCollision = (player, dir, map) => 
  map.healths.some(h => h.x == player.position.x + dir.left && h.y == player.position.y + dir.top);

export const escapeGateCollision = (player, dir, map) => 
   (map.escapeGate.x == player.position.x + dir.left && map.escapeGate.y == player.position.y + dir.top);

export const enemyCollision = (player, dir, enemy) => 
  enemy.enemies.some(e => e.x == player.position.x + dir.left && e.y == player.position.y + dir.top);

export const bossCollision = (player, dir, enemy) => 
  enemy.boss.some(e => e.x == player.position.x + dir.left && e.y == player.position.y + dir.top);

export const weaponCollision = (player, dir, map) => 
  (map.weapon.x == player.position.x + dir.left && map.weapon.y == player.position.y + dir.top);

export const attackedEnemy = (player, dir, enemy) => {
  const attackedEnemies= enemy.enemies.filter(e => e.x == player.position.x + dir.left && e.y == player.position.y + dir.top);
  return attackedEnemies[0];
}


export const takeDamage = (enemies, player, dir) => {
  return enemies.map(e => {
    if (e.x == player.position.x + dir.left && e.y == player.position.y + dir.top) {
      e.health -= player.attack;
      if (e.health <= 0) {e.x = -1; e.y = -1;}
    }
    return e;
  })
}

export const generateRandomPos = (rooms) => {
  var pos = {};

  const room = rooms[random(0, rooms.length-1)];

  pos.x = random(room.x + 1, room.x + room.w - 2);
  pos.y = random(room.y + 1, room.y + room.h - 2);

  return pos;
}

export const generateRandomPositions = (rooms, grid, number) => {
  
  const positions = [];

  var pos = generateRandomPos(rooms);
  positions.push(pos);
  positions.push({x: pos.x+1, y: pos.y+1});
  positions.push({x: pos.x, y: pos.y+1});
  positions.push({x: pos.x+1, y: pos.y});

  for (var i=0; i< number; i++){
  
    var pos = generateRandomPos(rooms);

    if (grid[pos.x][pos.y] || positions.indexOf(pos) > -1) {
      i--;
      continue;
    }

    pos = generateRandomPos(rooms);
    positions.push(pos);
  }

  

  return positions;
} 

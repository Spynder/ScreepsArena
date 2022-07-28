import {getObjectsByPrototype, findClosestByPath, getRange} from 'game/utils';
import {StructureSpawn, Creep, StructureContainer} from 'game/prototypes';

export let getSpawn = 			() => getObjectsByPrototype(StructureSpawn).find(spawn => spawn.my)
export let getEnemySpawn = 		() => getObjectsByPrototype(StructureSpawn).find(spawn => !spawn.my)

export let getCreeps = 			(role) => getObjectsByPrototype(Creep).filter(creep => creep.my && creep.exists && (role ? creep.role === role : true));
export let getEnemyCreeps = 	() => getObjectsByPrototype(Creep).filter(creep => !creep.my && creep.exists);

export let inCenter = 			(obj) => obj.x >= 13 && obj.x <= 86;

export function getNeighbours(tile) {
	const deltas = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
	let neighbours = [];
	deltas.forEach(function(delta) {
		neighbours.push({x: tile.x + delta[0], y: tile.y + delta[1]});
	});
	return neighbours;
}

export const ROLE_ATTACKER 	= 	"attacker";
export const ROLE_HAULER =		"hauler";
export const ROLE_HEALER = 		"healer";
export const ROLE_EXTENSIONER = "extensioner";
export const ROLE_SCOUT = 		"scout";
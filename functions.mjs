import {getObjectsByPrototype, findClosestByPath, getRange} from 'game/utils';
import {StructureSpawn, Creep, StructureContainer} from 'game/prototypes';

export let getSpawn = 			() => getObjectsByPrototype(StructureSpawn).find(spawn => spawn.my)
export let getEnemySpawn = 	() => getObjectsByPrototype(StructureSpawn).find(spawn => !spawn.my)

export let getCreeps = 		() => getObjectsByPrototype(Creep).filter(creep => creep.my && creep.exists);
export let getEnemyCreeps = 	() => getObjectsByPrototype(Creep).filter(creep => !creep.my && creep.exists);
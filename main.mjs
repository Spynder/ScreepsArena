import {getObjectsByPrototype, findClosestByPath, getRange, createConstructionSite} from 'game/utils';
import {StructureSpawn, Creep, StructureContainer, StructureRampart, StructureWall, ConstructionSite} from 'game/prototypes';
import {MOVE, CARRY, RANGED_ATTACK, HEAL, WORK, RESOURCE_ENERGY, ERR_NOT_IN_RANGE} from 'game/constants';
import { } from '/arena';

import './creep.mjs';
import './spawn.mjs';
import {getSpawn, getCreeps, ROLE_HAULER, ROLE_ATTACKER, ROLE_HEALER, ROLE_EXTENSIONER, ROLE_SCOUT} from './functions.mjs';

let initDone = false;

function buildWalls() {
	let spawn = getSpawn();
	const structs = [
		{x: -2, y: -2, type: StructureRampart},
		{x: -1, y: -2, type: StructureWall},
		{x: 0, y: -2, type: StructureWall},
		{x: 1, y: -2, type: StructureWall},
		{x: 2, y: -2, type: StructureRampart},

		{x: -2, y: 2, type: StructureWall},
		{x: -1, y: 2, type: StructureWall},
		{x: 0, y: 2, type: StructureWall},
		{x: 1, y: 2, type: StructureWall},
		{x: 2, y: 2, type: StructureWall},

		{x: -2, y: 1, type: StructureWall},
		{x: -2, y: 0, type: StructureWall},
		{x: -2, y: -1, type: StructureWall},

		{x: 2, y: 1, type: StructureWall},
		{x: 2, y: 0, type: StructureWall},
		{x: 2, y: -1, type: StructureWall},
		
	]
	structs.forEach(function(struct) {
		let alreadyPlaced = getObjectsByPrototype(ConstructionSite).find(site => site.x == spawn.x + struct.x && site.y == spawn.y + struct.y);
		if(!alreadyPlaced)
			createConstructionSite(spawn.x + struct.x, spawn.y + struct.y, struct.type);
	});
}

function init() {
	if(initDone) return;

	

	initDone = true;
}

export function loop() {
	init();
	let spawn = getSpawn();

	let myCreeps = getCreeps();
	/*let haulers = myCreeps.filter(creep => creep.role == ROLE_HAULER);
	let attackers = myCreeps.filter(creep => creep.role == ROLE_ATTACKER);
	let healers = myCreeps.filter(creep => creep.role == ROLE_HEALER);
	let hasExtensioner = myCreeps.find(creep => creep.role == ROLE_EXTENSIONER);*/

	let haulers = getCreeps(ROLE_HAULER);
	let attackers = getCreeps(ROLE_ATTACKER);
	let healers = getCreeps(ROLE_HEALER);
	let hasExtensioner = getCreeps(ROLE_EXTENSIONER).length;
	let scouts = getCreeps(ROLE_SCOUT);

	let leader;
	myCreeps.forEach(creep => creep.run());
	if(haulers.length < 1) {
		console.log("Spawning hauler");
		let hauler = spawn.spawnCreep([MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]);
		console.log(hauler);
		if(hauler.error) return;
		else {
			hauler.object.role = ROLE_HAULER;
			return;
		}
	}

	else if(!hasExtensioner) {
		console.log("Spawning extensioner");
		let extensioner = spawn.spawnCreep([MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY]);
		console.log(extensioner);
		if(extensioner.error) return;
		else {
			extensioner.object.role = ROLE_EXTENSIONER;
			return;
		}
	}

	else if(scouts.length < 1) {
		console.log("Spawning scout");
		let scout = spawn.spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, HEAL]);
		console.log(scout);
		if(scout.error) return;
		else {
			scout.object.role = ROLE_SCOUT;
			return;
		}
	}

	else if(true) {
		let attacker = spawn.spawnCreep([MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK]);
		if(attacker.error) return;
		else {
			if(!leader) {
				leader = attacker.object;
			}
			attacker.object.role = ROLE_ATTACKER;
			return;
		}
	}

	/*else if(helpers.length < 2) {
		let helper = spawn.spawnCreep([MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK]);
		if(helper.error) return;
		else {
			helper.object.role = "helper";
			return;
		}
	}*/

	else if(!healers.length) {
		let healer = spawn.spawnCreep([MOVE, HEAL, HEAL, HEAL]);
		if(healer.error) return;
		else {
			healer.object.role = "healer";
			healer.object.leader = leader;
			return;
		}
	}
}
import {getObjectsByPrototype, findClosestByPath, getRange, createConstructionSite} from 'game/utils';
import {StructureSpawn, Creep, StructureContainer, StructureRampart, StructureWall, ConstructionSite} from 'game/prototypes';
import {MOVE, CARRY, RANGED_ATTACK, HEAL, WORK, RESOURCE_ENERGY, ERR_NOT_IN_RANGE} from 'game/constants';
import { } from '/arena';

import './creep.mjs';
import './spawn.mjs';
import {getSpawn, getCreeps} from './functions.mjs';

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
	let haulers = myCreeps.filter(creep => creep.role == "hauler");
	let attackers = myCreeps.filter(creep => creep.role == "attacker");
	let healers = myCreeps.filter(creep => creep.role == "healer");

	let leader;
	myCreeps.forEach(creep => creep.run());

	if(haulers.length < 2) {
		console.log("Spawning hauler");
		let hauler = spawn.spawnCreep([MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]);
		console.log(hauler);
		if(hauler.error) return;
		else {
			hauler.object.role = "hauler";
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
			attacker.object.role = "attacker";
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
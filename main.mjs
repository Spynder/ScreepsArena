import {getObjectsByPrototype, findClosestByPath, getRange} from 'game/utils';
import {StructureSpawn, Creep, StructureContainer} from 'game/prototypes';
import {MOVE, CARRY, ATTACK, HEAL, RESOURCE_ENERGY, ERR_NOT_IN_RANGE} from 'game/constants';
import { } from '/arena';

import './creep.mjs';
import './spawn.mjs';
import {getSpawn, getCreeps} from './functions.mjs';

export function loop() {
	let myCreeps = getCreeps();
	let haulers = myCreeps.filter(creep => creep.role == "hauler");
	let attacker = myCreeps.find(creep => creep.role == "attacker");
	let healer = myCreeps.find(creep => creep.role == "healer");
	let spawn = getSpawn();

	myCreeps.forEach(creep => creep.run());

	if(haulers.length < 2) {
		console.log("Spawning hauler");
		let hauler = spawn.spawnCreep([MOVE, CARRY]);
		console.log(hauler);
		if(hauler.error) return;
		else {
			hauler.object.role = "hauler";
			return;
		}
	}

	else if(!attacker) {
		attacker = spawn.spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK]);
		if(attacker.error) return;
		else {
			attacker.object.role = "attacker";
			return;
		}
	}

	else if(!healer) {
		healer = spawn.spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL]);
		if(healer.error) return;
		else {
			healer.object.role = "healer";
			return;
		}
	}
}
import {getObjectsByPrototype, findClosestByPath, getRange} from 'game/utils';
import {StructureSpawn, Creep, StructureContainer} from 'game/prototypes';
import {RESOURCE_ENERGY, ERR_NOT_IN_RANGE} from 'game/constants';

import {getSpawn, getEnemySpawn, getCreeps, getEnemyCreeps} from './functions.mjs';

Creep.prototype.hauler = function() {
	if(this.store.getUsedCapacity(RESOURCE_ENERGY) == this.store.getCapacity(RESOURCE_ENERGY)) {
		if(this.transfer(getSpawn(), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.moveTo(getSpawn());
		}
	} else {
		let closest = findClosestByPath(this, getObjectsByPrototype(StructureContainer).filter(cont => cont.store.getUsedCapacity(RESOURCE_ENERGY) > 0));
		if(this.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.moveTo(closest);
		}
	}
}
Creep.prototype.attacker = function() {
	let healer = getCreeps().find(creep => creep.role == "healer");
	if(!healer) return;
	let enemySpawn = getEnemySpawn();
	let enemy = findClosestByPath(this, getEnemyCreeps().filter(creep => getRange(this, creep) < 5));
	if(!this.lockedTarget && enemy) {
		this.lockedTarget = enemy;
	}
	if(this.lockedTarget) {
		this.attack(this.lockedTarget);
		if(!this.lockedTarget.exists) {
			this.lockedTarget = undefined; return;
		}
		this.moveTo(this.lockedTarget);
		return;
	}
	this.attack(enemySpawn);
	if(getRange(this, healer) <= 1) {
		this.moveTo(enemySpawn);
	}
}

Creep.prototype.healer = function() {
	let attacker = getCreeps().find(creep => creep.role == "attacker");
	if(!attacker) return;
	this.moveTo(attacker);
	this.heal(attacker);
}

Creep.prototype.run = function() {
	if(!this.role) return;
	return this[this.role]();
}
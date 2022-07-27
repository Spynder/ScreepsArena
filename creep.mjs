import {getObjectsByPrototype, findClosestByPath, findClosestByRange, getRange} from 'game/utils';
import {StructureSpawn, Creep, StructureContainer, ConstructionSite} from 'game/prototypes';
import {RESOURCE_ENERGY, ERR_NOT_IN_RANGE, HEAL} from 'game/constants';

import {getSpawn, getEnemySpawn, getCreeps, getEnemyCreeps} from './functions.mjs';

Creep.prototype.hauler = function() {
	if(this.store.getUsedCapacity(RESOURCE_ENERGY) == this.store.getCapacity(RESOURCE_ENERGY)) {
		if(getSpawn().store.getUsedCapacity(RESOURCE_ENERGY) == getSpawn().store.getCapacity(RESOURCE_ENERGY)) {
			let cs = findClosestByRange(this, getObjectsByPrototype(ConstructionSite));
			if(cs && this.build(cs)) {
				this.moveTo(cs);
			}
		}
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
	//let healer = getCreeps().find(creep => creep.role == "healer");
	let enemySpawn = getEnemySpawn();
	let healer = findClosestByPath(this, getEnemyCreeps().filter(creep => getRange(this, creep) < 3 && creep.body.some(part => part == HEAL)));
	let enemy = findClosestByPath(this, getEnemyCreeps().filter(creep => getRange(this, creep) < 5));
	if(!this.healer && healer) {
		this.healer = healer;
	}
	if(!this.lockedTarget && enemy) {
		this.lockedTarget = enemy;
	}
	//console.log(this.lockedTarget);
	if(this.lockedTarget || this.healer) {
		if(this.lockedTarget && !this.lockedTarget.exists) {
			this.lockedTarget = undefined;
		}
		if(this.healer && !this.healer.exists) {
			this.healer = undefined;
		}
		if(!this.lockedTarget && !this.healer) return;

		let target;
		if((this.healer && getRange(this, this.healer) < 4) || !this.lockedTarget) {
			target = this.healer;
		} else {
			target = this.lockedTarget;
		}

		if(this.rangedAttack(target)) {
			this.heal(this);
		}
		
		//if(!healer) return;
		//if(getRange(this, healer) <= 1) {
		if(getRange(this, target) > 3) {
			this.moveTo(target);
		}
		else if(getRange(this, target) < 3) {
			this.moveTo(getSpawn());
		}
		//}
		return;
	}
	if(this.rangedAttack(enemySpawn)) {
		this.heal(this);
	}

	//if(!healer) return;
	//if(getRange(this, healer) <= 1) {
		this.moveTo(enemySpawn);
	//}
}

Creep.prototype.healer = function() {
	let attacker = getCreeps().find(creep => creep.role == "attacker");
	if(!attacker) return;
	this.moveTo(attacker);
	if(this.hits + 200 <= this.hitsMax) this.heal(this);
	else this.heal(attacker);
}

Creep.prototype.run = function() {
	if(!this.role) return;
	return this[this.role]();
}
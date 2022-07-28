import {findClosestByPath, getRange} from 'game/utils';
import {Creep} from 'game/prototypes';
import {HEAL} from 'game/constants';

import {getSpawn, getEnemySpawn, getEnemyCreeps} from './functions.mjs';

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
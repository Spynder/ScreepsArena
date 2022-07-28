import {Creep} from 'game/prototypes';
import {getCreeps} from './functions.mjs';

Creep.prototype.healer = function() {
	let attacker = getCreeps().find(creep => creep.role == "attacker");
	if(!attacker) return;
	this.moveTo(attacker);
	if(this.hits + 200 <= this.hitsMax) this.heal(this);
	else this.heal(attacker);
}
import {Creep} from 'game/prototypes';
import {getCreeps} from './functions.mjs';

import './role.attacker.mjs';
import './role.hauler.mjs';
import './role.healer.mjs';
import './role.extensioner.mjs';
import './role.scout.mjs';

Creep.prototype.suicide = function() {
	console.log("Creep " + this.role + " has committed suicide. F");
	this.dead = true;
}

Creep.prototype.say = function() {
	var args = Array.prototype.slice.call(arguments);
	console.log(this.role + ": ", ...args);
}

Creep.prototype.isAlive = function() {
	return this.exists && !this.dead;
}

Creep.prototype.getAliveParts = function(spec) {
	return this.body.filter(part => part.hits !== 0 && (spec ? part.type === spec : true));
}

Creep.prototype.run = function() {
	if(!this.isAlive()) return;
	if(!this.role) return;
	return this[this.role]();
}
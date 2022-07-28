import {Creep} from 'game/prototypes';
import {getCreeps} from './functions.mjs';

import './role.attacker.mjs';
import './role.hauler.mjs';
import './role.healer.mjs';
import './role.extensioner.mjs';
import './role.scout.mjs';

Creep.prototype.run = function() {
	if(!this.exists) return;
	if(!this.role) return;
	return this[this.role]();
}
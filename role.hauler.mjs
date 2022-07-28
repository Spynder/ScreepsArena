import {getObjectsByPrototype, findClosestByPath, findClosestByRange, getRange} from 'game/utils';
import {Creep, StructureContainer, ConstructionSite} from 'game/prototypes';
import {RESOURCE_ENERGY, ERR_NOT_IN_RANGE} from 'game/constants';

import {getSpawn} from './functions.mjs';

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
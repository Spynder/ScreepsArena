import {getObjectsByPrototype, findClosestByPath, getRange, createConstructionSite} from 'game/utils';
import {Creep, StructureContainer, StructureExtension, ConstructionSite, Resource} from 'game/prototypes';
import {RESOURCE_ENERGY, MOVE, CARRY, WORK} from 'game/constants';
import {Visual} from 'game/visual';
import {searchPath} from 'game/path-finder';
import { } from '/arena';

import { getNeighbours, inCenter, getRangeToEnemies, getEnemyTargets } from "./functions.mjs";

Creep.prototype.extensioner = function() {
	if(!this.locked) {
		if(!this.getAliveParts(MOVE).length) this.suicide();
		let conts = getObjectsByPrototype(StructureContainer).filter(cont => inCenter(cont) && cont.ticksToDecay-5 > getRange(this, cont) && getRangeToEnemies(cont) > 3);
		let closest = findClosestByPath(this, conts);
		if(!closest) {
			let targets = getEnemyTargets(7);
			let path = searchPath(this, targets, {flee: true}); // force them to walk on swamp
			new Visual().poly(path.path);
			this.moveTo(path.path[0]);
			this.say("Eluding enemies!");
			return;
		}
		this.say("Moving to closest container!");
		new Visual()
			.circle(closest, {radius: .7, fill: "#ffffff", stroke: "#000000"})
			.text(closest.ticksToDecay, {x: closest.x, y: closest.y+1}, {font: 0.6, opacity: .7, color: "#000000", stroke: "#FFFFFF"});
		this.moveTo(closest);
		if(getRange(this, closest) <= 1) {
			this.locked = closest;
		}
	}
	else {
		if(!this.building) {
			if(this.locked.exists && this.locked.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
				if(!this.getAliveParts(CARRY).length || !this.getAliveParts(WORK).length) this.suicide();
				this.say("Emptying container!");
				this.withdraw(this.locked, RESOURCE_ENERGY);
				this.drop(RESOURCE_ENERGY);
			} else {
				if(!this.getAliveParts(CARRY).length || !this.getAliveParts(WORK).length) this.suicide();
				this.say("Starting building!");
				this.building = true;
				getObjectsByPrototype(ConstructionSite).forEach(site => site.remove());
				getNeighbours(this).forEach(function(tile) {
					createConstructionSite(tile.x, tile.y, StructureExtension);
				});
			}
		}
		else {
			if(!this.getAliveParts(CARRY).length || !this.getAliveParts(WORK).length) this.suicide();
			let droppedEnergy = getObjectsByPrototype(Resource).find(resource => getRange(this, resource) <= 1);
			if(!droppedEnergy) {
				this.say("My job is done here. Resetting...");
				delete this.target;
				delete this.building;
				delete this.locked;
				this.drop(RESOURCE_ENERGY); // Excess weight...
				return;
			}
			this.pickup(droppedEnergy);
			let unfilledExtension = getObjectsByPrototype(StructureExtension).find(ext => ext.store.getUsedCapacity(RESOURCE_ENERGY) != ext.store.getCapacity(RESOURCE_ENERGY) && getRange(this, ext) <= 1);
			if(unfilledExtension) this.transfer(unfilledExtension, RESOURCE_ENERGY);
			if(!this.target || !this.target.exists) {
				this.say("Changing target!");
				this.target = getObjectsByPrototype(ConstructionSite).find(site => getRange(this, site) <= 1);
			}
			if(this.target) this.build(this.target);
		}
	}

}
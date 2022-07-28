import {getObjectsByPrototype, findClosestByPath, getRange, createConstructionSite} from 'game/utils';
import {Creep, StructureContainer, StructureExtension, ConstructionSite, Resource} from 'game/prototypes';
import {RESOURCE_ENERGY} from 'game/constants';
import {Visual} from 'game/visual';
import { } from '/arena';

import { getNeighbours, inCenter } from "./functions.mjs";

Creep.prototype.extensioner = function() {
	if(!this.locked) {
		let conts = getObjectsByPrototype(StructureContainer).filter(cont => inCenter(cont) && cont.ticksToDecay-5 > getRange(this, cont));
		let closest = findClosestByPath(this, conts);
		if(!closest) {
			this.moveTo(50, 50); // General center
			console.log("Extensioner: Moving towards general center!");
			return;
		}
		console.log("Extensioner: Moving to closest container!");
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
				console.log("Extensioner: Emptying container!");
				this.withdraw(this.locked, RESOURCE_ENERGY);
				this.drop(RESOURCE_ENERGY);
			} else {
				console.log("Extensioner: Starting building!");
				this.building = true;
				getNeighbours(this).forEach(function(tile) {
					createConstructionSite(tile.x, tile.y, StructureExtension);
				});
			}
		}
		else {
			let droppedEnergy = getObjectsByPrototype(Resource).find(resource => getRange(this, resource) <= 1);
			if(!droppedEnergy) {
				console.log("Extensioner: My job is done here. Resetting...");
				delete this.target;
				delete this.building;
				delete this.locked;
				this.drop(RESOURCE_ENERGY); // Excess weight...
				getObjectsByPrototype(ConstructionSite).forEach(site => site.remove());
				return;
			}
			this.pickup(droppedEnergy);
			let unfilledExtension = getObjectsByPrototype(StructureExtension).find(ext => ext.store.getUsedCapacity(RESOURCE_ENERGY) != ext.store.getCapacity(RESOURCE_ENERGY) && getRange(this, ext) <= 1);
			if(unfilledExtension) this.transfer(unfilledExtension, RESOURCE_ENERGY);
			if(!this.target || !this.target.exists) {
				console.log("Extensioner: Changing target!");
				this.target = getObjectsByPrototype(ConstructionSite).find(site => getRange(this, site) <= 1);
			}
			if(this.target) this.build(this.target);
		}
	}

}
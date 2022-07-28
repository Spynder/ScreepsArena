import {findClosestByPath, getRange} from 'game/utils';
import {Creep} from 'game/prototypes';
import {HEAL} from 'game/constants';

import {searchPath} from 'game/path-finder';

import {getSpawn, getEnemySpawn, getEnemyCreeps, getCreeps, inCenter, getEnemyTargets} from './functions.mjs';
import {Visual} from 'game/visual';

Creep.prototype.scout = function() {
	let enemySpawn = getEnemySpawn();
	let spawn = getSpawn();
	let enemy = findClosestByPath(this, getEnemyCreeps().filter(creep => getRange(this, creep) < 7));
	let closestFrend = findClosestByPath(this, getCreeps().filter(creep => creep.id != this.id && inCenter(creep)));
	let isTopFlank = true;
	if(closestFrend) isTopFlank = closestFrend.y < 50;

	let escapeTo = {x: 50, y:50};

	let damagedAlly = findClosestByPath(this, getCreeps().filter(creep => getRange(this, creep) <= 3 && creep.hits < creep.hitsMax));
	if(this.hits == this.hitsMax && damagedAlly) {
		if(getRange(this, damagedAlly) <= 1) this.heal(damagedAlly);
		else this.rangedHeal(damagedAlly);
	} else this.heal(this);

	this.say(enemy);
	this.say("Is top flank?: ", isTopFlank);
	if(!enemy) {
		this.moveTo(enemySpawn);
	} else {
		let targets = getEnemyTargets(10);
		for (let i = 0; i < 100; i++) {
			targets.push({pos: {x:13, y:i}, range: 1}, {pos: {x:86, y:i}, range: 1});
			new Visual()
				.circle({x:13, y:i}, {radius: .5, opacity: .1, fill: "#BBFFBB"})
				.circle({x:86, y:i}, {radius: .5, opacity: .1, fill: "#BBFFBB"});
		}

		let path = searchPath(this, targets, {plainCost: 10, swampCost: 2, flee: true}); // force them to walk on swamp
		new Visual().poly(path.path);
		this.moveTo(path.path[0]);
	}
}
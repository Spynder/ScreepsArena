import {findClosestByPath, getRange} from 'game/utils';
import {Creep} from 'game/prototypes';
import {HEAL} from 'game/constants';

import {searchPath} from 'game/path-finder';

import {getSpawn, getEnemySpawn, getEnemyCreeps, getCreeps, inCenter} from './functions.mjs';
import {Visual} from 'game/visual';

Creep.prototype.scout = function() {
	let enemySpawn = getEnemySpawn();
	let spawn = getSpawn();
	let enemy = findClosestByPath(this, getEnemyCreeps().filter(creep => getRange(this, creep) < 7));
	let closestFrend = findClosestByPath(this, getCreeps().filter(creep => creep.id != this.id && inCenter(creep)));
	let isTopFlank = true;
	if(closestFrend) isTopFlank = closestFrend.y < 50;

	//let escapeTo = isTopFlank ? {x: enemySpawn.x, y: 90} : {x: enemySpawn.x, y: 10};
	let escapeTo = {x: 50, y:50};

	this.heal(this);

	console.log("Scout: ", enemy);
	console.log("Scout: Is top flank?: ", isTopFlank);
	if(!enemy) {
		this.moveTo(enemySpawn);
	} else {
		const range = 10;
		let targets = getEnemyCreeps().map(function(creep) {
			new Visual().circle(creep, {radius: range, opacity: .1, fill: "#FFBBBB"});
			return {pos: creep, range: range}
		});
		for (let i = 0; i < 100; i++) {
			targets.push({pos: {x:13, y:i}, range: 1}, {pos: {x:86, y:i}, range: 1});
			new Visual().circle({x:13, y:i}, {radius: 1, opacity: .1, fill: "#BBFFBB"});
			new Visual().circle({x:86, y:i}, {radius: 1, opacity: .1, fill: "#BBFFBB"});
		}

		let path = searchPath(this, targets, {plainCost: 10, swampCost: 2, flee: true}); // force them to walk on swamp
		new Visual().poly(path.path);
		this.moveTo(path.path[0]);
	}
}
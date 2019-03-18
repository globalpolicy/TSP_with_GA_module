var numberOfPoints = 20;
var points = [];
var ga;

function setup() {
	var canvas = createCanvas(640, 480);
	canvas.parent("canvas-holder");
	points.length = 0;
	for (var i = 0; i < numberOfPoints; i++) {
		points.push(createVector(floor(random(0, 640)), floor(random(0, 480))));
	}

	ga = new GeneticAlgorithm();
	var populationCount = 1000;
	var population = [];
	var dummyPath = [];
	for (var i = 0; i < numberOfPoints; i++) {
		dummyPath.push(i);
	}
	for (var i = 0; i < populationCount; i++) {
		population.push(shuffle(dummyPath, false))
	}
	ga.setPopulation(population);
	ga.setFitnessFunction((path) => {
		var totalDistance = 0;
		for (var i = 0; i < numberOfPoints - 1; i++) {
			totalDistance += dist(points[path[i]].x, points[path[i]].y, points[path[i + 1]].x, points[path[i + 1]].y);
		}
		return 1 / ((totalDistance + 1));
	});
	ga.setCrossOverFunction((path1, path2) => {
		//"order 1" crossover
		var randomIndex = floor(random(0, path1.length));
		var newPath = path1.slice(0, randomIndex + 1);

		for (var i = 0; i < path2.length; i++) {
			if (!newPath.includes(path2[i]))
				newPath.push(path2[i]);
		}
		return newPath;
	});
	ga.setMutateFunction((path) => {
		var newPath = path.slice();
		var randomIndex1 = floor(random(0, numberOfPoints));
		var randomIndex2 = floor(random(0, numberOfPoints));
		var tmp = newPath[randomIndex1];
		newPath[randomIndex1] = newPath[randomIndex2];
		newPath[randomIndex2] = tmp;
		return newPath;
	});
	ga.setMutationRate(0.01);
}


function draw() {
	background(0);
	fill(255, 0, 0);
	points.forEach(point => {
		ellipse(point.x, point.y, 10, 10);
	});
	ga.next();
	var bestPath = ga.getBestMember().Member;
	for (var i = 0; i < bestPath.length - 1; i++) {
		strokeWeight(5);
		stroke(0, 255, 255);
		line(points[bestPath[i]].x, points[bestPath[i]].y, points[bestPath[i + 1]].x, points[bestPath[i + 1]].y);
	}
	noStroke();
	fill(200);
	text(`Generation :  + ${ga.getGenerationCount()}\nMean fitness : " + ${ga.getAverageFitness()}`, width / 2, height - 30);
}
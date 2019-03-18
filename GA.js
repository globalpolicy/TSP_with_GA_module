function GeneticAlgorithm() {


    //fields and getters/setters

    var _population = [];
    var _fitnessFunction;
    var _crossOverFunction;
    var _mutateFunction;
    var _mutationRate;
    var _generationCount = 0;
    var _averageFitness = 0;

    this.setPopulation = (population) => {
        _population = population;
    }

    this.getPopulation = () => _population;

    this.setFitnessFunction = (fitnessFunction) => {
        _fitnessFunction = fitnessFunction;
    }

    this.setCrossOverFunction = (crossOverFunction) => {
        _crossOverFunction = crossOverFunction;
    }

    this.setMutateFunction = (mutateFunction) => {
        _mutateFunction = mutateFunction;
    }

    this.setMutationRate = (mutationRate) => {
        _mutationRate = mutationRate;
    }

    this.getMutationRate = () => _mutationRate;

    this.setGenerationEndedCallback = (generationEndedCallback) => {
        _generationEndedCallback = generationEndedCallback;
    }

    this.getGenerationCount = () => _generationCount;

    this.getAverageFitness = () => _averageFitness;

    //private methods

    /**
     *  Returns normalized member fitnesses from current population
     *  Also updates _averageFitness
     */
    var _calculateMemberFitnesses = () => {
        var memberFitnesses = [];

        var fitnessSum = 0;
        _population.forEach(member => {
            var fitness = _fitnessFunction(member);
            fitnessSum += fitness;
            memberFitnesses.push(fitness);
        });

        for (var i = 0; i < memberFitnesses.length; i++) {
            memberFitnesses[i] /= fitnessSum;
        }

        _averageFitness = fitnessSum / _population.length;
        return memberFitnesses;
    }

    /**
     * Takes a list of objects and a list of corresponding normalized weights
     * Scales the weights randomly
     * Picks the highest weight and returns
     * The resulting distribution checks out with the given weights
     */
    var _weightedPick = (populationList, normalizedWeights) => {
        var largestScaledWeightIndex;
        var largestScaledWeight = 0;
        for (var i = 0; i < normalizedWeights.length; i++) {
            var tmp = normalizedWeights[i] * Math.random(); //scale by a random float
            if (tmp > largestScaledWeight) {
                largestScaledWeight = tmp;
                largestScaledWeightIndex = i;
            }
        }

        return populationList[largestScaledWeightIndex];
    }

    /*returns a list of probabilistically populated parents' indices for mating*/
    var _generateMatingPool = () => {
        var matingPool = [];
        var populationFitness = _calculateMemberFitnesses();
        for (var i = 0; i < _population.length; i++) {
            matingPool.push(_weightedPick(_population, populationFitness));
        }
        return matingPool;
    }

    var _mutate = (member) => {
        var mutant = member;
        if (Math.random() < _mutationRate)
            mutant = _mutateFunction(member);
        return mutant;
    }

    //public methods

    this.next = () => {
        var matingPool = _generateMatingPool();
        var newPopulation = [];
        for (var i = 0; i < _population.length; i++) {

            //select two parents randomly from mating pool
            var parent1 = matingPool[Math.floor(Math.random() * matingPool.length)];
            var parent2 = matingPool[Math.floor(Math.random() * matingPool.length)];

            //crossover between the two parents to create a child
            var child = _crossOverFunction(parent1, parent2);

            //mutate child
            var child = _mutate(child);

            //create new population
            newPopulation.push(child);
        }
        _population = newPopulation;
        _generationCount++;
    }

    this.getBestMember = () => {
        var bestFitness = 0;
        var bestMember;
        _population.forEach(member => {
            if (_fitnessFunction(member) > bestFitness) {
                bestFitness = _fitnessFunction(member);
                bestMember = member;
            }
        });
        return {
            Member: bestMember,
            Fitness: bestFitness
        };
    }
}
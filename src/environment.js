class Environment {
    constructor() {
        this.boids = createFlock();
        this.tiles = createTiles();
    }

    createFlock() {
        let res = [];
        for (let i = 0; i < NB_BOIDS; i++) {
            res.push(new Boid());

        }
        return res;
    }

    createTiles() {
        return [];
    }
}
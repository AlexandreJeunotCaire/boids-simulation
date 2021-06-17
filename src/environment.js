class Environment {
    constructor() {
        this.tiles = this.createTiles();
        this.boids = this.createFlock();

        for (const boid of this.boids) {
            for (const tile of this.tiles) {
                if (boid.x >= tile.x && boid.x < tile.x + TILE_SIDE && boid.y >= tile.y && boid.y < TILE_SIDE + tile.y) {
                    boid.tile = tile;
                    tile.boids.push(boid);
                    break;
                }
            }
        }

        for (const tile of this.tiles) {
            tile.initNeighbors();
        }

        new p5(p => {
            p.setup = () => {
                p.frameRate(FPS);
                p.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
            }

            p.draw = () => {
                p.background("#202020");
                p.noStroke();
                for (const boid of this.boids) {
                    p.fill('aqua');
                    p.triangle(boid.x, boid.y, boid.x - 4, boid.y + 10, boid.x + 4, boid.y + 10);
                    /*
                    p.fill('red');
                    p.circle(boid.x, boid.y, BOID_PERSONAL_SPACE);
                    p.fill('green');
                    p.circle(boid.x, boid.y, DETECTION_RANGE);
                    */
                    boid.move();
                }

                while (this.boids.length < NB_BOIDS) {
                    console.log("plop")
                    let boid = new Boid(this);
                    for (const tile of this.tiles) {
                        if (boid.x >= tile.x && boid.x < tile.x + TILE_SIDE && boid.y >= tile.y && boid.y < TILE_SIDE + tile.y) {
                            boid.tile = tile;
                            tile.boids.push(boid);
                            break;
                        }
                    }
                    this.boids.push(boid);
                }
            }
        }, 'boids');
    }

    createFlock() {
        let res = [];
        for (let i = 0; i < NB_BOIDS; i++) {
            res.push(new Boid(this));

        }
        return res;
    }

    createTiles() {
        let res = [];
        for (let i = -TILE_SIDE; i < SCREEN_WIDTH + TILE_SIDE; i += TILE_SIDE) {
            for (let j = -TILE_SIDE; j < SCREEN_HEIGHT + TILE_SIDE; j += TILE_SIDE) {
                res.push(new Tile(this, i, j));
            }
            
        }
        return res;
    }
}
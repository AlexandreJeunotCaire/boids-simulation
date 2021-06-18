class Environment {
    constructor() {
        this.tiles = this.createTiles();
        this.boids = this.createFlock();
        
        for (const boid of this.boids) {
            for (const tile of this.tiles) {
                if (tile.contains(boid.x, boid.y)) {
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

            p.mouseClicked = () => {
                PREDATOR_ALIVE = !PREDATOR_ALIVE;
            }

            p.draw = () => {
                console.log(p.mouseX)
                p.background("#202020");
                if (PREDATOR_ALIVE) {
                    p.fill('#8b0000');
                    p.circle(p.mouseX, p.mouseY, 2 * PREDATOR_SIZE)
                }
                /*
                p.fill("#202020")
                p.stroke("#ffffff")
                for (const tile of this.tiles) {
                    p.rect(tile.x, tile.y, TILE_SIDE, TILE_SIDE)
                }
                */
                p.fill('aqua');
                p.noStroke();
                for (const boid of this.boids) {
                    p.push();
                    p.translate(boid.x, boid.y);
                    p.rotate(Math.atan2(boid.dx, -boid.dy))
                    p.triangle(0, 0, 5, 20, -5, 20)
                    p.pop();
                    /*
                    p.fill('green');
                    p.circle(boid.x, boid.y, DETECTION_RANGE);
                    p.fill('red');
                    p.circle(boid.x, boid.y, BOID_PERSONAL_SPACE);
                    */
                    boid.move(p.mouseX, p.mouseY);
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
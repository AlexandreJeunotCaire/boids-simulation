class Boid {
    constructor(environment) {
        this.environment = environment;
        this.x = Math.random() * (SCREEN_WIDTH - 1.2 * TURN_ZONE) + 1.2 * TURN_ZONE;
        this.y = Math.random() * (SCREEN_HEIGHT - 1.2 * TURN_ZONE) + 1.2 * TURN_ZONE;
        this.dx = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        this.dy = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        this.neighbors = [];
        this.tile = undefined;
    }

    distance(other) {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }

    checkSpeed() {
        if (this.dx > MAX_SPEED) {
            this.dx-=0.9;
        } else if (this.dx < MIN_SPEED) {
            this.dx+=0.9;
        }

        if (this.dy > MAX_SPEED) {
            this.dy-=0.9;
        } else if (this.dy < MIN_SPEED - 5) {
            this.dy+=0.9;
        }
    }

    avoidBounds() {
        if (this.x < TURN_ZONE) {
            this.dx += 0.5;
        } else if (this.x > SCREEN_WIDTH - TURN_ZONE) {
            this.dx -= 0.5;
        }

        if (this.y < TURN_ZONE) {
            this.dy += 0.5;
        } else if (this.y > SCREEN_HEIGHT - TURN_ZONE) {
            this.dy -= 0.5;
        }
    }

    getTile() {
        for (const tile of this.environment.tiles) {
            if (this.x >= tile.x && this.x <= tile.x + TILE_SIDE &&  this.y >= tile.y && this.y <= tile.y + TILE_SIDE) {
                this.tile.removeBoid(this);
                tile.boids.push(this);
                this.tile = tile;
                return tile;
            }
        }
    }

    getNeighbors() {
        
        let tile = this.getTile();
        let res = [];

        for (const n of tile.boids) {
            if (n !== this) {
                res.push(n);
            }
        }

        for (const t of this.tile.neighbors) {
            for (const n of t.boids) {
                res.push(n);
            }
        }
        this.neighbors = res;
        //let res = [];
        /*
        for (const boid of this.environment.boids) {
            if (boid !== this) {
                res.push(boid);
            }
        }*/
        return res;
    }

    avoidCollisions() {
        let addX = 0;
        let addY = 0;

        for (const neighbor of this.neighbors) {
            if (this.distance(neighbor) < BOID_PERSONAL_SPACE) {
                addX += this.x - neighbor.x;
                addY += this.y - neighbor.y;
            }
        }

        this.dx += 0.03 * addX;
        this.dy += 0.03 * addY;
    }

    flyTogether() {
        let cpt = 1;
        if (this.neighbors.length > 0) {

            let speedXAvg = this.dx;
            let speedYAvg = this.dy;
            
            for (const n of this.neighbors) {
                if (this.distance(n) < DETECTION_RANGE) {
                    speedXAvg += n.dx;
                    speedYAvg += n.dy;
                    cpt++;
                }
            }
            
            speedXAvg /= cpt;
            speedYAvg /= cpt;

            this.dx += SPEED_CONVERGENCE * speedXAvg;
            this.dy += SPEED_CONVERGENCE * speedYAvg;
        }
    }

    move() {
        //this.getTile();
        this.neighbors = this.getNeighbors();

        this.avoidBounds();
        this.flyTogether();
        this.avoidCollisions();

        this.checkSpeed();
        this.x += this.dx;
        this.y += this.dy;

        if (this.x > SCREEN_WIDTH + 50 || this.x < -50 || this.y < -50 || this.y > SCREEN_HEIGHT + 50) {
            remove(this.environment.boids, this);
        }
    }
}
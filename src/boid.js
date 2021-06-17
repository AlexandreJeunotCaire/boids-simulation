class Boid {
    constructor(environment) {
        this.environment = environment;
        this.x = Math.random() * (SCREEN_WIDTH - 10) + 10;
        this.y = Math.random() * (SCREEN_HEIGHT - 10) + 10;
        this.dx = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        this.dy = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        this.neighbors = [];
    }

    distance(other) {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }

    checkSpeed() {
        if (this.dx > MAX_SPEED) {
            this.dx *= 0.75;
        } else if (this.dx < MIN_SPEED) {
            this.dx *= 1.25;
        }

        if (this.dy > MAX_SPEED) {
            this.dy *= 0.75;
        } else if (this.dy < MIN_SPEED) {
            this.dy *= 1.25;
        }
    }

    avoidBounds() {
        if (this.x < TURN_ZONE) {
            this.dx += BOID_SMOOTH_TURNS_RATE;
        } else if (this.x > SCREEN_WIDTH - TURN_ZONE) {
            this.dx -= BOID_SMOOTH_TURNS_RATE;
        }

        if (this.y < TURN_ZONE) {
            this.dy += BOID_SMOOTH_TURNS_RATE;
        } else if (this.y > SCREEN_HEIGHT - TURN_ZONE) {
            this.dy -= BOID_SMOOTH_TURNS_RATE;
        }
    }

    getTile() {
        for (const tile of this.environment.tiles) {
            if (this.x >= tile.x && this.x <= tile.x + TILE_SIDE &&  this.y >= tile.y && this.y <= tile.y + TILE_SIDE) {
                return tile;
            }
        }
    }

    getNeighbors() {
        let tile = getTile();
        let neighbors = [];

        for (const n of tile.boids) {
            if (n !== this) {
                neighbors.push(n);
            }
        }

        for (const t of tile.neighbors) {
            for (const n of t.boids) {
                neighbors.push(n);
            }
        }
        this.neighbors = neighbors;
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

        this.dx += BOID_SMOOTH_TURNS_RATE * addX;
        this.dy += BOID_SMOOTH_TURNS_RATE * addY;
    }

    flyTogether() {
        if (this.neighbors.length > 0) {

            let speedXAvg = this.dx;
            let speedYAvg = this.dy;
            
            for (const n of this.neighbors) {
                if (this.distance(n) < DETECTION_RANGE) {
                    speedXAvg += n.dx;
                    speedYAvg += n.dy;
                }
            }
            
            speedXAvg /= this.neighbors.length;
            speedYAvg /= this.neighbors.length;

            this.dx += SPEED_CONVERGENCE * speedXAvg;
            this.dy += SPEED_CONVERGENCE * speedYAvg;
        }
    }
}
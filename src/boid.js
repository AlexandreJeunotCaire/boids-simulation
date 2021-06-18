class Boid {
    constructor(environment) {
        this.environment = environment;
        this.x = Math.random() * SCREEN_WIDTH;
        this.y = Math.random() * SCREEN_HEIGHT;
        this.dx = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        this.dy = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        this.neighbors = [];
        this.tile = undefined;
    }

    draw() {
        push();
        noStroke();
        translate(this.x, this.y)
        rotate(Math.atan2(this.dx, -this.dy))
        triangle(0, 0, 7, 25, -7, 25)
        pop();
    }

    distance(other) {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }

    checkSpeed() { /*
        if (this.dx > MAX_SPEED) {
            this.dx -= 0.9;
        } else if (this.dx < MIN_SPEED) {
            this.dx += 0.9;
        }
        if (this.dy > MAX_SPEED) {
            this.dy -= 0.9;
        } else if (this.dy < MIN_SPEED) {
            this.dy += 0.9;
        }*/

        let speed = Math.sqrt(this.dx ** 2 + this.dy ** 2);
        if (speed > 15) {
            this.dx = (this.dx / speed) * 10;
            this.dy = (this.dy / speed) * 10;
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

    avoidDanger(x, y) {
        if (Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) < PREDATOR_SIZE) {
            this.dx += (this.x - x) * DODGE_RATE;
            this.dy += (this.y - y) * DODGE_RATE;
        }
    }

    getTile() {
        for (const tile of this.environment.tiles) {
            if (tile.contains(this.x, this.y)) {
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

        this.dx += DODGE_RATE * addX;
        this.dy += DODGE_RATE * addY;
    }

    flyTogether() {
        if (this.neighbors.length > 0) {
            
            let avgX = 0;
            let avgY = 0;
            let speedXAvg = 0;
            let speedYAvg = 0;
            let closeNeighbors = 0;

            for (const n of this.neighbors) {
                let dist = this.distance(n);
                if (dist < DETECTION_RANGE && dist > BOID_PERSONAL_SPACE) {
                    closeNeighbors++;
                    avgX += n.x;
                    avgY += n.y;
                    speedXAvg += n.dx;
                    speedYAvg += n.dy;
                }
            }
            
            if (closeNeighbors > 0) {

                avgX /= closeNeighbors;
                avgY /= closeNeighbors;

                speedXAvg /= closeNeighbors;
                speedYAvg /= closeNeighbors;
                
                this.dx += POSITION_CONVERGENCE * (avgX - this.x);
                this.dy += POSITION_CONVERGENCE * (avgY - this.y);

                this.dx += SPEED_CONVERGENCE * speedXAvg;
                this.dy += SPEED_CONVERGENCE * speedYAvg;
            }
        }
    }

    move(x, y) {
        this.neighbors = this.getNeighbors();

        this.avoidBounds();
        this.avoidCollisions();
        this.flyTogether();

        if (PREDATOR_ALIVE) {
            this.avoidDanger(x, y);
        }

        this.checkSpeed();
        this.x += this.dx;
        this.y += this.dy;

        if (this.x > SCREEN_WIDTH + 50 || this.x < -50 || this.y < -50 || this.y > SCREEN_HEIGHT + 50) {
            remove(this.environment.boids, this);
        }
    }
}
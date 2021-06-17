class Tile {
    constructor(environment, x, y) {
        this.environment = environment;
        this.x = x;
        this.y = y;
        this.boids = [];
        this.neighbors = [];
        this.middleX = this.x + TILE_SIDE / 2;
        this.middleY = this.y + TILE_SIDE / 2;
    }

    removeBoid(boid) {
        this.boids = remove(this.boids, boid);
    }

    contains(x, y) {
        return x >= this.x && y >= this.y && x < this.x + TILE_SIDE && y < this.y + TILE_SIDE;
    }

    initNeighbors() {
        for (const tile of this.environment.tiles) {
            if (tile.contains(this.middleX - TILE_SIDE, this.middleY - TILE_SIDE)) this.neighbors.push(tile);
            else if (tile.contains(this.middleX - TILE_SIDE, this.middleY - TILE_SIDE)) this.neighbors.push(tile);
            else if (tile.contains(this.middleX + TILE_SIDE, this.middleY - TILE_SIDE)) this.neighbors.push(tile);
            else if (tile.contains(this.middleX - TILE_SIDE, this.middleY)) this.neighbors.push(tile);
            else if (tile.contains(this.middleX + TILE_SIDE, this.middleY - TILE_SIDE)) this.neighbors.push(tile);
            else if (tile.contains(this.middleX - TILE_SIDE, this.middleY + TILE_SIDE)) this.neighbors.push(tile);
            else if (tile.contains(this.middleX, this.middleY + TILE_SIDE)) this.neighbors.push(tile);
            else if (tile.contains(this.middleX + TILE_SIDE, this.middleY + TILE_SIDE)) this.neighbors.push(tile);
        }
    }
}
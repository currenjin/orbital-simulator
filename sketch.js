let planets = [];
let fixedStar;
let numPlanets = 4;
let G = 120;
let destabilise = 0.15;

function setup() {
    createCanvas(windowWidth,windowHeight);
    fixedStar = new Body(50, createVector(0, 0), createVector(0, 0));

    for (let i = 0; i < numPlanets; i++) {
        let mass = random(5, 15);
        let radius = random(fixedStar.d, min(windowWidth / 2, windowHeight / 2));
        let angle = random(0, TWO_PI);
        let planetPosition = createVector(radius * cos(angle), radius * sin(angle));

        let planetVel = planetPosition.copy();

        if (random(1) < 0.1) {
            planetVel.rotate(-HALF_PI);
        }

        else planetVel.rotate(HALF_PI);
        planetVel.normalize();
        planetVel.mult(sqrt((G * fixedStar.mass) / radius));
        planetVel.mult(random(1 - destabilise, 1 + destabilise));

        planets.push(new Body(mass, planetPosition, planetVel));
    }
}

function draw() {
    background(180);
    translate(width / 2, height / 2);

    for (let i = numPlanets - 1; i >= 0; i--) {
        fixedStar.attract(planets[i]);
        planets[i].move();
        planets[i].show();
    }

    fixedStar.show();
}


function Body(_mass, _position, _vel){
    this.mass = _mass;
    this.position = _position;
    this.vel = _vel;
    this.d = this.mass * 2;
    this.thetaInit = 0;
    this.path = [];
    this.pathLen = Infinity;

    this.show = function() {
        stroke(0, 50);

        for (let i = 0; i < this.path.length - 2; i++) {
            line(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y);
        }

        fill(255);
        noStroke();
        ellipse(this.position.x, this.position.y, this.d, this.d);
    }


    this.move = function() {
        this.position.x += this.vel.x;
        this.position.y += this.vel.y;
        this.path.push(createVector(this.position.x,this.position.y));
        if (this.path.length > 200) this.path.splice(0, 1);
    }

    this.applyForce = function(f) {
        this.vel.x += f.x / this.mass;
        this.vel.y += f.y / this.mass;
    }

    this.attract = function(child) {
        let r = dist(this.position.x, this.position.y, child.position.x, child.position.y);
        let f = (this.position.copy()).sub(child.position);
        f.setMag((G * this.mass * child.mass)/(r * r));
        child.applyForce(f);
    }

}
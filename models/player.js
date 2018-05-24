"use strict";

class Player {
    constructor() {
        this.locked = false;
        this.points = 0;
    }

    set name(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set team(team) {
        this._team = team;
    }

    get team() {
        return this._team;
    }

    set points(points) {
        this._points = points;
    }

    get points() {
        return this._points;
    }

    set locked(locked) {
        this._locked = locked;
    }

    get locked() {
        return this._locked;
    }

    get loggedIn() {
        return this.name && this.team;
    }
}

module.exports = Player;
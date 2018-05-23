"use strict";

class Player {
    constructor() {
        this.locked = false;
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

    addPoints(points) {
        this.points += points;
    }

    get loggedIn() {
        return this.name && this.team;
    }
}

module.exports = Player;
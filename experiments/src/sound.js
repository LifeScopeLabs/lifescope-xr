'use strict';

function radians(degrees) {
    return degrees * Math.PI / 180;
}

const NOTES = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'F4#': 370,
    'G4': 392,
    'G4#': 415.30,
    'A4': 440,
    'B4': 493.88,
    'C5': 523.25,
    'C5#': 554.4,
    'D5': 587.3,
    'E5b': 622.3,
    'E5': 659.3,
    'F5#': 740.0 
};

const CHORDS = {
    'C': ['C4', 'E4', 'G4'],
    'D': ['D4', 'F4#', 'A4'],
    'E': ['E4', 'G4#', 'B4'],
    'F': ['F4', 'A4', 'C5'],
    'G': ['G4', 'B4', 'D5'],
    'A': ['A4', 'C5#', 'E5'],
    'B': ['B4', 'E5b', 'F5#']
};

const NOTE_NAMES = Object.keys(NOTES);
const CHORD_NAMES = Object.keys(CHORDS);

const NOTE_DUR = 2; // seconds

function ChundaChunda(ctx) {
    this.ctx = ctx;
    this.volumeNode = this.ctx.createGain();
    this.volumeNode.gain.value = 1;
    this.volumeNode.connect(this.ctx.destination);
}

ChundaChunda.prototype.play = function (freq, duration, position, orientation) {
    this.ctx.listener.setOrientation(
        orientation.x, orientation.y, orientation.z,
        0, 1, 0);

    const START_TIME = this.ctx.currentTime;
    const END_TIME = START_TIME + duration;

    let gain = this.ctx.createGain();
    let osc = this.ctx.createOscillator();
    let panner = this.ctx.createPanner();

    panner.setPosition(position.x, position.y, position.z);
    panner.connect(this.volumeNode);

    gain.gain.setValueAtTime(1, START_TIME);
    gain.connect(panner);

    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);

    osc.start(START_TIME);
    osc.stop(END_TIME);
    gain.gain.linearRampToValueAtTime(0, END_TIME - duration * 0.1);
};

window.onload = function () {
    let ctx = new AudioContext();
    let instrument = new ChundaChunda(ctx);

    let lastNoteTime = ctx.currentTime;
    var i = 0;
    let loop = function () {
        let timestamp = ctx.currentTime;
        if (timestamp - lastNoteTime > NOTE_DUR) {
            let chordName = CHORD_NAMES[Math.floor(
                Math.random() * CHORD_NAMES.length)];
                console.log(chordName, CHORDS[chordName]);
            let note = CHORDS[chordName][0];

            let speaker = document.querySelector(`#${note.toLowerCase()}`);
            speaker.emit('sound');

            let position = speaker.getAttribute('position');
            let rotY = document.querySelector('#camera')
                .getAttribute('rotation').y;
            let orientation = {
                x: Math.cos(radians(rotY) + Math.PI/2),
                y: 0,
                z: -Math.sin(radians(rotY) + Math.PI/2)
            };

            console.log('playing', CHORDS[chordName]);
            CHORDS[chordName].forEach(function (note) {
                instrument.play(NOTES[note], NOTE_DUR, position, orientation);
            });

            lastNoteTime = timestamp;
        }
        requestAnimationFrame(loop);
    };

    loop();
};

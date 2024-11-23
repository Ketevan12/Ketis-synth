/* PDM Course: Sound Unit

  Preset-AlienChorus
*/

var synth;
// create a keyboard
var keyboard = new AudioKeys();
var slider;
function setup() {
  synth = make_DuoSynth().instrument;

  console.log(synth);

  keyboard.down(note => {
    // convert MIDI velocity to gain
    var velToGain = map(note.velocity, 0, 127, 0, 1);
    synth.triggerAttack(note.frequency, Tone.now(), velToGain);
  });

  keyboard.up(note => synth.triggerRelease());
  
   const seq = new Tone.Sequence(
    (time, note) => {
      synth.triggerAttackRelease(note, 0.1, time);
      // subdivisions are given as subarrays
    },
    ["C4", ["E4", "D4", "E4"], "G4", ["A4", "G4"]]
  ).start(0);
  slider = createSlider(1, 2000, 8, 0);
  slider2 = createSlider(1, 16, 1, 0);
}
function draw() {
  synth.modulationIndex.value = slider.value()
  synth.harmonicity.value = slider2.value()
}
function make_DuoSynth() {
  // create synth
  var instrument = new Tone.FMSynth();
  var synthJSON = {
    "harmonicity":5,
    "modulationIndex": 10,
    "oscillator" : {
        "type": "sine"
    },
    "envelope": {
        "attack": 0.001,
        "decay": 2,
        "sustain": 0.1,
        "release": 2
    },
    "modulation" : {
        "type" : "square"
    },
    "modulationEnvelope" : {
        "attack": 0.002,
        "decay": 0.2,
        "sustain": 0,
        "release": 0.2
    }
}

  instrument.set(synthJSON);

  var effect1, effect2, effect3;

  // make connections
  instrument.connect(Tone.Destination);

  // define deep dispose function
  function deep_dispose() {
    if (instrument != undefined && instrument != null) {
      instrument.dispose();
      instrument = null;
    }
  }

  return {
    instrument: instrument,
    deep_dispose: deep_dispose
  };
}

function toggle() {
  Tone.Transport.toggle()
}
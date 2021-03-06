// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
var tessel = require('tessel');
var ambientlib = require('ambient-attx4'); // Replace '../' with 'ambient-attx4' in your own code

var ambient = ambientlib.use(tessel.port['A']);
var servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['B']);

var servo1 = 1; // We have a servo plugged in at position 1
var request = require('request');
var av = require('tessel-av');
var camera = new av.Camera({
  width: 320,
  height: 240,
});
var takePicture = camera.capture();



ambient.on('ready', function () {

  // Set a sound level trigger

  ambient.setSoundTrigger(0.3);

  console.log('So peaceful...');

  takePicture.on('data', function (image) {
    console.log(image);
  })
  ambient.on('sound-trigger', function (data) {
    console.log("Keep it down in here! ", data);

    request.post("https://maker.ifttt.com/trigger/sound_triggered/with/key/g6xaWCpgElFxswo7Iv3Iw33XLkkWSWZ4xes_ymK1LaR")
    // Clear it
    ambient.clearSoundTrigger();

    //After 4.5 seconds reset sound trigger
    setTimeout(function () {

      ambient.setSoundTrigger(0.3);

    }, 4500);

  });
});
servo.on('ready', function () {
  var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).

  servo.configure(servo1, 0.05, 0.12, function () {
    setInterval(function () {
      console.log('Position (in range 0-1):', position);
      //  Set servo #1 to position pos.
      servo.move(servo1, position);
      // Increment by 10% (~18 deg for a normal servo)
      
      if (position < 1) {
       position += 0.1; // Reset servo position
      }
    }, 500); // Every 500 milliseconds
  });
});

ambient.on('error', function (err) {
  console.log(err);
});
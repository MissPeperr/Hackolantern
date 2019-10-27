import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';


const $video = document.querySelector('#video');
const $canvas = document.querySelector('#canvas');
const storageRef = firebase.storage().ref('images');
const $spookyOverlay = document.querySelector('overlaySpookyBorder');

const dataRef = firebase.database().ref('images');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    $video.srcObject = stream;
  });

export const takePhoto = () => {
  $video.play();
  $canvas.width = $video.clientWidth;
  $canvas.height = $video.clientHeight;

  const context = $canvas.getContext('2d');
  context.drawImage($video, 0, 0, $video.clientWidth, $video.clientHeight);
  
//  This is my new garbage code that Hopefully will create text on the canvas
  context.font = "47px Nosifer";
  context.fillStyle = "#ff8400";
  context.textAlign = "bottom-right";
  context.fillText("🎃HackoWeen!🎃", 45, 430);

// This is the Same code over again that creates text but this one should be a sub text. 
  context.font = "15px Nosifer";
  context.fillStyle = "#ff8400";
  context.textAlign = "bottom-right";
  context.fillText("NSS October 25-27 2019", 185, 465);

  const dataUrl = $canvas.toDataURL('image/png');

  // This is v cool
  return fetch(dataUrl)
    .then(response => response.blob())
    .then(blob => {
      const childRef = storageRef.child(`${Date.now()}`);
      return childRef.put(blob)
    })
    .then(i => i.ref.getDownloadURL())
    .then(url => dataRef.push(url))
    .then(() => $video.pause());
};


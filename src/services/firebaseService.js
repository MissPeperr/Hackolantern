import * as firebase from 'firebase/app';
import 'firebase/database';
import firebaseConfig from '../../firebase.config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const ref = database.ref('gameState');

export const updateDatabase = (newGameState) => {
  return ref.update(newGameState);
}
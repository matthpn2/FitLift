import firebase from 'firebase';
import { FIREBASE_CONFIG } from '../../config';

const fire = firebase.initializeApp(FIREBASE_CONFIG);
export default fire;

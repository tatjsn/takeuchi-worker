import Firebase from 'firebase'
import fetchTakeuchi from './fetch-takeuchi'
import dateString from '../common/date-string'
const common = { time: Firebase.ServerValue.TIMESTAMP };

const firebaseUrl = process.env.FIREBASE_URL;
const firebaseSecret = process.env.FIREBASE_SECRET;
const takeuchiUrl = process.env.TAKEUCHI_URL;
const date = dateString();
console.log('started', date);

const getFirebaseRef = new Promise((resolve, reject) => {
  const ref = new Firebase(`${firebaseUrl}/${date}`);
  ref.authWithCustomToken(firebaseSecret, (err, auth) => {
    console.log('auth done');
    if (err) {
      reject(err);
    } else {
      resolve(ref);
    }
  });
});

const pushData = (ref, data) => new Promise((resolve, reject) => {
  ref.push(Object.assign({}, common, data), err => {
    console.log('pushed', new Date().toLocaleTimeString());
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

const delay = time => new Promise((resolve, reject) => {
  setTimeout(resolve, time);
});

const fetchWithDelay = ref =>
  fetchTakeuchi(takeuchiUrl)
  .then(data => pushData(ref, data))
  .then(() => delay(3 * 60 * 1000))
  .then(() => fetchWithDelay(ref))

getFirebaseRef
  .then(ref => fetchWithDelay(ref))
  .catch(e => {
    console.log(e);
  });

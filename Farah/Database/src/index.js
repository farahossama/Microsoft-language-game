import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get, push } from "firebase/database";


// Your web app's Firebase configuration

  const firebaseConfig = {
    apiKey: "AIzaSyAoVojm1EZZ9Aoh3MgiF8L-3hVhlALqVXc",
    authDomain: "vast-incline-348816.firebaseapp.com",
    databaseURL: "https://vast-incline-348816-default-rtdb.firebaseio.com",
    projectId: "vast-incline-348816",
    storageBucket: "vast-incline-348816.appspot.com",
    messagingSenderId: "154229761412",
    appId: "1:154229761412:web:f9ed8dddeaddbf63ac29d1",
    measurementId: "G-1DS3W716EG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

document.getElementById('Analytics').addEventListener('click', writeData);


console.log(app);
const db = getDatabase();



function writeData() {
 
  push(ref(db, 'Data/'), {
    score : JSON.parse(localStorage.score),  
    falsepositive : JSON.parse(localStorage.falsepositive),                
    

  });
}
var data;
const dbRef = ref(getDatabase());
 async function read() {
  get(child(dbRef, `Data/`)).then((snapshot) => {
     if (snapshot.exists()) {
        data = snapshot.val().score;
        //writeUserData();
        console.log(data);
  
    } else {
       console.log("No data available");
        }
  }).catch((error) => {
    console.error(error);
   });
}




  

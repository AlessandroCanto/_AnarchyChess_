import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmtfD6pxasbfH4Iq6BhtA6JqEC7a7srt4",
    authDomain: "anarchychess-84371.firebaseapp.com",
    databaseURL: "https://anarchychess-84371-default-rtdb.firebaseio.com",
    projectId: "anarchychess-84371",
    storageBucket: "anarchychess-84371.appspot.com",
    messagingSenderId: "626986551388",
    appId: "1:626986551388:web:d36affbb80f1c5b20abe99",
    measurementId: "G-CD3QQCRQDC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

const inputBox = document.getElementById('inputBox');
const saveBtn = document.getElementById('saveBtn');
const displayed = document.getElementById('displayed')
const displayTag = document.getElementById('displayBox');

function saveData() {
    // Get the input value
    const inputValue = inputBox.value;

    // Create a reference to a new location in the database
    const newEntryRef = push(ref(db, 'entries'));

    // Save the input value to the new location
    set(newEntryRef, inputValue, (error) => {
        if (error) {
            console.error('Data could not be saved.', error);
        } else {
            console.log('Data saved successfully.');
        }
    });

    // Clear the input box
    inputBox.value = '';
}
async function fetchData() {
    const entriesRef = ref(db, 'entries');

    try {
        const snapshot = await get(entriesRef);
        displayTag.innerHTML = ""; // Clear previous content

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();

                const entryElement = document.createElement('div');
                entryElement.textContent = childData;
                displayTag.appendChild(entryElement);
            });
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}



// Add a click event listener to the save button
saveBtn.addEventListener('click', saveData);
displayed.addEventListener('click', fetchData);

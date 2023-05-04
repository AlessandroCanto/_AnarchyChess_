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

const db = firebase.database();

// Get references to the input box, send button, and recent feed div
const suggestionInput = document.getElementById('suggestionInput');
const sendBtn = document.getElementById('sendBtn');
const recentFeed = document.getElementById('recentFeed');

// Function to send data to Firebase
function sendData() {
    const inputValue = suggestionInput.value;
    const newSuggestionRef = db.ref('suggestions').push();
    newSuggestionRef.set(inputValue);
    suggestionInput.value = '';
}

// Add a click event listener to the send button
sendBtn.addEventListener('click', sendData);

// Function to update the recent feed div
function updateRecentFeed(snapshot) {
    const suggestionItems = [];
    snapshot.forEach(childSnapshot => {
        suggestionItems.unshift(`<div class="suggestion-item">${childSnapshot.val()}</div>`);
    });

    recentFeed.innerHTML = suggestionItems.slice(0, 5).join('');
}

// Listen for changes in the Firebase data
db.ref('suggestions').limitToLast(5).on('value', updateRecentFeed);

// Add a click event listener to the save button
saveBtn.addEventListener('click', saveData);


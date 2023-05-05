import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
import { getDatabase, ref, push, set, onValue, query, limitToLast } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Your web app's Firebase configuration
function createUserId() {
  const userId = uuid.v4();
  localStorage.setItem('userId', userId);
  return userId;
}

function calculateContributionScore(userId, snapshot) {
    let score = 0;
    snapshot.forEach(childSnapshot => {
        if (childSnapshot.val().userId === userId) {
            score++;
        }
    });
    return score;
}

function getUserId() {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    return storedUserId;
  } else {
    return createUserId();
  }
}

const userId = getUserId();

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

// Get references to the input box, send button, and recent feed div
const suggestionInput = document.getElementById('suggestionInput');
const sendBtn = document.getElementById('sendBtn');
const recentFeed = document.getElementById('recentFeed');

// Function to send data to Firebase
function sendData() {
    const inputValue = suggestionInput.value;
    const newSuggestionRef = push(ref(db, 'suggestions'));
    const suggestionData = {
        message: inputValue,
        userId: userId
    };
    set(newSuggestionRef, suggestionData);
    suggestionInput.value = '';
}

// Add a click event listener to the send button
sendBtn.addEventListener('click', sendData);

// Function to update the recent feed div
function updateRecentFeed(snapshot) {
    const suggestionItems = [];
    snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        suggestionItems.unshift(`<div class="suggestion-item">${data.message}</div>`);
    });

    recentFeed.innerHTML = suggestionItems.slice(0, 5).join('');

    // Calculate and display the contribution score for the current user
    const score = calculateContributionScore(userId, snapshot);
    const contributionScoreDiv = document.getElementById('contributionScore');
    contributionScoreDiv.innerHTML = `Your contribution score is ${score}`;
}


// Listen for changes in the Firebase data
const suggestionsQuery = query(ref(db, 'suggestions'), limitToLast(5));
onValue(suggestionsQuery, updateRecentFeed);

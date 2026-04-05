// 🌙 Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// 🎤 Voice
function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Use Chrome for voice feature");
        return;
    }

    let recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = function(event) {
        let text = event.results[0][0].transcript.toLowerCase();
        document.getElementById("destination").value = text;
    };
}

// 🚀 FORM
document.getElementById("planner").addEventListener("submit", function(e) {
    e.preventDefault();

    let destination = document.getElementById("destination").value;
    let date = document.getElementById("date").value;
    let budget = document.getElementById("budget").value;

    // ⏳ Loading
    document.getElementById("result").innerHTML = "⏳ Planning your trip... Please wait...";

    setTimeout(() => {

        // Budget Category
        let budgetText = "";
        if (budget < 5000) budgetText = "💸 Budget Trip";
        else if (budget < 20000) budgetText = "💰 Moderate Trip";
        else budgetText = "💎 Luxury Trip";

        // Result
        document.getElementById("result").innerHTML =
            `✈️ Trip to ${destination} on ${date} with ₹${budget}<br>${budgetText}`;

        // Image
        let img = document.getElementById("placeImage");
        img.src = `https://source.unsplash.com/400x300/?${destination},travel`;
        img.style.display = "block";

        // Weather
        fetch(`https://wttr.in/${destination}?format=3`)
        .then(res => res.text())
        .then(data => {
            document.getElementById("weather").innerHTML = "🌦️ " + data;
        });

        // Map
        document.getElementById("map").innerHTML = `
            <iframe width="100%" height="300"
            src="https://www.google.com/maps?q=${destination}&output=embed">
            </iframe>
        `;

        // Suggestions + Tips
        document.getElementById("suggestion").innerHTML =
            getSuggestion(destination) + "<br>" + getTravelTips(destination);

        // Save
        saveTrip(destination, date, budget);

    }, 1000);
});

// 🤖 Suggestions
function getSuggestion(dest) {
    dest = dest.toLowerCase();

    if (dest.includes("beach")) return "🏖️ Goa, Bali, Maldives";
    if (dest.includes("mountain")) return "🏔️ Manali, Ooty, Shimla";

    return "🌍 Paris, Dubai, Singapore";
}

// 🧳 Travel Tips
function getTravelTips(destination) {
    return `🧳 Tips: Carry essentials, check weather, and explore local food in ${destination}!`;
}

// 💾 Save
function saveTrip(destination, date, budget) {
    let trips = JSON.parse(localStorage.getItem("trips")) || [];
    trips.push({ destination, date, budget });
    localStorage.setItem("trips", JSON.stringify(trips));
    displayTrips();
}

// 📌 Display + Delete
function displayTrips() {
    let tripList = document.getElementById("tripList");
    tripList.innerHTML = "";

    let trips = JSON.parse(localStorage.getItem("trips")) || [];

    trips.forEach((trip, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
            📍 ${trip.destination} | 📅 ${trip.date} | 💰 ₹${trip.budget}
            <button onclick="deleteTrip(${index})">❌</button>
        `;

        tripList.appendChild(li);
    });
}

function deleteTrip(index) {
    let trips = JSON.parse(localStorage.getItem("trips")) || [];
    trips.splice(index, 1);
    localStorage.setItem("trips", JSON.stringify(trips));
    displayTrips();
}

// 🗑️ Clear All
function clearTrips() {
    localStorage.removeItem("trips");
    displayTrips();
}

displayTrips();

// 🔍 Auto Suggestions
const places = ["Goa", "Hyderabad", "Paris", "Dubai", "Bali", "Ooty", "Manali"];

document.getElementById("destination").addEventListener("input", function() {
    let input = this.value.toLowerCase();
    let box = document.getElementById("suggestionsBox");

    box.innerHTML = "";

    let filtered = places.filter(p => p.toLowerCase().includes(input));

    filtered.forEach(place => {
        let div = document.createElement("div");
        div.innerText = place;

        div.onclick = () => {
            document.getElementById("destination").value = place;
            box.innerHTML = "";
        };

        box.appendChild(div);
    });
});

// 🌍 Background Slideshow
const images = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // beach
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470", // mountains
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d", // city
    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad"  // travel
]; 

let i = 0;

setInterval(() => {
    document.body.style.backgroundImage = `url(${images[i]})`;
    i = (i + 1) % images.length;
}, 4000);
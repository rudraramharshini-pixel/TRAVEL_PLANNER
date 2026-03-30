function startVoice() {
    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("❌ Your browser does not support voice recognition. Use Google Chrome.");
            return;
        }

        let recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;

        recognition.start();

        console.log("🎤 Listening...");

        recognition.onresult = function(event) {
            let text = event.results[0][0].transcript.toLowerCase();
            console.log("You said:", text);

            // Destination
            let destinationMatch = text.match(/to (.*?)( on| with|$)/);
            if (destinationMatch) {
                document.getElementById("destination").value = destinationMatch[1];
            } else {
                document.getElementById("destination").value = text;
            }

            // Date
            if (text.includes("tomorrow")) {
                let tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                document.getElementById("date").value =
                    tomorrow.toISOString().split('T')[0];
            }

            // Budget
            let budgetMatch = text.match(/\d+/);
            if (budgetMatch) {
                document.getElementById("budget").value = budgetMatch[0];
            }
        };

        recognition.onerror = function(event) {
            console.error("Voice error:", event.error);
            alert("⚠️ Voice error: " + event.error);
        };

        recognition.onend = function() {
            console.log("🎤 Stopped listening");
        };

    } catch (error) {
        alert("Error: " + error.message);
    }
}


// 🧠 When form is submitted
document.getElementById("planner").addEventListener("submit", function(e) {
    e.preventDefault();

    let destination = document.getElementById("destination").value;
    let date = document.getElementById("date").value;
    let budget = document.getElementById("budget").value;

    // 📊 Show result
    document.getElementById("result").innerHTML =
        `Trip Planned to ${destination} on ${date} with budget ₹${budget}`;

    // 🖼️ Show image
    let img = document.getElementById("placeImage");
    img.src = "https://source.unsplash.com/400x300/?" + destination + "&" + new Date().getTime();
    img.style.display = "block";

    // 🌦️ Weather (no API)
    fetch(`https://wttr.in/${destination}?format=3`)
    .then(res => res.text())
    .then(data => {
        document.getElementById("weather").innerHTML = data;
    })
    .catch(() => {
        document.getElementById("weather").innerHTML = "Weather not available ❌";
    });

    // 🗺️ Map
    document.getElementById("map").innerHTML = `
        <iframe
            width="100%"
            height="300"
            style="border:0"
            src="https://www.google.com/maps?q=${destination}&output=embed"
            allowfullscreen>
        </iframe>
    `;

    // 🤖 AI Suggestions
    let suggestionText = "";

    if (destination.toLowerCase().includes("beach")) {
        suggestionText = "🏖️ Suggested: Goa, Maldives, Bali";
    } else if (destination.toLowerCase().includes("mountain")) {
        suggestionText = "🏔️ Suggested: Manali, Ooty, Shimla";
    } else if (destination.toLowerCase().includes("city")) {
        suggestionText = "🏙️ Suggested: Delhi, Mumbai, Bangalore";
    } else {
        suggestionText = "🌍 Suggested: Paris, Dubai, Singapore";
    }

    document.getElementById("suggestion").innerHTML = suggestionText;

    // 💾 Save trip
    let trips = JSON.parse(localStorage.getItem("trips")) || [];

    let newTrip = { destination, date, budget };

    trips.push(newTrip);
    localStorage.setItem("trips", JSON.stringify(trips));

    displayTrips();
});


// 📌 Display saved trips
function displayTrips() {
    let tripList = document.getElementById("tripList");
    tripList.innerHTML = "";

    let trips = JSON.parse(localStorage.getItem("trips")) || [];

    trips.forEach(trip => {
        let li = document.createElement("li");
        li.innerHTML = `📍 ${trip.destination} | 📅 ${trip.date} | 💰 ₹${trip.budget}`;
        tripList.appendChild(li);
    });
}

// Load saved trips on page load
displayTrips();
document.addEventListener('DOMContentLoaded', () => {

    const micBtn = document.getElementById('mic-btn');
    const responseBox = document.getElementById('response-box');
    const statusText = document.getElementById('status-text');
    const aiResponse = document.getElementById('ai-response');
    const micIcon = document.getElementById('mic-icon');

    // API Key Configuration
    // WARNING: Storing API keys in client-side code is not secure for production.
    // Ideally, this should be proxied through a backend server.
    const GEMINI_API_KEY = 'AIzaSyCP4ANlu5DFaFB6B4NPbz0__Cqe0Jl_RU8'; // TODO: Replace with your actual Gemini API Key

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
        micBtn.style.display = 'none'; // Hide button if not supported
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let isListening = false;

    micBtn.addEventListener('click', () => {
        if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            alert('Please configure your Gemini API Key in assets/js/voice-bot.js');
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
                responseBox.style.display = 'block'; // Show box immediately on click
            } catch (error) {
                console.error("Speech recognition error:", error);
            }
        }
    });

    recognition.onstart = () => {
        isListening = true;
        statusText.textContent = "Listening...";
        aiResponse.textContent = "";
        micBtn.style.backgroundColor = "#dc3545"; // Red for stop
        micIcon.textContent = "⏹️";
    };

    recognition.onend = () => {
        isListening = false;
        micBtn.style.backgroundColor = "#007bff"; // Blue for start
        micIcon.textContent = "🎙️";
    };

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        statusText.textContent = "Processing...";
        aiResponse.textContent = `"${transcript}"`;

        // Call Gemini API
        try {
            statusText.textContent = "Thinking...";
            const response = await fetchGeminiResponse(transcript);
            statusText.textContent = "Gemini Answer:";
            aiResponse.textContent = response;
        } catch (error) {
            console.error("Gemini API Error:", error);
            statusText.textContent = "Error:";
            aiResponse.textContent = "Sorry, I couldn't connect to Gemini. Please check your API key or connection.";
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        statusText.textContent = "Error: " + event.error;
        isListening = false;
        micBtn.style.backgroundColor = "#007bff";
        micIcon.textContent = "🎙️";
    };

    async function fetchGeminiResponse(prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "You are a helpful AI assistant for an engineering student website called TopStudyMaterial. Keep your answers concise and helpful. Question: " + prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('No valid response from Gemini API');
        }
    }
});

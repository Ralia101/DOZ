document.addEventListener('DOMContentLoaded', () => {
    // Speech Synthesis Setup
    const synth = window.speechSynthesis;
    const speakerBtn = document.querySelector('.speaker-btn');
    let utterance = null;
    let isSpeaking = false;

    // Voice Configuration
    let voices = [];
    
    const loadVoices = () => {
        voices = synth.getVoices();
        console.log('Available voices:', voices);
    };

    // Initialize voices
    synth.onvoiceschanged = loadVoices;

    // Speech Control Function
    function toggleSpeech() {
        if (!synth) {
            console.error('Speech synthesis not supported');
            return;
        }

        if (isSpeaking) {
            // Stop speaking
            synth.cancel();
            isSpeaking = false;
            updateButtonState(false);
            return;
        }

        // Get story content
        const storyContent = document.getElementById('story').textContent;
        
        // Create new utterance
        utterance = new SpeechSynthesisUtterance(storyContent);
        
        // Configure utterance
        utterance.voice = voices.find(v => v.lang === 'en') || voices[0];
        utterance.volume = 1;
        utterance.rate = 1;
        utterance.pitch = 1;

        // Event Handlers
        utterance.onstart = () => {
            isSpeaking = true;
            updateButtonState(true);
        };

        utterance.onend = () => {
            isSpeaking = false;
            updateButtonState(false);
        };

        utterance.onerror = (err) => {
            console.error('Speech error:', err);
            isSpeaking = false;
            updateButtonState(false);
        };

        // Start speaking
        synth.speak(utterance);
    }

    // Update button state
    function updateButtonState(speaking) {
        const icon = speakerBtn.querySelector('i');
        if (speaking) {
            speakerBtn.classList.remove('btn-primary');
            speakerBtn.classList.add('btn-danger');
            icon.classList.remove('bi-speaker');
            icon.classList.add('bi-stop-circle');
            speakerBtn.innerHTML = '<i class="bi bi-stop-circle"></i> Stop Reading';
        } else {
            speakerBtn.classList.remove('btn-danger');
            speakerBtn.classList.add('btn-primary');
            icon.classList.remove('bi-stop-circle');
            icon.classList.add('bi-speaker');
            speakerBtn.innerHTML = '<i class="bi bi-speaker"></i> Read Story';
        }
    }

    // Initialize speech functionality
    if (!synth) {
        speakerBtn.disabled = true;
        speakerBtn.innerHTML = '<i class="bi bi-x-circle"></i> Audio Not Supported';
    } else {
        // Attach event listener (remove onclick from HTML)
        speakerBtn.addEventListener('click', toggleSpeech);
        // Remove inline onclick attribute from HTML
        speakerBtn.removeAttribute('onclick');
    }

    // Initialize voices on load
    loadVoices();
}); 

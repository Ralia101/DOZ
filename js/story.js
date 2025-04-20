// story.js (universal version)
document.addEventListener('DOMContentLoaded', () => {
    // Speech Synthesis Setup
    const synth = window.speechSynthesis;
    const speakerBtn = document.querySelector('.speaker-btn');
    let utterance = null;
    let isSpeaking = false;

    // Universal Story Content Selector
    const storyContent = document.querySelector('.story-section #story');

    // Voice Management
    const loadVoices = () => {
        const voices = synth.getVoices();
        return voices.filter(voice => voice.lang.includes('en')); // English first
    };

    // Speech Control
    function toggleSpeech() {
        if (!synth) return;

        if (isSpeaking) {
            synth.cancel();
            updateButtonState(false);
            return;
        }

        // Get text from current story
        const text = Array.from(storyContent.querySelectorAll('p'))
            .map(p => p.textContent)
            .join('\n'); // Natural paragraph pauses

        utterance = new SpeechSynthesisUtterance(text);
        
        // Voice Configuration
        const voices = loadVoices();
        utterance.voice = voices.find(v => v.name.includes('Female')) || voices[0];
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Event Handlers
        utterance.onstart = () => {
            isSpeaking = true;
            updateButtonState(true);
        };

        utterance.onend = () => {
            isSpeaking = false;
            updateButtonState(false);
        };

        synth.speak(utterance);
    }

    // Universal Button Update
    function updateButtonState(speaking) {
        const icon = speakerBtn.querySelector('i');
        speakerBtn.classList.toggle('btn-danger', speaking);
        speakerBtn.classList.toggle('btn-primary', !speaking);
        icon.classList.toggle('bi-stop-circle', speaking);
        icon.classList.toggle('bi-speaker', !speaking);
        speakerBtn.textContent = speaking ? ' Stop Reading' : ' Read Story';
    }

    // Initialize for All Pages
    if ('speechSynthesis' in window) {
        synth.onvoiceschanged = loadVoices;
        speakerBtn?.addEventListener('click', toggleSpeech);
        speakerBtn?.removeAttribute('onclick');
    } else if (speakerBtn) {
        speakerBtn.disabled = true;
        speakerBtn.innerHTML = '<i class="bi bi-x-circle"></i> Audio Not Supported';
    }
});

// ===== TEXT-TO-SPEECH =====
let currentSpeech = null; // Track speech instance

// Auto-stop when leaving page
window.addEventListener('beforeunload', () => {
  if (currentSpeech) speechSynthesis.cancel();
});

// Auto-stop when switching stories
window.addEventListener('hashchange', () => {
  if (currentSpeech) speechSynthesis.cancel();
});

function toggleSpeech() {
  const button = document.querySelector('.speaker-button');
  
  if (currentSpeech?.speaking) {
    // Stop speech
    speechSynthesis.cancel();
    button.innerHTML = '🔊';
    currentSpeech = null;
  } else {
    // Start speech
    if (currentSpeech) speechSynthesis.cancel();
    
    currentSpeech = new SpeechSynthesisUtterance(
      document.getElementById('story').innerText
    );
    
    currentSpeech.lang = 'en-US';
    currentSpeech.onend = () => {
      button.innerHTML = '🔊';
      currentSpeech = null;
    };
    
    speechSynthesis.speak(currentSpeech);
    button.innerHTML = '⏹';
  }
}
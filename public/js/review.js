document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');
  
    fetch('/api/audios')
      .then(response => response.json())
      .then(data => {
        const audio = data[index];
        document.getElementById('audio-player').src = audio.audio_file_name;
        document.getElementById('original-transcription').textContent = audio.original_transcription;
        const humanCorrectionTextarea = document.getElementById('human-correction');
        humanCorrectionTextarea.value = audio.human_correction;
  
        humanCorrectionTextarea.addEventListener('input', function() {
          audio.human_correction = humanCorrectionTextarea.value;
          fetch('/api/audios', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
        });
      });
  
    document.getElementById('back-button').addEventListener('click', function() {
      window.location.href = '/';
    });
  });
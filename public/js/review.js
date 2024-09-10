document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const index = urlParams.get('index');

  fetch('/api/audios')
    .then(response => response.json())
    .then(data => {
      const audio = data[index];
      const audioPlayer = document.getElementById('audio-player');
      const humanCorrectionTextarea = document.getElementById('human-correction');
      const reviewPercentageElement = document.getElementById('review-percentage');
      const relevantWordsTextarea = document.getElementById('relevant-words');
      let lastLoggedPercentage = 0;

      document.getElementById('original-transcription').textContent = audio.original_transcription;
      humanCorrectionTextarea.value = audio.human_correction;

      reviewPercentageElement.textContent = `${audio.review_percentage}%`;

      audioPlayer.src = audio.audio_file_name;

      // Espera a que se cargue el audio para establecer el tiempo actual
      audioPlayer.addEventListener('loadedmetadata', () => {
        audioPlayer.currentTime = (audio.review_percentage / 100) * audioPlayer.duration;
      });

      audioPlayer.addEventListener('timeupdate', () => {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        audio.review_percentage = percentage.toFixed(2);
        reviewPercentageElement.textContent = `${audio.review_percentage}%`;

        const currentPercentage = Math.floor(percentage / 10) * 10;

        if (currentPercentage > lastLoggedPercentage) {
          lastLoggedPercentage = currentPercentage;
          console.log(`${lastLoggedPercentage}%`);

          fetch('/api/audios', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });

          // Ejecuta el fetch a /api/audios/analyze solo si el porcentaje es múltiplo de 10
          const texto = humanCorrectionTextarea.value;

          fetch('/api/audios/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Response from analyze endpoint:', data);
            relevantWordsTextarea.value = data
          })
          .catch(error => {
            console.error('Error making request:', error);
          });
        }
      });

      humanCorrectionTextarea.addEventListener('input', function () {
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

  document.getElementById('back-button').addEventListener('click', function () {
    window.location.href = '/';
  });
});

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

        // Solo imprime en la consola si el porcentaje actual es múltiplo de 10
        if (Math.floor(percentage / 10) > lastLoggedPercentage) {
          lastLoggedPercentage = Math.floor(percentage / 10);
          console.log(`${lastLoggedPercentage * 10}%`);
        }

        // Actualiza los datos en el servidor
        fetch('/api/audios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
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

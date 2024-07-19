document.addEventListener('DOMContentLoaded', function() {
  fetch('/api/audios')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('#audio-table tbody');
      data.forEach((audio, index) => {
        const row = document.createElement('tr');

        const audioCell = document.createElement('td');
        audioCell.textContent = audio.audio_file_name;
        row.appendChild(audioCell);

        const reviewPercentageCell = document.createElement('td');
        reviewPercentageCell.textContent = `${audio.review_percentage}%`;
        reviewPercentageCell.style.backgroundColor = `rgb(${255 - audio.review_percentage * 2.55}, ${audio.review_percentage * 2.55}, 0)`;
        row.appendChild(reviewPercentageCell);

        const actionsCell = document.createElement('td');
        const reviewButton = document.createElement('button');
        reviewButton.textContent = 'Revisar';
        reviewButton.addEventListener('click', () => {
          window.location.href = `/review.html?index=${index}`;
        });
        actionsCell.appendChild(reviewButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
      });
    });
});
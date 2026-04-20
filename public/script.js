

async function upload() {
  const files = document.getElementById('files').files;
  const formData = new FormData();

  for (let file of files) {
    formData.append('files', file);
  }

  const res = await fetch('/upload', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();

  document.getElementById('result').innerHTML =
    `<p>API URL: <a href="${data.api}" target="_blank">${data.api}</a></p>`;
}
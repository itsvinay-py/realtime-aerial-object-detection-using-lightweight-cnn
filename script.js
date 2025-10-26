const upload = document.getElementById('upload');
const image = document.getElementById('image');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('status');

let model;
// Load the COCO-SSD model
cocoSsd.load().then(loadedModel => {
  model = loadedModel;
  statusText.innerText = 'Model loaded. Ready to detect objects!';
});

// When an image is uploaded
upload.addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Once the image loads, run detection
image.onload = async () => {
  if (!model) {
    statusText.innerText = 'Model not loaded yet...';
    return;
  }

  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  statusText.innerText = 'Detecting objects...';

  const predictions = await model.detect(image);
  statusText.innerText = `Detected ${predictions.length} objects`;

  predictions.forEach(pred => {
    ctx.beginPath();
    ctx.rect(...pred.bbox);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    ctx.stroke();
    ctx.font = '14px Arial';
    ctx.fillText(`${pred.class} (${(pred.score * 100).toFixed(1)}%)`,
                 pred.bbox[0],
                 pred.bbox[1] > 10 ? pred.bbox[1] - 5 : 10);
  });
};

window.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('gallery');
  for (let i = 1; i <= 9; i++) {
    const num = i.toString().padStart(2, '0');
    const div = document.createElement('div'); div.className = 'thumb';
    const img = document.createElement('img'); img.src = `images/puzzle${num}.jpg`;
    const status = document.createElement('div'); status.className = 'status';
    const code = localStorage.getItem(`code${num}`);
    status.textContent = code ? `✅ ${code}` : '🔲';
    const reset = document.createElement('button'); reset.className = 'reset-btn';
    reset.textContent = 'Reset';
    reset.addEventListener('click', e => { e.stopPropagation(); localStorage.removeItem(`code${num}`); location.reload(); });
    div.append(img, status, reset);
    div.addEventListener('click', () => location.href = `index.html?p=${num}`);
    gallery.append(div);
  }
});
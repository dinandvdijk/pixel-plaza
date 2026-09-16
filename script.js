const soundButton = document.querySelector('.sound-button');
let soundOn = true;

soundButton.addEventListener('click', () => {
  soundOn = !soundOn;
  soundButton.querySelector('span').textContent = soundOn ? 'SOUND ON' : 'SOUND OFF';
  soundButton.setAttribute('aria-label', soundOn ? 'Sound on' : 'Sound off');
});

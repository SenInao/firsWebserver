window.addEventListener('DOMContentLoaded', (event) => {
  const words = document.querySelectorAll('.responseWindow span');
  let delay = 0;
  let delayIncrement = 5/words.length;

  if (words.length < 5) {
	  delayIncrement = 0.5;
  };

  words.forEach(word => {
      word.style.animationDelay = `${delay}s`;
      delay += delayIncrement; // Increase delay for each word
  });
});

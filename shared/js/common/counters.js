!(function (exports) {
  'use strict';

  const Counter = {
    increment: function (counter, value) {
      const originalText = counter.textContent;
      counter.innerHTML = '';
      const originalChars = originalText.split('');

      value
        .toString()
        .split('')
        .forEach((char, index) => {
          const charElement = document.createElement('span');
          charElement.classList.add('character');
          counter.appendChild(charElement);

          const oldValue = document.createElement('span');
          oldValue.classList.add('old');
          oldValue.textContent = originalChars[index] || '';
          oldValue.style.animationDuration = 500 + index * 50 + 'ms';
          charElement.appendChild(oldValue);

          charElement.style.width = `${oldValue.offsetWidth}px`;
          charElement.style.height = `${oldValue.offsetHeight}px`;
          if (originalChars[index] === ' ') {
            charElement.style.width = '0.3em';
          }

          const newValue = document.createElement('span');
          newValue.classList.add('new');
          newValue.textContent = char;
          newValue.style.animationDuration = 500 + index * 50 + 'ms';
          charElement.appendChild(newValue);

          charElement.style.transition = '0.3s ease';
          charElement.style.width = `${newValue.offsetWidth}px`;
          charElement.style.height = `${newValue.offsetHeight}px`;
          if (char === ' ') {
            charElement.style.width = '0.3em';
          }

          setTimeout(() => {
            oldValue.textContent = '';
          }, 500 + index * 50);
          if (originalChars[index] !== char) {
            oldValue.classList.add('slide-up-to');
            newValue.classList.add('slide-up-from');

            setTimeout(() => {
              oldValue.classList.remove('slide-up-to');
              newValue.classList.remove('slide-up-from');
            }, 500 + index * 50);
          }
        });
    },

    decrement: function (counter, value) {
      const originalText = counter.textContent;
      counter.innerHTML = '';
      const originalChars = originalText.split('');

      value
        .toString()
        .split('')
        .forEach((char, index) => {
          const charElement = document.createElement('span');
          charElement.classList.add('character');
          counter.appendChild(charElement);

          const oldValue = document.createElement('span');
          oldValue.classList.add('old');
          oldValue.textContent = originalChars[index] || '';
          oldValue.style.animationDuration = 500 + index * 50 + 'ms';
          charElement.appendChild(oldValue);

          charElement.style.width = `${oldValue.offsetWidth}px`;
          charElement.style.height = `${oldValue.offsetHeight}px`;
          if (originalChars[index] === ' ') {
            charElement.style.width = '0.3em';
          }

          const newValue = document.createElement('span');
          newValue.classList.add('new');
          newValue.textContent = char;
          newValue.style.animationDuration = 500 + index * 50 + 'ms';
          charElement.appendChild(newValue);

          charElement.style.transition = '0.3s ease';
          charElement.style.width = `${newValue.offsetWidth}px`;
          charElement.style.height = `${newValue.offsetHeight}px`;
          if (char === ' ') {
            charElement.style.width = '0.3em';
          }

          setTimeout(() => {
            oldValue.textContent = '';
          }, 500 + index * 50);
          if (originalChars[index] !== char) {
            oldValue.classList.add('slide-down-to');
            newValue.classList.add('slide-down-from');

            setTimeout(() => {
              oldValue.classList.remove('slide-down-to');
              newValue.classList.remove('slide-down-from');
            }, 500 + index * 50);
          }
        });
    }
  };

  exports.Counter = Counter;
})(window);

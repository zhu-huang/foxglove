(function (exports) {
  'use strict';

  const Slideshow = {
    slides: [
      {
        artwork: './images/orchid.png',
        title: 'OrchidOS',
        detail: 'Get the latest version of our brand new web operating system using the OrchidOS Installer webapp',
        links: [
          {
            href: '#',
            recommend: true,
            label: 'Get'
          },
          {
            href: '#',
            label: 'Learn More'
          }
        ]
      },
      {
        artwork: './images/foss.png',
        title: 'Best Of FOSS',
        detail: 'Check out free open source webapps approved with Orchid\'s quality standards and guidelines to give a unmatched open source experience',
        links: [
          {
            href: '#',
            recommend: true,
            label: 'FOSS Webapps'
          },
          {
            href: '#',
            label: 'Learn More'
          }
        ]
      },
      {
        artwork: './images/creator.png',
        title: 'Editor\'s Pick',
        detail: 'A list of well-rated selection of Orchid webapps picked by the Orchid team itself that you may want to look into',
        links: [
          {
            href: '#',
            label: 'Editor\'s Pick',
            recommend: true
          },
          {
            href: '#',
            label: 'Learn More'
          }
        ]
      }
    ],

    rootElement: document.getElementById('root'),
    slideshowElement: document.getElementById('slideshow'),
    slideshowDots: document.getElementById('slideshow-dots'),
    previousButton: document.getElementById('slideshow-previous-button'),
    nextButton: document.getElementById('slideshow-next-button'),

    timeoutID: null,
    slideIndex: 0,

    init: function () {
      this.createSlides();
      this.showSlides(this.slideIndex);

      this.previousButton.addEventListener('click', () => this.plusSlides(-1));
      this.nextButton.addEventListener('click', () => this.plusSlides(1));
    },

    createSlides: function () {
      this.slides.forEach((slide, index) => {
        const element = document.createElement('div');
        element.classList.add('slideshow');

        const artwork = document.createElement('img');
        artwork.src = slide.artwork;
        artwork.classList.add('artwork');
        element.appendChild(artwork);

        const textHolder = document.createElement('div');
        textHolder.classList.add('text-holder');
        element.appendChild(textHolder);

        artwork.onload = () => {
          ColorPicker(slide.artwork, { colors: 2 }).then(colors => {
            const r = colors[0].r;
            const g = colors[0].g;
            const b = colors[0].b;

            // Calculate relative luminance
            const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            if (luminance > 0.5) {
              element.classList.add('light');
              element.dataset.light = true;
            }

            const rgb = `rgb(${r}, ${g}, ${b})`;
            textHolder.style.setProperty('--slideshow-accent', rgb);
          });
        };

        const title = document.createElement('h1');
        title.classList.add('title');
        title.textContent = slide.title;
        textHolder.appendChild(title);

        const detail = document.createElement('p');
        detail.classList.add('detail');
        detail.textContent = slide.detail;
        textHolder.appendChild(detail);

        const nav = document.createElement('nav');
        textHolder.appendChild(nav);

        if (slide.links) {
          for (let index = 0, length = slide.links.length; index < length; index++) {
            const link = slide.links[index];

            const linkElement = document.createElement('a');
            linkElement.href = link.href;
            linkElement.textContent = link.label;
            if (link.recommend) {
              linkElement.classList.add('recommend');
            }
            nav.appendChild(linkElement);
          }
        }

        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.addEventListener('click', () => this.currentSlide(index));

        this.slideshowElement.appendChild(element);
        this.slideshowDots.appendChild(dot);
      });
    },

    plusSlides: function (n) {
      this.showSlides(this.slideIndex + n);
    },

    currentSlide: function (n) {
      this.showSlides(n);
    },

    showSlides: function (n) {
      const slides = document.getElementsByClassName('slideshow');
      const dots = document.getElementsByClassName('dot');

      slides[this.slideIndex].classList.remove('active');
      dots[this.slideIndex].classList.remove('active');

      this.slideIndex = (n + slides.length) % slides.length;

      slides[this.slideIndex].classList.remove('previous', 'next');
      slides[this.slideIndex].classList.add('active');
      dots[this.slideIndex].classList.add('active');

      if (slides[this.slideIndex].dataset.light) {
        this.rootElement.classList.add('light');
      } else {
        this.rootElement.classList.remove('light');
      }

      const previousIndex = (this.slideIndex - 1 + slides.length) % slides.length;
      slides[previousIndex].classList.remove('next', 'previous');
      slides[previousIndex].classList.add('previous');

      const nextIndex = (this.slideIndex + 1) % slides.length;
      slides[nextIndex].classList.remove('previous', 'next');
      slides[nextIndex].classList.add('next');

      clearTimeout(this.timeoutID);
      this.timeoutID = setTimeout(() => this.showSlides(this.slideIndex + 1), 4000);
    }
  };

  Slideshow.init();
})(window);

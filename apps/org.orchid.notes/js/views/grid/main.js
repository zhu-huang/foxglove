!(function (exports) {
  'use strict';

  const Grid = {
    accountButton: document.getElementById('account-button'),
    accountButtonAvatar: document.getElementById('account-button-avatar'),
    gridLocalElement: document.getElementById('grid-local-container'),
    gridOnlineElement: document.getElementById('grid-online-container'),

    MUSIC_DIR: '/',
    MUSIC_MIME: 'audio',

    init: function () {
      if ('SDCardManager' in window) {
        FileIndexer(this.MUSIC_DIR, this.MUSIC_MIME).then((array) => {
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            this.addLocalAudio(element, gridLocalElement, index);
          }
        });
      }

      window.addEventListener('orchid-services-ready', this.handleServicesLoad.bind(this));
    },

    handleServicesLoad: async function () {
      if (await _os.isLoggedIn()) {
        _os.auth.getLiveAvatar(null, (data) => {
          this.accountButtonAvatar.src = data;
        });
        _os.auth.getUsername().then((data) => {
          this.accountButton.title = data;
        });
      }

      _os.music.getRelavantMusic().then(tracks => {
        for (let index = 0; index < tracks.length; index++) {
          const track = tracks[index];
          this.addOnlineAudio(track, gridOnlineElement, index);
        }
      });

      window.removeEventListener('orchid-services-ready', this.handleServicesLoad.bind(this));
    },

    setCategory: function (gridElement, artist) {
      const existingCategory = document.querySelector(`[data-artist="${artist}"]`);
      if (existingCategory) {
        return existingCategory.querySelector('.container');
      }

      const category = document.createElement('div');
      category.classList.add('category');
      category.dataset.artist = artist;
      gridElement.appendChild(category);

      const artistLabel = document.createElement('header');
      artistLabel.classList.add('artist');
      artistLabel.textContent = artist;
      category.appendChild(artistLabel);

      const container = document.createElement('div');
      container.classList.add('container');
      category.appendChild(container);

      return container;
    },

    base64ToBlob: function (base64String, contentType) {
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      return new Blob([byteArray], { type: contentType });
    },

    addLocalAudio: function (path, gridElement, index) {
      SDCardManager.read(path).then((data) => {
        const mime = SDCardManager.getMime(path);
        const blob = new Blob([data], { type: mime });
        const parts = path.split('/');
        const fileName = parts[parts.length - 1];

        const item = document.createElement('div');
        item.classList.add('music');

        const artwork = document.createElement('img');
        artwork.src = '';
        artwork.onerror = () => {
          artwork.src = `/images/default_keyart_${1 + (index % 4)}.png`;
        };
        item.appendChild(artwork);

        const textHolder = document.createElement('div');
        textHolder.classList.add('text-holder');
        item.appendChild(textHolder);

        const title = document.createElement('p');
        title.textContent = fileName;
        title.classList.add('title');
        textHolder.appendChild(title);

        const artist = document.createElement('p');
        artist.textContent = 'Unknown Artist';
        artist.classList.add('artist');
        textHolder.appendChild(artist);

        jsmediatags.read(blob, {
          onSuccess: (tag) => {
            if (tag) {
              const data = tag.tags.picture.data;
              const format = tag.tags.picture.format;
              const imageBlob = new Blob(data, { type: format });
              const artworkUrl = URL.createObjectURL(imageBlob);
              artwork.src = artworkUrl;
              console.log(artworkUrl);

              title.textContent = tag.tags.title;
              artist.textContent = tag.tags.artist;

              this.setCategory(gridElement, tag.tags.artist).appendChild(item);
              item.addEventListener('click', () => {
                SDCardManager.read(path, { encoding: 'base64' }).then((data) => {
                  Player.play(`data:${mime};base64,${data}`, {
                    title: tag.tags.title,
                    artist: tag.tags.artist,
                    album: tag.tags.album,
                    artwork: artworkUrl,
                    date: tag.tags.date
                  });
                });
              });
            } else {
              this.setCategory(gridElement, 'Unknown Artist').appendChild(item);
              item.addEventListener('click', () => {
                SDCardManager.read(path, { encoding: 'base64' }).then((data) => {
                  Player.play(`data:${mime};base64,${data}`, {
                    title: fileName,
                    artist: 'Unknown Artist',
                    album: 'Unknown Album',
                    artwork: '',
                    date: '1970'
                  });
                });
              });
            }
          },
          onError: function (error) {
            console.log(error);
          }
        });
      });
    },

    addAudio: function (path, gridElement, index) {
      SDCardManager.read(path).then((data) => {
        const mime = SDCardManager.getMime(path);
        const blob = new Blob([data], { type: mime });
        const parts = path.split('/');
        const fileName = parts[parts.length - 1];

        const item = document.createElement('div');
        item.classList.add('music');

        const artwork = document.createElement('img');
        artwork.src = '';
        artwork.onerror = () => {
          artwork.src = `/images/default_keyart_${1 + (index % 4)}.png`;
        };
        item.appendChild(artwork);

        const textHolder = document.createElement('div');
        textHolder.classList.add('text-holder');
        item.appendChild(textHolder);

        const title = document.createElement('p');
        title.textContent = fileName;
        title.classList.add('title');
        textHolder.appendChild(title);

        const artist = document.createElement('p');
        artist.textContent = 'Unknown Artist';
        artist.classList.add('artist');
        textHolder.appendChild(artist);

        jsmediatags.read(blob, {
          onSuccess: (tag) => {
            if (tag) {
              const data = tag.tags.picture.data;
              const format = tag.tags.picture.format;
              const imageBlob = new Blob(data, { type: format });
              const artworkUrl = URL.createObjectURL(imageBlob);
              artwork.src = artworkUrl;
              console.log(artworkUrl);

              title.textContent = tag.tags.title;
              artist.textContent = tag.tags.artist;

              this.setCategory(gridElement, tag.tags.artist).appendChild(item);
              item.addEventListener('click', () => {
                SDCardManager.read(path, { encoding: 'base64' }).then((data) => {
                  Player.play(`data:${mime};base64,${data}`, {
                    title: tag.tags.title,
                    artist: tag.tags.artist,
                    album: tag.tags.album,
                    artwork: artworkUrl,
                    date: tag.tags.date
                  });
                });
              });
            } else {
              this.setCategory(gridElement, 'Unknown Artist').appendChild(item);
              item.addEventListener('click', () => {
                SDCardManager.read(path, { encoding: 'base64' }).then((data) => {
                  Player.play(`data:${mime};base64,${data}`, {
                    title: fileName,
                    artist: 'Unknown Artist',
                    album: 'Unknown Album',
                    artwork: '',
                    date: '1970'
                  });
                });
              });
            }
          },
          onError: function (error) {
            console.log(error);
          }
        });
      });
    }
  };

  window.addEventListener('load', () => Grid.init());
})(window);

const remoteChannelListUrl = 'https://raw.githubusercontent.com/alim20002/tv-link/main/remote-channel-list.html';

    let currentChannelIndex = 0; // Track current channel index
    let fullscreenTimer; // Timer for fading out fullscreen controls

    function renderChannels(channelData) {
      const channelsList = document.getElementById('channelList');
      channelsList.innerHTML = '';
      channelData.forEach((channel, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item text-center';
        listItem.textContent = `${index + 1}. ${channel.name}`;
        listItem.addEventListener('click', () => {
          playChannel(channel.url);
          currentChannelIndex = index;
        });
        channelsList.appendChild(listItem);
      });
    }

    function fetchRemoteChannelList() {
      fetch(remoteChannelListUrl)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const remoteChannelList = Array.from(doc.querySelectorAll('#channelList li a')).map(channel => ({
            name: channel.textContent.trim(),
            url: channel.href
          }));
          renderChannels(remoteChannelList);
        })
        .catch(error => {
          console.error('Error fetching remote channel list:', error);
        });
    }

    function playChannel(url) {
      const videoPlayer = document.getElementById('videoPlayer');
      videoPlayer.innerHTML = ''; // Clear previous video
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoPlayer);

      // Auto fullscreen after 0.5 seconds
      setTimeout(() => {
        if (videoPlayer.requestFullscreen) {
          videoPlayer.requestFullscreen();
        } else if (videoPlayer.webkitRequestFullscreen) { /* Safari */
          videoPlayer.webkitRequestFullscreen();
        }
      }, 500);
    }

    // Fetch remote channel list and render channels
    fetchRemoteChannelList();
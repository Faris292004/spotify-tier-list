let accessToken = null;  // Store Spotify access token

// Login with Spotify
document.getElementById('login-button').addEventListener('click', () => {
    const clientId = '297f152ee59a4feea3b84d4d3a0a12d3'; // 
    const redirectUri = 'https://faris292004.github.io/spotify-tier-list/';  // 
    const scope = 'playlist-read-private user-library-read';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location = authUrl;
});

// Get the access token from the URL
window.onload = function() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    accessToken = params.get('access_token');
    
    if (accessToken) {
        loadPlaylist();
    }
};

// Fetch user's playlists from Spotify API
function loadPlaylist() {
    fetch('https://api.spotify.com/v1/me/top/artists', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        displaySongs(data.items);
    })
    .catch(error => console.error('Error loading playlist:', error));
}

// Display the playlist songs
function displaySongs(songs) {
    const songList = document.getElementById('song-list');
    songList.innerHTML = '';  // Clear any previous songs

    songs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = song.name;
        li.setAttribute('draggable', 'true');
        li.setAttribute('class', 'draggable-song');
        li.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text', event.target.textContent);
        });
        songList.appendChild(li);
    });

    // Show playlist container
    document.getElementById('playlist-container').style.display = 'block';
    document.getElementById('tier-list-container').style.display = 'block';
}

// Allow songs to be dropped in the tiers
const tiers = document.querySelectorAll('.tier');
tiers.forEach(tier => {
    tier.addEventListener('dragover', (event) => {
        event.preventDefault(); // Allow drop
    });

    tier.addEventListener('drop', (event) => {
        event.preventDefault();
        const song = event.dataTransfer.getData('text');
        tier.innerHTML += `<p>${song}</p>`;  // Add song to tier
    });
});

let accessToken;
const CLIENT_ID = "4cf5f49aa56443bbb129f89be53ffc39";
const REDIRECT_URI = "http://localhost:3000/";

const Spotify = {
  getAccessToken() {
    //URL variables
    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    //Handle access token
    if (accessToken) {
      return accessToken;
    }

    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      window.setTimeout(() => (accessToken = ""), urlExpiresIn[1] * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
    }
  },

  search(term) {
    //Variables and headers
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    //Fetch statements
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: headers
    })
      .then(response => response.json())
      .then(responseJSON => {
        if (responseJSON.tracks.items.length > 0) {
          return responseJSON.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            };
          });
        } else {
          return [];
        }
      });
  },

  savePlaylist(playlist, trackURIs) {
    if (!playlist || !trackURIs) return;

    //Variables and headers
    const accessToken = Spotify.getAccessToken();
    let userID;
    let playlistID;
    const headers = { Authorization: `Bearer ${accessToken}` };
    const playlistHeaders = {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ name: playlist })
    };
    const trackHeaders = {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ uris: trackURIs })
    };

    //Fetch statements
    return fetch(`https://api.spotify.com/v1/me`, {
      headers: headers
    })
      .then(response => response.json())
      .then(jsonResponse => {
        userID = jsonResponse.id;
        return fetch(
          `https://api.spotify.com/v1/users/${userID}/playlists`,
          playlistHeaders
        )
          .then(response => response.json())
          .then(jsonResponse => {
            playlistID = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
              trackHeaders
            );
          });
      });
  }
};

export default Spotify;

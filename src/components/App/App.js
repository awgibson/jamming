import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
      this.state ={
        playlistTracks: [],
        playlistName: 'Playlist',
        searchResults: []
      };


      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
  }

  addTrack(track){
    let updatePlaylist = this.state.playlistTracks;
    if (this.state.playlistTracks.indexOf(track) === -1) {
      updatePlaylist.push(track);
      this.setState({ playlistTracks: updatePlaylist });
    } 
  }

  removeTrack(track) {
    let updatePlaylist = this.state.playlistTracks;
    updatePlaylist.splice(this.state.playlistTracks.indexOf(track), 1);
    this.setState({playlistTracks: updatePlaylist});
  }  

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist(){
    Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks.map(track => track.uri));
    this.setState({
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => this.setState({searchResults: tracks}));
  }



  render() {
    return (
      <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar onSearch={this.search} / >
    <div className="App-playlist">
     <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/ >
      <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} / >

    </div>
  </div>
</div>
    );
  }

}

export default App;

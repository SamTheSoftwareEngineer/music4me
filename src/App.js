import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import { useState , useEffect } from 'react';
import {Client_ID, Client_Secret} from './secrets.js'

const Initial_State = {
  searchInput: "",
  accessToken: "",
  albums: [],
}

function App() {
  const [searchInput, setSearchInput] = useState(Initial_State.searchInput);
  const [accessToken, setAccessToken] = useState(Initial_State.accessToken);
  const [albums, setAlbums] = useState(Initial_State.albums);

  useEffect(() => {
    // API Access Token
    fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(Client_ID + ':' + Client_Secret)
      },
      body: 'grant_type=client_credentials&client_id=' + Client_ID + '&client_secret=' + Client_Secret
    })
    .then(response => response.json())
    .then(data => setAccessToken(data.access_token));
  }, []);

  // Search Spotify
  async function search() {
    console.log("Searching for " + searchInput);

    var searchParameters = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
    
    var artistID = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, searchParameters)
      .then(response => response.json())
      .then(data => data.artists.items[0].id);

    var returnedAlbums = await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`, searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      });
  }

  return (
    <div className="App">
     <Container>
      <InputGroup className="mb-3" size="1g">
        <FormControl 
        placeholder="Search" 
        type="input"
        onKeyDown={event => {
          if (event.key === 'Enter') {
            search();
          }
        }}
        onChange={event => setSearchInput(event.target.value)}
        />
        <Button onClick={() => {search()}}>Search</Button>
      </InputGroup>
     </Container>
     <Container>
            <Row className='mx-2 row row-cols-4'>
              {albums.map((album, i) => {
                console.log(album);
                return (
                  <Card key={i}>
                    <Card.Img src={album.images[0].url} />
                    <Card.Body>
                      <Card.Title>{album.name}</Card.Title>
                    </Card.Body>
                  </Card>
                );
              })}
            </Row>
           </Container>
          </div>
        );
      }

export default App;

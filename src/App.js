import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import { useState , useEffect } from 'react';


const Client_ID = "463a7f0efab148568ba2e1d7e73d916f"
const Client_Secret = "6acb00bb58654555a0890a18c14a5ab3"

const Inintial_State = {
  searchInput: "",
  accessToken: "",
  albums: [],
}

function App() {
  const [searchInput, setSearchInput] = useState(Inintial_State.searchInput);
  const [accessToken, setAccessToken] = useState(Inintial_State.accessToken);
  const [albums, setAlbums] = useState(Inintial_State.albums);

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
    
    .then (response => response.json())
    .then (data => setAccessToken(data.access_token))
  }, [])

  // Search Spotify

  async function search() {
    console.log("Searching for " + searchInput);

    // Get request using search to get Artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
    
    // Get request with Artist ID to get albums from that artist
    var artistID = await fetch(`https://api.spotify.com/v1/search?q=` + searchInput + '&type=artist', searchParameters)
    .then (response => (response.json())
    .then (data => { return data.artists.items[0].id}))

    // console.log("Artist ID is " + artistID);

    var returnedAlbums = await fetch("https://api.spotify.com/v1/artists/" + artistID + "/albums" + "?include_groups=album&market=US&limit=50", searchParameters)
    .then(response => response.json())
    .then(data =>{
      console.log(data)
      setAlbums(data.items);
    });
    
  }
   console.log(albums);
   // Display those albums to the user 

  return (
    <div className="App">
     <Container>
      <InputGroup className="mb-3" size="1g">
        <FormControl 
        placeholder="Search" 
        type = "input"
        onKeyDown={event => {
          if (event.key === 'Enter') {
            search();}
        }}
        onChange={event => setSearchInput(event.target.value)}
        />
        <button onClick={() => {search()}}>Search</button>
      </InputGroup>
     </Container>
     <Container>
      <Row className='mx-2 row row-cols-4'>
        albums.map((album, index) => {
          return (
            <Card key={index}>
              <Card.Img src="#" />
              <Card.Body>
                <Card.Title>Album Name Here</Card.Title>
              </Card.Body>
            </Card>
          );
        })
        
      </Row>
     </Container>
    </div>
  );
}

export default App;

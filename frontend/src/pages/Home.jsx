import { useState, useEffect } from 'react';
import api from '../api';

function Home() {
  // we need the state, we keep track of all of the notes
  // that we have (already grabbed from the server)

  //the first thing when we load this page
  // we send an authorized request to get all of the notes
  // that we've created
  const [notes, setNotes] = useState([]);

  // we then need some state for the form that will be on this page
  // that allows us to create a new note
  // (could be done in a separate component for a cleaner code)
  // we need some state for the content and the title of the note
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    getNotes();
  }, []);

  // functions to send requests
  // e.g. to get all of the notes that the user has written
  const getNotes = () => {
    api
      .get('/api/notes/')
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  return <div>Home</div>;
}

export default Home;

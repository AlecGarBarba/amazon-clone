import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://us-central1-clone-app-5d8a4.cloudfunctions.net/api' //https://us-central1-clone-app-5d8a4.cloudfunctions.net/api 
    //this is where we have the API(cloud function url) URL
});

export default instance;
//local debugging
//http://localhost:5001/clone-app-5d8a4/us-central1/api
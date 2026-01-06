import axios from "axios";

const firebaseAPI = axios.create({
  baseURL: "https://auth-3ec80-default-rtdb.firebaseio.com/",
});

export default firebaseAPI;

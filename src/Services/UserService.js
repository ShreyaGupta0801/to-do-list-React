import axios from "axios";

const USER_API_BASE_URL = "http://localhost:3306/go-api/user";

class UserService {
  createUser(user) {
    return axios.post(USER_API_BASE_URL + "/add",user);
  }
  loginUser(user) {
    return axios.post(USER_API_BASE_URL + "/login", user);
  }

}
export default new UserService();
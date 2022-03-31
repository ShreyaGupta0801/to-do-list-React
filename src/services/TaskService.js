import axios from "axios";

const TASK_API_BASE_URL = "http://localhost:3306/go-api";

class TaskService {
  getTasksByUser(userId) {
    return axios.post(TASK_API_BASE_URL + "/tasks-by-user", userId);
  }
  addTask(taskObj) {
    return axios.post(TASK_API_BASE_URL + "/task", taskObj);
  }
  updateTask(taskId, taskObj) {
    return axios.put(TASK_API_BASE_URL + "/update-task/" + taskId, taskObj);
  }
  deleteTask(taskId) {
    return axios.delete(TASK_API_BASE_URL + "/task/delete/" + taskId);
  }
  toggleTaskDone(taskId) {
    return axios.put( TASK_API_BASE_URL+ "/task/" + taskId);
  }
}
export default new TaskService();
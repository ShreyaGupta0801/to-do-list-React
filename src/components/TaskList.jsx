import React, { Component } from "react";
import TaskService from "../Services/TaskService";

export default class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasksList: [],
      newTaskText: "",
      newTaskTargetedDate: this.getDate(),
      newTaskId: "",
    };
    this.getDate = this.getDate.bind(this);
    this.handleNewTaskTargetedDate = this.handleNewTaskTargetedDate.bind(this);
    this.handleTaskToggle = this.handleTaskToggle.bind(this);
    this.NewTaskHandeler = this.NewTaskHandeler.bind(this);
    this.addTask = this.addTask.bind(this);
    this.openTask = this.openTask.bind(this);
    this.DeleteTaskHandeler = this.DeleteTaskHandeler.bind(this);
    this.handleLogOutClick = this.handleLogOutClick.bind(this);
  }
  componentDidMount() {
   
    this.setState({ newTaskText: "" });
    
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");

      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    console.log("state", this.props.history.location.state);
    this.setState({ user: this.props.history.location.state});
    console.log(this.props.history.location.state);
    TaskService.getTasksByUser(this.props.history.location.state).then(
      (res) => {
        this.setState({ tasksList: res.data });
        console.log(res.data)
      }
    );
    
  }
  getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }
  NewTaskHandeler(e) {
    this.setState({ newTaskText: e.target.value });
  }
  handleNewTaskTargetedDate(e) {
    console.log("picked date", e.target.value);
    this.setState({ newTaskTargetedDate: e.target.value });
  }
  handleTaskToggle(e) {
    var taskId = e.currentTarget.parentNode.getAttribute("id");
    console.log("done called");
    TaskService.toggleTaskDone(taskId)
      .then((res) => {
        TaskService.getTasksByUser(this.props.history.location.state)
          .then((getRes) => {
            console.log("tasklist", ...getRes.data);
            this.setState({ tasksList: getRes.data });
          })
          
      })
      
  }
  addTask(e) {
    document.querySelector("#taskInput").value = "";
    
    console.log("user" , this.props.history.location.state);
    const taskObj = {
      message: this.state.newTaskText,
      user: this.state.user,
      is_done: false,
      targeted_date: this.state.newTaskTargetedDate,
    };
    console.log(taskObj);
    TaskService.addTask(taskObj).then((res) => {
      console.log("Note created", res.data);
      this.setState({ tasksList: [...this.state.tasksList, res.data] });
    });
  }
  openTask(e) {
    var id = (e.currentTarget.getAttribute("id"));
    this.setState({ newTaskId: id });
    var message = e.currentTarget.getAttribute("message");
    var targeted_date = e.currentTarget.getAttribute("targeted_date");
    this.setState({ newTaskText: message });
    var taskObj = { id, message, targeted_date,user: this.state.user };
    this.props.history.push("/edit-note", taskObj);
  }
  DeleteTaskHandeler(e) {
    var taskId = (e.currentTarget.getAttribute("id"));
    TaskService.deleteTask(taskId)
      .then((res) => {
        this.setState({
          tasksList: this.state.tasksList.filter((task) => task.id !== taskId),
        });
      })
      
  }

 
  handleLogOutClick(e) {
    this.props.history.push("/");
    window.history.replaceState({}, document.title);
  }
  render() {
    return (
      <div style={TableStyle.card}>
        <div style={TableStyle.header}>
          <h1 >To-Do-List </h1>
          <button id="logoutBtn" style={TableStyle.logoutBtn} onClick={this.handleLogOutClick}>
            Logout
          </button>
        </div>    
        <div style={TableStyle.AddNote}>
          <input id="taskInput"style={TableStyle.input} type="text" placeholder="Create a new note..." onChange={this.NewTaskHandeler}/>
          <input
            id="taskInputTargetedDate"
            style={TableStyle.inputDate}
            type="date"
            name="targeted_date"
            value={this.state.newTaskTargetedDate}
            onChange={this.handleNewTaskTargetedDate}
          />
          <button id="addBtn" style={TableStyle.addBtn}  onClick={this.addTask}>
              Add
          </button>
          
        </div>
      
    
        {this.state.tasksList.map((tasks, index) => {
          return (
            <div id={tasks.id} key={tasks.id} style={TableStyle.note}>
              <p style={TableStyle.id}>{index + 1}</p>
              <p style={tasks.is_done ? TableStyle.CrossMessage : TableStyle.message}>{tasks.message}</p>
               
              
              <button
                onClick={this.handleTaskToggle}
                style={
                  tasks.is_done
                    ? TableStyle.DoneButtonHide
                    : TableStyle.DoneButtonShow
                }
              >
                Done
              </button>
              <button
                onClick={this.handleTaskToggle}
                style={
                  tasks.is_done
                    ? TableStyle.UndoButtonShow
                    : TableStyle.UndoButtonHide
                }
              >
                Undo
              </button>
              <button onClick={this.openTask}
                id={tasks.id}
                message={tasks.message}
                targeted_date={tasks.targeted_date}
                style={TableStyle.EditButton}
                >
                Edit
              </button>
              <button
                onClick={this.DeleteTaskHandeler}
                id={tasks.id}
                style={TableStyle.DeleteButton}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}
var TableStyle = {
  header: {
    display: "flex",
    padding:"5rem",
    alignItems: "center",
    textAlign:"center",
    marginLeft:"35%",
    marginBottom:"0%"
  },
  card: {
    backgroundColor: "lavender",
    padding: "2rem",
    width: "100%",
    height:"100%",
    position:"absolute"
  },
  AddNote: {
    display: "flex",
    justifyContent: "center",
    marginTop:"0%"
  },
  CrossMessage: {
    marginRight: "1rem",
    textDecoration: "line-through",
    textDecorationThickness: "3px",
  },
  input: {
    width: "600px",
    padding: "1rem 1.5rem",
    fontSize: "1.2rem",
    marginRight: "1rem",
    fontWeight: "bold",
  },
  addBtn: {
    backgroundColor: "yellow",
    color: "black",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem 1.5rem",
  },
  ExpiredButtonShow: {
    border: "2px solid black",
    outline: "none",
    backgroundColor: "orange",
    color: "black",
    fontSize: "1.2rem",
    padding: "0.5rem 1rem",
    marginLeft: "auto",
    marginRight: "1rem",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  ExpiredButtonHide: {
    display: "none",
  },
  logoutBtn: {
    backgroundColor: "white",
    color: "black",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    marginLeft: "auto",
    height: "50px",
  },
  updateBtn: {
    backgroundColor: "pink",
    color: "black",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem 1.5rem",
  },
  UndoButton: {
    backgroundColor: "purple",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "0.5rem 0.5rem",
    marginLeft: "auto",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
    marginRight: "0px",
  },
  inputDate: {
    width: "250px",
    marginRight: "1rem",
    padding: "0.5rem",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  EditButton: {
    backgroundColor: "#9ED059",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    marginLeft: "auto",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  DeleteButton: {
    backgroundColor: "#ff4336",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    marginLeft: "1rem",
    marginRight: "1rem",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  note: {
    backgroundColor: "lavender",
    display: "flex",
    fontSize: "1.1rem",
    fontWeight: "bold",
  },
  id: {
    marginLeft: "1rem",
    marginRight: "1rem",
  },
  DoneButtonShow: {
    cursor: "pointer",
    border: "2px solid black",
    outline: "none",
    borderRadius: "5px",
    backgroundColor: "#219ebc",
    color: "black",
    fontSize: "1rem",
    fontWeight: "normal",
    padding: "1rem 1.5rem",
    marginLeft: "auto",
    marginRight: "1rem",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  DoneButtonHide: {
    display: "none",
  },
  UndoButtonShow: {
    cursor: "pointer",
    border: "2px solid black",
    outline: "none",
    borderRadius: "5px",
    backgroundColor: "#8ecae6",
    color: "black",
    fontSize: "1rem",
    fontWeight: "normal",
    padding: "1rem 1.5rem",
    marginLeft: "auto",
    marginRight: "1rem",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto",
    display: "inline-flex",
    alignItems: "center",
  },
  UndoButtonHide: {
    display: "none",
  },
}
import React, { Component } from "react";
import TaskService from "../services/TaskService";

export default class FullTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
        taskMessage: this.props.history.location.state.message,
        taskObj: this.props.history.location.state,
        taskTargetedDate: this.props.history.location.state.targeted_date,
        alertMessage: "",
    };
    this.changeMessage = this.changeMessage.bind(this);
    this.changeTargetedDate = this.changeTargetedDate.bind(this);
    this.updateTask = this.updateTask.bind(this);
   
  }
  changeMessage = (e) => {
    this.setState({ taskMessage: e.target.value });
  };
  changeTargetedDate = (e) => {
    this.setState({ taskTargetedDate: e.target.value });
  };
  updateTask = (e) => {
    console.log("user" , this.props.history.location.state);
    const updatedTaskObj = {
      message: this.state.taskMessage,
      targeted_date: this.state.taskTargetedDate,
      user: this.state.taskObj.user,
    };
    TaskService.updateTask(this.state.taskObj.id, updatedTaskObj)
      .then((res) => {
        this.setState({
          alertMessage: "Note updated Successfully",
        });
        this.changeAlertSuccess();
        setTimeout(() => {
          this.props.history.goBack();
        }, 2000);
      })
  };
   componentDidMount() {
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");
      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    this.setState({ user: this.props.history.location.state.user });
    TaskService.getTasksByUser(this.props.history.location.state.user)
      .then((res) => {
        this.setState({ tasksList: res.data.tasksData });
      })
  }
  render() {
    return (
      
      <div style={TableStyle.card}>
        <div style= {TableStyle.header}className="card-body">
          <h1 style={{marginLeft : "0px"}} >Edit Task</h1>
          <div className="card-body" style={{marginRight : "50px"}}>
            <form action=""  style={{marginRight : "50px"}}>
                <div className="form-group" style={TableStyle.formGroup} >
                    <h5 >Message</h5>
                    <input
                      type="text"
                      placeholder="message"
                      className="form-control"
                      value={this.state.noteMessage}
                      onChange={this.changeMessage}
                    />
                </div>
                <div className="form-group" >
                    <label >targeted date</label>
                    <input
                      type="date"
                      placeholder="description"
                      className="form-control"
                      value={this.state.taskTargetedDate}
                      onChange={this.changeTargetedDate}
                    />
                  </div>
                <div style= {TableStyle.AddNote }>
                    <div
                      className="btn btn-success"
                      onClick={this.updateNote}
                    >
                      Update
                    </div>
                </div>
            </form>
         </div>
        </div>
      </div>
    );
  }
}
var TableStyle = {
 
  header: {
    display: "flex",
    padding:"2rem",
    alignItems: "center",
    textAlign:"center",
    marginLeft:"35%",
    marginBottom:"0%"
  },
  card: {
    backgroundColor: "lavender",
    padding: "1rem",
    width: "100%",
    height:"100%",
    position:"absolute"
  },
  FormStyle:{
    justifyContent: "center",
    marginTop:"5%",
    position:"absolute",
    alignItems: "center",
    marginRight:"8rem",
    marginLeft:"0rem",
    marginTop:"6rem",
    fontSize: "1.1rem",
    fontWeight: "bold",
   
  },
 formGroup:{
    padding:"5px",
    marginLeft:"0px" ,
    marginRight:"10px"
 },
  AddNote: {
    display: "flex",
    justifyContent: "center",
    marginTop:"0%"
  },
  input: {
    width: "600px",
    padding: "1rem 1.5rem",
    fontSize: "1.2rem",
    marginRight: "1rem",
    fontWeight: "bold",
  },
  msg:{
      textAlign:"center",
      marginLeft:"0px"
  },
  addBtn: {
    backgroundColor: "yellow",
    color: "black",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem 1.5rem",
  },
 
  updateBtn: {
    backgroundColor: "pink",
    color: "black",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem 1.5rem",
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
}
import React, { Component } from "react";
import NoteService from "../Services/NoteService";

export default class FullNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
        noteMessage: this.props.history.location.state.message,
        noteObj: this.props.history.location.state,
        alertMessage: "",
    };
    
    this.changeMessage = this.changeMessage.bind(this);
    this.updateNote = this.updateNote.bind(this);
   
  }
 
  changeMessage = (e) => {
    this.setState({ noteMessage: e.target.value });
  };
  updateNote = (e) => {
    console.log("user" , this.props.history.location.state);

    const updatedNoteObj = {
      message: this.state.noteMessage,
      user: this.state.noteObj.user,
    };
    console.log(updatedNoteObj)
    console.log(this.state.noteMessage)
    console.log(this.state.noteObj.id)
    NoteService.updateNote(this.state.noteObj.id, updatedNoteObj)
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
    // document.querySelector(".popup").style.display = "none";
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");
      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    this.setState({ user: this.props.history.location.state.user });
    NoteService.getNotesByUser(this.props.history.location.state.user)
      .then((res) => {
        this.setState({ notesList: res.data.notesData });
      })
      .catch((err) => {
        this.serverErrorPopup("while fetching notes...");
      });
  }

  

  render() {
    return (
      
      <div style={TableStyle.card}>
        <div style= {TableStyle.header}className="card-body">
          <h1 >Edit note </h1>
          
   
          <div className="card-body">
            <form action="" style={TableStyle.FormStyle}>
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
        
          );
        
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
import React, { Component } from "react";
import NoteService from "../Services/NoteService";

export default class NotesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notesList: [],
      newNoteText: "",
      newNoteId: "",
    };
    
    this.NewNoteHandeler = this.NewNoteHandeler.bind(this);
    this.addNote = this.addNote.bind(this);
    this.openNote = this.openNote.bind(this);
    this.DeleteNoteHandeler = this.DeleteNoteHandeler.bind(this);
    this.handleLogOutClick = this.handleLogOutClick.bind(this);
  }
  componentDidMount() {
   
    this.setState({ newNoteText: "" });
    
    if (typeof this.props.history.location.state === "undefined") {
      this.props.history.push("/unauthorized");

      return;
    }
    this.setState({ token: this.props.history.location.state.token });
    console.log("state", this.props.history.location.state);
    this.setState({ user: this.props.history.location.state});
    console.log(this.props.history.location.state);
    NoteService.getNotesByUser(this.props.history.location.state).then(
      (res) => {
        this.setState({ notesList: res.data });
        console.log(res.data)
      }
    );
    
  }
  NewNoteHandeler(e) {
    this.setState({ newNoteText: e.target.value });
  }
  addNote(e) {
    document.querySelector("#noteInput").value = "";
    console.log(this.state.newNoteText);
    console.log(this.state.user);
    console.log("user" , this.props.history.location.state);
    const noteObj = {
      message: this.state.newNoteText,
      user: this.state.user,
    };
    console.log(noteObj);
    NoteService.addNote(noteObj).then((res) => {
      console.log("Note created", res.data);
      this.setState({ notesList: [...this.state.notesList, res.data] });
    });
  }
  openNote(e) {
    var id = (e.currentTarget.getAttribute("id"));
    this.setState({ newNoteId: id });
    var message = e.currentTarget.getAttribute("message");
    this.setState({ newNoteText: message });
    var noteObj = { id, message, user: this.state.user };
    this.props.history.push("/edit-note", noteObj);
  }
  DeleteNoteHandeler(e) {
    var noteId = (e.currentTarget.getAttribute("id"));
    NoteService.deleteNote(noteId)
      .then((res) => {
        this.setState({
          notesList: this.state.notesList.filter((note) => note.id !== noteId),
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
          <h1 >Your notes </h1>
          <button id="logoutBtn" style={TableStyle.logoutBtn} onClick={this.handleLogOutClick}>
            Logout
          </button>
        </div>    
        <div style={TableStyle.AddNote}>
          <input id="noteInput"style={TableStyle.input} type="text" placeholder="Create a new note..." onChange={this.NewNoteHandeler}/>
          <button id="addBtn" style={TableStyle.addBtn}  onClick={this.addNote}>
              Add
          </button>
          
        </div>
      
    
        {this.state.notesList.map((notes, index) => {
          return (
            <div key={notes.id} style={TableStyle.note}>
              <p style={TableStyle.id}>{index + 1}</p>
              <p>{notes.message}</p>
              <button onClick={this.openNote}
                id={notes.id}
                message={notes.message}
                style={TableStyle.EditButton}
                >
                Edit
              </button>
              <button
                onClick={this.DeleteNoteHandeler}
                id={notes.id}
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
}
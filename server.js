const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    res.json(db);
});

app.post("/api/notes", (req, res) => {

    let note = req.body;

    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let noteData = JSON.parse(data);
        note["id"] = noteData.length;
        noteData.push(note);

        let updatedNotes = JSON.stringify(noteData);

        fs.writeFile("./db/db.json", updatedNotes, (err) => { 
            if(err) throw err; 
            return data; 
        });

        res.json(db);
        console.log("Note saved.");
    });
})

app.delete("/api/notes/:id", (req, res) => {
    let selectNote = req.params.id;
    let notes = db;

    for (var i = 0; i < notes.length; i++) {
        if (selectNote == notes[i].id) {
            notes.splice(i, 1);
            return notes;
        }

        var updatedNotes = JSON.stringify(notes);
        fs.writeFile("./db/db.json", updatedNotes, (err) => { if(err) throw err });
    }
    console.log("Note deleted.");
});

app.listen(process.env.PORT || PORT, () => {
    console.log("Listening on port " + PORT + "...");
});
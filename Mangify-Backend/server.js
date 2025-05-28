const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect("mongodb://localhost:27017/mangifydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const mangaSchema = new mongoose.Schema({
  Title: String,
  pdfUrl: String,
});
const Manga = mongoose.model("Manga", mangaSchema, "mangas");

const musicSchema = new mongoose.Schema({
  Title: String,
  Mood: String,
  audioUrl: String,
});

const Music = mongoose.model("Music", musicSchema, "music");

// rutas GET
app.get("/manga/:title", async (req, res) => {
  const title = req.params.title;
  const result = await Manga.find(
    { Title: new RegExp(`^${title}$`, "i") },
    { pdfUrl: 1, _id: 0 }
  );
  res.json(result);
});

app.use("/music", express.static(path.join(__dirname, "public", "music")));

app.get("/music/:mood", async (req, res) => {
  const mood = req.params.mood;
  const songs = await Music.find(
    { Mood: new RegExp(`^${mood}$`, "i") },
    { audioUrl: 1, _id: 0 }
  );
  res.json(songs);
});

// Archivos estáticos (PDFs, música)
app.use("/mangas", express.static(path.join(__dirname, "public", "mangas")));

app.listen(3001, () =>
  console.log("Servidor backend en http://localhost:3001")
);

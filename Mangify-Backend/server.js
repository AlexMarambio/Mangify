const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
//const { default: postcss } = require("postcss");

const fs = require("fs");

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

const configSchema = new mongoose.Schema({
  Manga: String,
  configUrl: String,
});

const config = mongoose.model("Config", musicSchema, "config");

// rutas GET
//ruta estatica
app.use("/mangas", express.static(path.join(__dirname, "public", "mangas"))); //cambiar a data

app.get("/manga/:title", async (req, res) => {
  const title = req.params.title;
  const result = await Manga.find(
    { Title: new RegExp(`^${title}$`, "i") },
    { pdfUrl: 1, _id: 0 }
  );
  res.json(result);
});

app.use("/music", express.static(path.join(__dirname, "public", "music"))); //cambiar a data

app.get("/music/:mood", async (req, res) => {
  const mood = req.params.mood;
  const songs = await Music.find(
    { Mood: new RegExp(`^${mood}$`, "i") },
    { Title: 1, audioUrl: 1, _id: 0 }
  );
  res.json(songs);
});

app.use("/config", express.static(path.join(__dirname, "data", "config")));

app.get("/loadconfig/:file", async (req, res) => {
  //corregir y agregar el archivo a la base de datos
  const file = await req.params.find(
    { data: new RegExp(`^${file}$`, "i") },
    { Url: 1, _id: 0 }
  );
  res.json(config);
});

//rutas POST
app.post("/saveConfig", async (req, res) => {
  const config = req.body;

  const filePath = path.join(__dirname, "data", "config", "config.json");

  fs.writeFile(filePath, JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.log("Fallo al escribir la data");
      return res.status(500).json({ message: "Error al guardar el archivo" });
    } else {
      console.log("Archivo almacenado correctamente");
      return res.status(200).json({ message: "Configuración guardada" });
    }
  });
});

app.listen(3001, () =>
  console.log("Servidor backend en http://localhost:3001")
);

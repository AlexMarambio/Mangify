const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
//const { default: postcss } = require("postcss");

const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
const User = "benja";
const Password = "colocolo";

const MongoUri =
  "mongodb+srv://" +
  User +
  ":" +
  Password +
  "@mangifycluster.c7knnmc.mongodb.net/mangifydb?retryWrites=true&w=majority&appName=Mangify";

// MongoDB
mongoose
  .connect(MongoUri)
  //, {
  //  useNewUrlParser: true,
  //  useUnifiedTopology: true,
  //});
  .then(() => console.log("✅ Conectado a MongoDB correctamente")) //no subir así
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err)); //no subir así
// Schemas
const mangaSchema = new mongoose.Schema({
  Title: String,
  pdfUrl: String,
});
const Manga = mongoose.model("Manga", mangaSchema, "mangas");

const musicSchema = new mongoose.Schema({
  Title: String,
  Autor: String,
  Mood: [String],
  Loop: Boolean,
  audioUrl: String,
});

const Music = mongoose.model("Music", musicSchema, "music");

const configSchema = new mongoose.Schema({
  Manga: String,
  configUrl: String,
});

const config = mongoose.model("Config", configSchema, "config");

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

app.use("/musica", express.static(path.join(__dirname, "public", "music")));

app.get("/musicFull", async (req, res) => {
  try {
    const allMoods = await Music.distinct("Mood");
    const uniqueMoods = [
      ...new Set(allMoods.map((m) => m.trim().toLowerCase())),
    ];

    const moodUrlPairs = await Promise.all(
      uniqueMoods.map(async (mood) => {
        const result = await Music.aggregate([
          { $match: { Mood: { $in: [new RegExp(`^${mood}$`, "i")] } } },
          { $sample: { size: 1 } },
          { $project: { audioUrl: 1, _id: 0 } },
        ]);
        return result[0] ? { [mood]: result[0].audioUrl } : null;
      })
    );

    // Combinar en un solo objeto y eliminar nulos
    const moodUrlObject = Object.assign({}, ...moodUrlPairs.filter(Boolean));

    res.json(moodUrlObject);
  } catch (err) {
    console.error("Error en /musicFull:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/musiclink/:mood", async (req, res) => {
  const mood = req.params.mood.trim().toLowerCase();
  const songs = await Music.find(
    { Mood: { $in: [new RegExp(`^${mood}$`, "i")] } },
    { audioUrl: 1, _id: 0 }
  );
  res.json(songs);
});

app.get("/debug/music", async (req, res) => {
  const all = await Music.find({}, { Title: 1, Mood: 1, _id: 0 });
  res.json(all);
});

app.use("/config", express.static(path.join(__dirname, "data", "config")));

//app.get("/loadconfig/:file", async (req, res) => {
//  //corregir y agregar el archivo a la base de datos
//  const file = await req.params.find(
//    { data: new RegExp(`^${file}$`, "i") },
//    { Url: 1, _id: 0 }
//  );
//  res.json(config);
//});

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
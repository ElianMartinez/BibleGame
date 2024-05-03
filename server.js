const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database("database.sqlite");

app.use(cors());
app.get("/pregunta/:nivel", (req, res) => {
  const nivelPregunta = parseInt(req.params.nivel);

  obtenerPreguntaAleatoria(nivelPregunta, (pregunta) => {
    if (pregunta) {
      marcarPreguntaVista(pregunta.ID);
      res.json(pregunta);
    } else {
      res.json({ error: "No hay preguntas disponibles" });
    }
  });
});

app.get("/reset", (req, res) => {
  setAllQuestionsToUnviewed();
  res.json({ message: "Preguntas marcadas como no vistas" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
function obtenerPreguntaAleatoria(nivelPregunta, callback) {
  const sql = `SELECT * FROM registros WHERE Level = ${nivelPregunta} AND Viewed = 0 ORDER BY RANDOM() LIMIT 1`;
  db.get(sql, (err, row) => {
    if (err) {
      console.error(err);
      callback(null);
    } else {
      callback(row);
    }
  });
}

function marcarPreguntaVista(preguntaId) {
  const sql = `UPDATE registros SET Viewed = 1 WHERE id = ${preguntaId}`;
  db.run(sql, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function setAllQuestionsToUnviewed() {
  const sql = `UPDATE registros SET Viewed = 0`;
  db.run(sql, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

const express = require("express");
const fs = require('fs');
const app = express();
app.use(express.json());//to access body in post
app.listen(5000, () => {
    console.log("server is on port 5000");
});

app.get("/teams", (req, res) => {
  fs.readFile('team.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    const teams = JSON.parse(data);
    res.status(200).send(teams);
  });
});
const { v4: uuidv4 } = require('uuid');

app.post('/teams', (req, res) => {
  const { name, trophies, points } = req.body;
  const id = uuidv4();
  const team = { id, name, trophies, points };
  fs.readFile("team.json", 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send(' Error');
    }
    const teams = JSON.parse(data);
    teams.push(team);
    fs.writeFile("team.json", JSON.stringify(teams), (err) => {
      if (err) {
        return res.status(500).send(' Error');
      }
      res.send(team);
    });
  });
});
  
app.patch('/teams', (req, res) => {
    const { id, trophies, points } = req.body;
    fs.readFile("team.json", 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error');
      }
      const teams = JSON.parse(data);
      let teamToUpdate;
      teams.forEach((team) => {
        if (team.id === id) {
          teamToUpdate = team;
        }
      });

      const updatedTeam = {
        ...teamToUpdate,
        trophies: trophies,
        points: points 
      };
      const index = teams.indexOf(teamToUpdate);
      teams[index] = updatedTeam;
      fs.writeFile('team.json', JSON.stringify(teams), (err) => {
        if (err) {
          return res.status(500).send('Error');
        }
        res.send(updatedTeam);
      });
    });
  });

  app.delete('/teams', (req, res) => {
    const { id } = req.body;
    fs.readFile('team.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error');
      }
      let teams = JSON.parse(data);
      let teamToDelete;
      teams.forEach((team) => {
        if (team.id === id) {
          teamToDelete = team;
        }
      });
      
      const index = teams.indexOf(teamToDelete);
      teams.splice(index, 1);
      fs.writeFile('team.json', JSON.stringify(teams), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send(' Error');
        }
        res.send('Team deleted');
      });
    });
  });
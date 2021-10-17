const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "6d314eda3ecc4744b82787feef7c5a51",
});

const handleApiCall = (req, res) => {
  app.models
    .predict("f76196b43bbd45c99b4f3cd8e8b40a8a", req.body.input)
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};

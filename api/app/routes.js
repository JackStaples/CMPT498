var db_controller = require("./controllers/db_controller.js");

module.exports = function(app) {
  app.get('/linegraph', db_controller.linegraph);
  app.get('/scatterplot', db_controller.scatterplot);
}

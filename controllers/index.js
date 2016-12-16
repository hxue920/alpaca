var db = require('../db');
var bcrypt = require('bcrypt');
var saltRounds = 10;

module.exports = {
  // in quiz page, GET request will return object of all quiz Q's and A's
  questions: {
    get: function (req, res) {
      // console.log('===> MAKING GET REQUEST FOR QUESTIONS, REQ.PARAMS = ', JSON.parse(JSON.stringify(req.query)).ID)
      // console.log('===> MAKING GET REQUEST FOR QUESTIONS, REQ.PARAMS = ', req.query.ID)
      if (req.query.ID !== undefined) {
        console.log('INSIDE IF STATEMENT');
        db.Test.findAll({
          where: {
            testName: req.query.ID
          }
        })
        .then(function(questions) {
          res.json(questions);
        });
      } else {
        db.Test.findAll()
        .then(function(questions) {
          res.json(questions);
        });
      }
    },
    // in quiz Creation page, POST request will add an entry into database
    post: function (req, res) {
      console.log('POST REQUEST TO QUESTIONS');
      console.log(JSON.stringify(req.body));
      if (req.body.delete === true) {
        console.log('POST delete request for name = ' + req.body.name);
        db.Question.destroy({
          where: {
            name: req.body.name
          }
        });
      } else {
        db.Question.create({
          name: req.body.name,
          correct: req.body.correct,
          wrong1: req.body.wrong1,
          wrong2: req.body.wrong2,
          wrong3: req.body.wrong3,
          testName: req.body.testName,
        }).then(function(question) {
          res.sendStatus(201);
        });
      }
    }
  },
  user: {
    authenticate: function (attempted, password) {
      return bcrypt.compareSync(attempted, password);
    },
    post: function (req, res) {
      db.User
        .find({where: {username: req.body.username}})
        .then(function(result) {
          if (!result) {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
              if (err) {
                console.log(err);
              }
              db.User.create({
                username: req.body.username,
                password: hash,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
              }).then(function(user) {
                console.log('POSTED USER', user);
                res.sendStatus(201);
              });
            });
          }
        });
    },
    login: function(req, res) {
      res.send(req.body).status(201);
    },
    logout: function (req, res) {
      req.logout();
      res.redirect('/#/login');
    }
  },
  results: {
    // opportunity to keep track of results in database, sorting by userID.
    post: function (req, res) {
      db.Results.create({
        userID: req.body.userID,
        category: req.body.category,
        correct: req.body.correctAns,
        incorrect: req.body.wrongAns
      }).then(function(results) {
        res.sendStatus(201);
      });
    }
  }
};

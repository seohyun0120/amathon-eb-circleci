"use strict";

var path = require('path');

var express = require('express');

var PORT = process.env.HTTP_PORT || 4001;
var app = express();
var todoList = [{
  id: 0,
  title: 'Elastic Beanstalk',
  description: 'ElasticBeanstalk으로 배포하기'
}, {
  id: 1,
  title: 'CircleCI',
  description: 'CircleCI로 CI/CD 세팅하기'
}];
app.use(express["static"](path.join(__dirname, 'client', 'build')));
app.get('/todos', function (req, res) {
  res.json(todoList);
});
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT, "."));
});

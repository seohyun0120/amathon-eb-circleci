const path = require('path');
const express = require('express');
const PORT = process.env.HTTP_PORT || 4001;

const app = express();

const todoList = [
  {
    id: 0,
    title: 'Elastic Beanstalk',
    description: 'ElasticBeanstalk으로 배포하기'
  },
  {
    id: 1,
    title: 'CircleCI',
    description: 'CircleCI로 CI/CD 세팅하기'
  }
]

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('/todos', (req, res) => {
  res.json(todoList);
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
})
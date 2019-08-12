# React + Express Part 2

이전 가이드에서는 기본적인 Front, Back 세팅은 끝났습니다. 이제 간단한 앱을 만들어봅시다.

`TODO` 버튼을 클릭하면 오늘 해야할 일을 보여주는 아주 간단한 앱을 만들어봅시다.  `/todo` 요청을 날리면, 다음과 같은 응답이 오도록 만들어봅시다. 





**server.js**

```js
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

app.get('/todos', (req, res) => {
  res.json(todoList);
});

app.get('/todos/:id', (req, res) => {
  res.json(todoList[req.params.id]);
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
})
```



`yarn start` 또는 `npm start`로 서버를 실행시켜봅시다.

**localhost:4001/todos**

![32](./pic/32.png)





**localhost:4001/todos/:id**

![32](./pic/33.png)

응답이 잘 오는 것을 확인할 수 있습니다.





`TODO`버튼을 클릭하면,  **title**과 **description** 옆에 할 일이 채워지도록 만들어봅시다.

``` bash
$ yarn add axios
```





### 🤙 Axios?

> [Axios](https://github.com/axios/axios)란 HTTP 클라이언트 라이브러리로써, 비동기 방식으로 HTTP 데이터 요청을 실행합니다.





**client/src/App.js**

```js
import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: {}
    }
  }

  getToDo = async () => {
    try {
      const response = await axios.get('/todos');
      this.setState({
        todo: response.data
      })
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div>
        <h1>Hello Stranger?</h1>
        <button onClick={this.getToDo}>
          TODO
        </button>
        <h3>name: {this.state.todo.name}</h3>
        <h4>description: {this.state.todo.description}</h4>
      </div>
    )
  }

}

export default App;
```



여기서 **client**는 3000번 포트에서 실행되고, **server**는 4001번 포트에서 실행되면, 그 둘은 어떻게 통신할 수 있을까요? `http-proxy-middleware` 패키지를 사용하면 됩니다.



### 🤙 http-proxy-middleware? 

>CRA를 통해 React 프로젝트를 생성하면 자동으로 서버가 함께 생성됩니다. 하지만, 우린느 Express로 구축된 서버가 있기 때문에 2개의 서버가 존재합니다. 따라서, proxy 설정을 해줘야합니다. react-scripts의 버전이 2 이상인 경우 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)를 설치해 setupProxy.js라는 파일을 통해 proxy 설정을 할 수 있습니다.



```bash
$ yarn add http-proxy-middleware
또는
$ npm install --save-dev http-proxy-middleware
```





**client/src/setupProxy.js**

```js
const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(proxy('/todos', { target: 'http://127.0.0.1:4001/' }));
  app.use(proxy('/todos/:id', { target: 'http://127.0.0.1:4001/' }));
};
```



이제, **서버**와 **클라이언트**가 통신할 수 있습니다. 2개의 터미널을 열어 **server**와 **client**를 실행시켜 봅시다.

```bash
# client
$ cd client
$ yarn start

# server
$ yarn start
```

![5](./pic/5.png)



![6](./pic/6.png)

**TODO** 버튼을 클릭하면 다음과 같이 현재 state에서 값을 가져오는 것을 확인할 수 있습니다. 

![7](./pic/7.png)

### script 한번에 작성하기

server와 client 매번 2개씩 열기 귀찮으니 한번에 열 수 있도록 script를 수정해봅시다. 

```bash
$ yarn add --dev npm-run-all
```



#### npm-run-all?

npm의 여러 script를 동시에 실행시켜주는 package로 동시에 실행시켜야할 때 간편한 도구입니다. 



```
// package.json
"scripts": {
	"start": "npm-run-all --parallel start:**",
	"start:server": "nodemon --exec babel-node server.js --ignore client/",
	"start:client": "cd ./client && yarn start"
},
```



```sh
$ yarn start
```

다음 script를 입력하면, server와 client가 동시에 실행되는 것을 볼 수 있습니다.



여기까지는 간단한 React + Express 앱을 만들기 위한 준비 과정이었고 이제 본격적으로 CircleCI를 사용해 ElasticBeanstalk으로 배포하는 방법에 대해 배워봅시다. 



### React App을 build 해봅시다

client 폴더 하위에 `.gitignore` 파일을 수정해주세요. `build` 폴더를 elastic beanstalk을 통해 업로드해야하므로  ignore하지 않도록 지워주세요!



```shell
# 프로젝트의 root 경로로 이동해주세요.
$ cd client
$ yarn build
```



`server.js` 코드에 build된 static file을 **serve**하도록 코드를 추가해줍시다.

```javascript
import path from 'path';
import express from 'express';

const PORT = process.env.HTTP_PORT || 4001;
const app = express();

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('/todo', (req, res) => {
  res.json(
    {
      name: 'CircleCI',
      description: 'setting CI/CD with CircleCI'
    });
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
})
```



이제 client는 실행할 필요없이, server만 실행해보도록 합시다.

![13](./pic/13.png)

완성되었습니다!
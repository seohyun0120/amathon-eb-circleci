# React + Express

이번 세션에서는 **Front-End**와 **Back-end**를 하나의 repository에 두고 간단한 웹을 구성해보도록합시다.



## 0️⃣ 프로젝트 시작하기

우리가 만들고자하는 **Application의 구조**는 다음과 같습니다. 

```
amathon
|__ client
    |__ ...
|__ server.js
|__ package.json
|__ package-lock.json
```

위 구조에 따라 만들어보도록 합시다.

- Front-end: [create-react-app](https://github.com/facebook/create-react-app)을 통해 React App 구성

- Back-end: [express server](https://expressjs.com/ko/)



[세션 시작 전 가이드](../guide/Git.md)에서 생성한 repository의 경로로 이동해주세요. 이제, NodeJS로 app을 세팅하고 필요한 dependencies를 설치해보겠습니다. 각자의 기호에 따라 yarn을 사용하거나 npm을 사용하세요. 저는 yarn을 사랑합니다. [(npm vs yarn cheat sheet)](https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc)

```shell
# 초기화
$ yarn init
또는
$ npm init

# Dependencies 설치
$ yarn add express cors
또는
$ npm install express cors --save

# server.js 생성
$ touch server.js
```



## 1️⃣ Back-end (Express server)

Express server가 동작하도록 방금 생성한 **server.js**에 간단히 코드를 작성해봅시다.



**server.js**

```js
const express = require('express');
const PORT = process.env.HTTP_PORT || 4001;

const app = express();

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
})
```



필요한 패키지들을 **devDependencies**로 설치해줍시다.

```shell
$ yarn add @babel/cli @babel/core @babel/node @babel/preset-env nodemon --dev
또는
$ npm install @babel/cli @babel/core @babel/node @babel/preset-env nodemon --save-dev
```





#### 🤙 Babel?

>  Babel은 자바스크립트 표준인 ECMAScript(이하 ES)의 최신 문법으로 작성된 코드를 실행할 수 있도록 이전 버전 문법으로 변환해주는 트랜스파일러입니다. ES6/ES7 코드를 ECMAScript5 코드로 트랜스파일링해줍니다. 





#### 🤙 Nodemon?

>  Nodemon이란 디렉토리내의 파일이 수정될 경우, 자동으로 애플리케이션을 재시작해주는 도구입니다.



**package.json**

```json
{
	...,
	"scripts": {
  	...,
    "start": "nodemon --exec babel-node server.js"
  },
  ...
}
```



**server.js**

```js
const express = require('express');
const app = express();
const PORT = process.env.HTTP_PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
});
```

터미널에서 `yarn start` (혹은 `npm start`) 를 입력하면, console에 `Server listening at port 4001` 라고 적힌 것을 확인할 수 있습니다.



## 2️⃣ Front-end (CRA)

이제 클라이언트를 세팅해보도록 합시다. 해당 프로젝트 root 디렉토리내에서 `client`라는 디렉토리를 만들고, `create-react-app` 을 통해 **React App**을 만들어봅시다.



#### CRA(create-react-app) ?

>  페이스북에서 만든 react 웹 개발용 boilerplate입니다. 직접 환경을 세팅할 필요없이 간단한 앱을 만들 수 있습니다.



```bash
# 현재 경로: ~/amathon

$ yarn create react-app client
또는
$ npm init react-app client
```



![1](./pic/1.png)

(가이드 사진마다 root 경로가 조금씩 다를 수 있습니다. 2번 이상 test하며 가이드를 수정했기에 다를 수 있어요 😀 본인이 프로젝트를 시작한 경로에서 잘 따라와주시면 됩니다!)



````bash
$ cd client
$ yarn start
또는
$ npm start
````

`localhost:3000` 에서 다음과 같은 화면이 뜬다면 성공입니다.

![2](./pic/2.png)

조금 더 심플하게 만들기 위해 필요없는 파일은 지워보도록 하겠습니다. 아래와 같이 **client** 폴더 내의 필요없는 파일은 전부 지워주세요.

```
client
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── index.html
└── src
    ├── App.css
    ├── App.js
    ├── index.css
    ├── index.js
```



![3](./pic/3.png)



코드를 조금 심플하게 수정해봅시다.

**client/public/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```



**client/src/App.js**

```js
import React from 'react';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello Stranger?</h1>
      </div>
    )
  }
}

export default App;
```



**client/src/index.js**

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```



```shell
$ yarn start
또는
$ npm start
```

![4](./pic/4.png)

버튼을 클릭하면 오늘의 할 일을 보여주는 간단한 앱을 만들어봅시다. /todo 요청을 날리면, 다음과 같이 응답이 오도록 만들어봅시다. server.js를 아래와 같이 수정해주세요.

**server.js**

```js
const express = require('express');
const PORT = process.env.HTTP_PORT || 4001;

const app = express();

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



TODO 버튼을 클릭하면, name과 description 옆에 할 일이 채워지는 코드를 작성해봅시다. 

``` bash
$ yarn add axios
```



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
      const response = await axios.get('/todo');
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



```bash
$ yarn add http-proxy-middleware
```



**client/src/setupProxy.js**

```js
const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(proxy('/todo', { target: 'http://127.0.0.1:4001/' }));
};
```



이제, 서버와 클라이언트가 통신할 수 있습니다. 2개의 터미널을 열어 **server**와 **client**를 실행시켜 봅시다.

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
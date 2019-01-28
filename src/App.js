import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';

import { NumberTable } from './NumberTable.js'
import './App.css';

const {
  Header, Footer, Sider, Content,
} = Layout


const Index = () => (
  <div>
    <h2>主页</h2>
    <p>1781的小提琴的react测试页面</p>
  </div>
)
const About = () => (
  <div>
    <h2>关于</h2>
    <p>1781的小提琴的react测试页面</p>
  </div>
)
const Game = () => (
  <div className="Game">
    <h1>2048 Game</h1>
    <NumberTable />
  </div>
)

const AppRouter = () => (
  <Router>
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key='1'>
            <Link to="/home">Home</Link>
          </Menu.Item>
          <Menu.Item key='2'>
            <Link to="/about/">About</Link>
          </Menu.Item>
          <Menu.Item key='3'>
            <Link to="/game/">Game</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 670 }}>
          <Route path="/home/" component={Index} />
          <Route path="/about/" component={About} />
          <Route path="/game/" component={Game} />
        </div>

      </Content>
      <Footer style={{ textAlign: 'center', bottom: 0, left: 0, right: 0 }}>Footer</Footer>
    </Layout>
  </Router>
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppRouter />
      </div>
    );
  }
}

export default App;
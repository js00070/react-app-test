import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import { Layout, Menu } from 'antd';

import { NumberTable } from './NumberTable.js'
import './App.css';

const SubMenu = Menu.SubMenu;

const {
  Header, Footer, Sider, Content,
} = Layout


const Home = () => (
  <div className="Home">
    <h2>主页</h2>
    <p>1781的小提琴的react测试页面</p>
  </div>
)
const About = () => (
  <div className="About">
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
const NoMatch = () => (
  <div className="NoMatch">
    <h2>没有匹配的页面</h2>
  </div>
)

const AppRouter = () => (
  <Router>
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[]}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key='1'>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key='2'>
            <Link to="/about/">About</Link>
          </Menu.Item>
          <SubMenu title={<span> Game </span>}>
            <Menu.Item key="3">
              <Link to="/2048/">2048</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/game/">RussionBlock</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 500 }}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about/" exact component={About} />
            <Route path="/2048/" exact component={Game} />
            <Redirect from="/*" to="/" />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Content>
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
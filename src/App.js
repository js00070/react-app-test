import React, { Component } from 'react';
import { Button, List, Row, Col, Icon } from 'antd';
import './App.css';

// 无效，function和class的区别有待研究
class NumberBlock extends Component {
  constructor(props) {
    console.log("create a block: " + props)
    super(props)
    this.state = {
      fontSize: 60,
      bColor: "#F0F8FF"
    }
  }

  componentDidMount() {
    this.updateStyle()
  }

  updateStyle() {
    this.setState((state, props) => {

      const newState = {
        fontSize: 60,
        bColor: "#F0F8FF"
      }
      if (props.num >= 100 && props.num <= 999) newState.fontSize = 50
      if (props.num >= 1000 && props.num <= 9999) newState.fontSize = 40
      if (props.num >= 2) {
        newState.bColor = "#FAEBD7"
      }
      if (props.num >= 128) {
        newState.bColor = "#7FFFD4"
      }
      console.log("setState!" + newState)
      return newState
    })

  }

  render() {
    return (
      <div className="NumberBlock" style={{ fontSize: this.state.fontSize, backgroundColor: this.state.bColor }}>
        {this.props.num}
      </div>
    )
  }
}

function SimpleBlock(props) {
  let colorTable = new Map()
  colorTable.set(0, "#F0F8FF")
  colorTable.set(2, "#FAEBD7")
  colorTable.set(4, "#FAEBD7")
  colorTable.set(8, "#7FFFD4")
  colorTable.set(16, "#7FFFD4")
  colorTable.set(32, "Chartreuse")
  colorTable.set(64, "Chartreuse")
  colorTable.set(128, "SandyBrown")
  colorTable.set(256, "SandyBrown")
  colorTable.set(512, "red")
  colorTable.set(1024, "red")
  colorTable.set(2048, "red")
  const newState = {
    fontSize: 60,
    bColor: "#F0F8FF"
  }
  if (props.num >= 100 && props.num <= 999) newState.fontSize = 50
  if (props.num >= 1000 && props.num <= 9999) newState.fontSize = 40
  newState.bColor = colorTable.get(props.num)
  return (
    <div className="SimpleBlock" style={{ fontSize: newState.fontSize, backgroundColor: newState.bColor }}>
      {props.num}
    </div>
  )
}

class NumberTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      numTab: [[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      willAdd: true,
      score: 2
    }
  }

  getEmptyBlockList(state) {
    let emptyBlockList = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (state.numTab[i][j] == 0) {
          emptyBlockList.push([i, j])
        }
      }
    }
    return emptyBlockList
  }

  checkGameOver() {
    const emptyBlockList = this.getEmptyBlockList(this.state)
    if (emptyBlockList.length == 0) {
      return true
    }
    return false
  }

  addNum() {
    this.setState((state, props) => {
      if (!state.willAdd) {
        return state
      }
      //console.log("before add")
      //state.numTab.forEach(line => { console.log(line) })
      const emptyBlockList = this.getEmptyBlockList(state)
      const emptyBlockIndex = Math.round(Math.random() * (emptyBlockList.length - 1))
      const [x, y] = emptyBlockList[emptyBlockIndex]
      const newNumTab = state.numTab.map(x => x.slice())
      newNumTab[x][y] = 2
      return {
        numTab: newNumTab,
        score: state.score + 2
      }
    })
  }

  move(dx, dy) {
    this.setState((state, props) => {
      const newNumTab = state.numTab.map(t => t.slice())
      let moveFlag = false // 变动标记，若迭代过程中有变动，则设为true
      let firstMoveFlag = false // 是否至少有一次变动
      let ix0 = 0, iy0 = 0
      let ix1 = 4, iy1 = 4
      let d_ix = 1, d_iy = 1
      if (dx == 0) { // 左右方向的合并
        if (dy == 1) {// 向右合并
          iy0 = 3
          iy1 = -1
          d_iy = -1
        }
      } else { // 上下方向的合并
        if (dx == 1) {// 向下合并
          ix0 = 3
          ix1 = -1
          d_ix = -1
        }
      }
      do {
        // 先把所有方块移动到相应的位置
        moveFlag = false
        for (let ix = ix0; ix != ix1; ix += d_ix) {
          for (let iy = iy0; iy != iy1; iy += d_iy) {
            let x = ix
            let y = iy
            while (x + dx >= 0 && x + dx < 4 && y + dy >= 0 && y + dy < 4) {
              if (newNumTab[x][y] != 0 && newNumTab[x + dx][y + dy] == 0) {// 若自身不为零且前方的方块为零，则移动过去
                newNumTab[x + dx][y + dy] = newNumTab[x][y]
                newNumTab[x][y] = 0
                moveFlag = true
                firstMoveFlag = true
              }
              x += dx
              y += dy
            }
          }
        }
        //console.log("before merge")
        //newNumTab.forEach(line => {console.log(line)})
        // 然后再执行合并操作
        for (let ix = ix0; ix != ix1; ix += d_ix) {
          for (let iy = iy0; iy != iy1; iy += d_iy) {
            let x = ix
            let y = iy
            while (x + dx >= 0 && x + dx < 4 && y + dy >= 0 && y + dy < 4) {
              if (newNumTab[x + dx][y + dy] != 0 && newNumTab[x + dx][y + dy] == newNumTab[x][y]) {// 若前方的方块数字与自己相同且不为零，则合并过去
                newNumTab[x + dx][y + dy] += newNumTab[x][y]
                newNumTab[x][y] = 0
                moveFlag = true
                firstMoveFlag = true
              }
              x += dx
              y += dy
            }
          }
        }
      } while (moveFlag) // 上一轮迭代有变动，继续迭代
      return {
        numTab: newNumTab,
        willAdd: firstMoveFlag,
        score: state.score
      }
    })
  }

  handleClick(dx, dy) {
    return (e) => {
      this.move(dx, dy)
      setTimeout(this.addNum.bind(this), 100)
    }
  }

  componentDidMount() {

    document.addEventListener("keydown", this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown)
  }

  onKeyDown = (e) => {
    switch (e.keyCode) {
      case 38:
        //上
        this.move(-1, 0)
        setTimeout(this.addNum.bind(this), 100)
        break
      case 40:
        //下
        this.move(1, 0)
        setTimeout(this.addNum.bind(this), 100)
        break
      case 37:
        //左
        this.move(0, -1)
        setTimeout(this.addNum.bind(this), 100)
        break
      case 39:
        //右
        this.move(0, 1)
        setTimeout(this.addNum.bind(this), 100)
        break
      default:
        break
    }
  }

  reset() {
    this.setState({
      numTab: [[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      willAdd: true,
      score: 2
    })
  }

  render() {
    return (
      <div className="NumberTable">
        <Row justify="center">
          <Col span={6}><SimpleBlock num={this.state.numTab[0][0]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[0][1]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[0][2]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[0][3]} /></Col>
        </Row>
        <Row justify="center">
          <Col span={6}><SimpleBlock num={this.state.numTab[1][0]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[1][1]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[1][2]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[1][3]} /></Col>
        </Row>
        <Row justify="center">
          <Col span={6}><SimpleBlock num={this.state.numTab[2][0]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[2][1]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[2][2]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[2][3]} /></Col>
        </Row>
        <Row justify="center">
          <Col span={6}><SimpleBlock num={this.state.numTab[3][0]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[3][1]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[3][2]} /></Col>
          <Col span={6}><SimpleBlock num={this.state.numTab[3][3]} /></Col>
        </Row>
        <h1>Score = {this.state.score}</h1>
        <div><Icon type="arrow-up" onClick={this.handleClick(-1, 0).bind(this)} /></div>
        <div>
          <Icon type="arrow-left" onClick={this.handleClick(0, -1).bind(this)} />
          <span>-----</span>
          <Icon type="arrow-right" onClick={this.handleClick(0, 1).bind(this)} />
        </div>
        <div><Icon type="arrow-down" onClick={this.handleClick(1, 0).bind(this)} /></div>
        <div>________</div>
        <Button onClick={this.reset.bind(this)}>Reset</Button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <NumberTable />
      </div>
    );
  }
}

export default App;
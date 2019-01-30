import React, { Component } from 'react';
import { Button, List, Row, Col, Form, Input } from 'antd';
import './App.css';

function Block(props) {
    return (
        <div class="ChessBlock">
            {props.num != "" ? props.num : ""}
        </div>
    )
}

const serverSocket = "47.96.184.227:80"
const ws = new WebSocket("ws://"+ serverSocket);

function sendToServer(infos) {
    ws.send(JSON.stringify(infos))
}

class Main extends Component {
    constructor(props) {
        super(props)
        let board = new Array(props.N)
        for (let i = 0; i < props.N; i++) {
            board[i] = new Array(props.N)
            for (let j = 0; j < props.N; j++) {
                board[i][j] = ""
            }
        }
        
        this.state = {
            next: "X",
            board: board,
            sessionKey: ""
        }
    }


    clearBoard() {
        let board = new Array(this.props.N)
        for (let i = 0; i < this.props.N; i++) {
            board[i] = new Array(this.props.N)
            for (let j = 0; j < this.props.N; j++) {
                board[i][j] = ""
            }
        }
        this.setState((state) => {
            return {
                next: "X",
                board: board,
                sessionKey: state.sessionKey
            }
        })
    }

    handleClick(i, j) {
        return () => {
            console.log("Click on " + i + "," + j)
            this.setState((state, props) => {
                console.log("Next: " + state.next)
                let board = state.board.map(row => row.slice())
                if (board[i][j] != "O" && board[i][j] != "X") {
                    board[i][j] = state.next
                    console.log("set " + i + "," + j + " " + board[i][j])
                }
                let newNext = state.next
                if (board[i][j] != "") {
                    newNext = (board[i][j] == "X" ? "O" : "X")
                    sendToServer({
                        i: i,
                        j: j,
                        content: board[i][j],
                        sessionKey: this.state.sessionKey
                    })
                }
                console.log("newNext: " + newNext)
                return {
                    next: newNext,
                    board: board,
                    sessionKey: state.sessionKey
                }
            })
        }
    }

    handleServerMsg(e) {
        const msg = e.data
        console.log("receive msg from server: "+msg)
        const order = JSON.parse(msg)
        this.setState((state,props) => {
            let board = state.board.map(row => row.slice())
            let newNext = state.next
            if(board[order.i][order.j] == ""){
                board[order.i][order.j] = order.content
                newNext = state.next=="X"? "O" : "X"
            }
            return {
                board: board,
                next: newNext,
                sessionKey: state.sessionKey
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ' + JSON.stringify(values));
                this.setState((state) => {
                    return {
                        next: state.next,
                        board: state.board,
                        sessionKey: values.sessionKey
                    }
                })
                values["setup_session"] = true
                sendToServer(values)
                ws.onmessage = this.handleServerMsg.bind(this)
            }
        })
        this.clearBoard()
    }

    render() {
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
        return (
            <div className="Main">
                <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Item>
                        {getFieldDecorator("sessionKey")(
                            <Input placeholder="sessionKey" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

                {this.state.board.map((row, i) => (
                    <Row justify="center" key={i}>
                        {row.map((x, j) => {
                            return (
                                <Col span={1} key={j} onClick={this.handleClick(i, j).bind(this)}>
                                    <Block num={x} />
                                </Col>
                            )
                        })}
                    </Row>
                ))}
                <h3> 轮到{this.state.next == "X" ? "黑方" : "白方"}落子 </h3>
            </div>
        )
    }
}

Main = Form.create()(Main)

class FiveChess extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        return (
            <div className="ChessTable">
                <h2>五子棋</h2>

                <Main N={24} />
            </div>
        )
    }
}

export { FiveChess }
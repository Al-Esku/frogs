import React from 'react';
import './App.css';
import {FixedSizeList as List} from 'react-window';

function App() {
    const [leftFrogs, setLeftFrogs] = React.useState(1);
    const [rightFrogs, setRightFrogs] = React.useState(1);
    const [moves, setMoves] = React.useState<string[][]>([])
    const total = React.useRef(0)
    const [error, setError] = React.useState(false)
    const listRef = React.useRef<any>(null);

    function calculate(e: React.FormEvent) {
        e.preventDefault()
        setMoves([])
        setError(false)
        total.current = 0
        let movesArray: string[][] = []
        let solution: string[] = []
        let state: string[] = []
        for (let i = 1; i <= leftFrogs; i++) {
            state = [...state, `R${i}`]
            solution = [...solution, `R${i}`]
        }
        state = [...state, "_"]
        solution = ["_", ...solution]
        for (let i = 1; i <= rightFrogs; i++) {
            state = [...state, `B${i}`]
        }
        for (let i = rightFrogs; i > 0; i--) {
            solution = [`B${i}`, ...solution]
        }

        let current = `R${leftFrogs}`
        let startTime = Date.now();
        let timeout = 5000; // 5 seconds

        while (!state.every((val, index) => val === solution[index])) {
            let index = state.indexOf(current)
            if (current[0] === "R") {
                if (((state.length - index > 2 && state[index + 2][0] === "B") || (state.length === index + 2)) && state[index + 1] === "_") {
                    movesArray = [...movesArray, [...state]]
                    total.current++
                    state[index] = "_"
                    state[index + 1] = current
                    let num = +current.split("R")[1] - 1
                    if (num > 0) {
                        current = `R${num}`
                    } else {
                        current = "B1"
                    }
                } else if (state.length - index > 2 && state[index + 1][0] === "B" && state[index + 2] === "_") {
                    movesArray = [...movesArray, [...state]]
                    total.current++
                    state[index] = "_"
                    state[index + 2] = current
                    let num = +current.split("R")[1] - 1
                    if (num > 0) {
                        current = `R${num}`
                    } else {
                        current = "B1"
                    }
                } else if (index + 1 < state.length && index > 0 && state[index + 1] === "_" && state[index - 1] === `B${rightFrogs}`) {
                    movesArray = [...movesArray, [...state]]
                    total.current++
                    state[index] = "_"
                    state[index + 1] = current
                    let num = +current.split("R")[1] - 1
                    if (num > 0) {
                        current = `R${num}`
                    } else {
                        current = "B1"
                    }
                } else {
                    let num = +current.split("R")[1] - 1
                    if (num <= 0 || index !== rightFrogs + num + 1) {
                        current = "B1"
                    } else {
                        current = `R${num}`
                    }
                }
            } else {
                if (((index >= 2 && state[index - 2][0] === "R") || (index === 1)) && state[index - 1] === "_") {
                    movesArray = [...movesArray, [...state]]
                    total.current++
                    state[index] = "_"
                    state[index - 1] = current
                    let num = +current.split("B")[1] + 1
                    if (num <= rightFrogs) {
                        current = `B${num}`
                    } else {
                        current = `R${leftFrogs}`
                    }
                } else if (index >= 2 && state[index - 1][0] === "R" && state[index - 2] === "_") {
                    movesArray = [...movesArray, [...state]]
                    total.current++
                    state[index] = "_"
                    state[index - 2] = current
                    let num = +current.split("B")[1] + 1
                    if (num <= rightFrogs) {
                        current = `B${num}`
                    } else {
                        current = `R${leftFrogs}`
                    }
                } else if (index === 1 && state[index - 1] === "_") {
                    movesArray = [...movesArray, [...state]]
                    total.current++
                    state[index] = "_"
                    state[index - 1] = current
                    let num = +current.split("B")[1] + 1
                    if (num <= rightFrogs) {
                        current = `B${num}`
                    } else {
                        current = `R${leftFrogs}`
                    }
                } else if (index === +current.split("B")[1] && state[index - 1] === "_") {
                    movesArray = [...movesArray, [...state]]
                    total.current++
                    state[index] = "_"
                    state[index - 1] = current
                    let num = +current.split("B")[1] + 1
                    if (num <= rightFrogs) {
                        current = `B${num}`
                    } else {
                        current = `R${leftFrogs}`
                    }
                } else if (index === +current.split("B")[1] + 1 && state[index - 1][0] === "R" && state[index - 2] === "_") {
                    movesArray = [...movesArray, [...state]]
                    total.current++
                    state[index] = "_"
                    state[index - 2] = current
                    let num = +current.split("B")[1] + 1
                    if (num <= rightFrogs) {
                        current = `B${num}`
                    } else {
                        current = `R${leftFrogs}`
                    }
                } else {
                    let num = +current.split("B")[1] + 1
                    if (num > rightFrogs || index !== num - 2) {
                        current = `R${leftFrogs}`
                    } else {
                        current = `B${num}`
                    }
                }
            }
            if (Date.now() - startTime > timeout) {
                console.log("Calculation took too long. Stopping...");
                setError(true)
                break;
            }
        }
        setMoves([...movesArray, state])
    }

    return (
    <div className={"flex justify-center mt-5"}>
        <div>
            <form onSubmit={event => calculate(event)}>
                <div className={"flex justify-center"}>
                    <div className={"flex flex-col m-2"}>
                        <label htmlFor={"left"}>Number of frogs on the left</label>
                        <input type={"number"} id={"left"} onChange={e => {
                            if (e.target.valueAsNumber >= 1) {
                                setLeftFrogs(e.target.valueAsNumber)
                            }
                        }} value={leftFrogs} className={"border p-0.5 pl-1 rounded"}/>
                    </div>
                    <div className={"flex flex-col m-2"}>
                        <label htmlFor={"right"}>Number of frogs on the right</label>
                        <input type={"number"} id={"right"} onChange={e => {
                            if (e.target.valueAsNumber >= 1) {
                                setRightFrogs(e.target.valueAsNumber)
                            }
                        }} value={rightFrogs} className={"border p-0.5 pl-1 rounded"}/>
                    </div>
                </div>
                <div className={"flex justify-center"}>
                    <button type={"submit"} className={"border px-2 py-1 rounded"}>Run</button>
                </div>
            </form>
            <div className={"flex justify-center w-full"}>
                <div className={"flex flex-col justify-center w-full"}>
                    <div className={"flex justify-center " + (error ? "text-red-600" : "")}>
                        Total Moves: {total.current}{error ? " (incomplete run: Calculation took too long. Try using smaller numbers)": ""}
                    </div>
                    <List
                        ref={listRef}
                        height={window.screen.height - 270}
                        itemCount={moves.length}
                        itemSize={20}
                        width={window.screen.width}
                        className={"overflow-auto border-t"}
                    >
                        {({ index, style}) => (
                            <div className={"flex " + (leftFrogs + rightFrogs > 60 ? "": "justify-center")} style={style}>
                                {moves[index].map(item => (
                                    <span key={item} className={"m-1 " + (item[0] === "R" ? "text-red-600": item[0] === "B" ? "text-blue-600" : "")}>{item}</span>
                                ))}
                            </div>
                        )}
                    </List>
                </div>
            </div>
        </div>
    </div>
    );
}

export default App;

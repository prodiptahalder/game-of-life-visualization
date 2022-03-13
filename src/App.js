import { useState, useRef, useCallback } from 'react';
import produce from 'immer';
import '../src/assessts/tailwind.css';

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
    for(let i=0; i<numRows; i++) {
      rows.push(Array.from(Array(numCols), ()=>0))
    }
    return rows;
}

const generateRandomGrid = () => {
  const rows = [];
    for(let i=0; i<numRows; i++) {
      rows.push(Array.from(Array(numCols), ()=>Math.random()>0.5?1:0));
    }
    return rows;
}

function App() {
  const [grid, setGrid] = useState(()=>{
    return generateEmptyGrid();
  });
  const[running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(()=>{
    if(!runningRef.current){
      return;
    }
    //simulate 
    setGrid((g) => {
      return produce(g, gridCopy => {
        for(let i = 0; i < numRows; i++) {
          for(let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 100);
  },[]);

  return (
    <div 
      class="object-center"
      style={{
      textAlign: 'center'
      }}
    >
    <h1 class="justify-center my-3 text-3xl font-bold" style={{color:"#288BA8"}}> Game Of Life </h1>
    
    <div class="justify-center">
      <p>
      "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970."
      </p>
      <div class="justify-center inline-grid grid-cols-2 gap-4">
        <div
          class="justify-self-center align-baseline"
              style={{width:20, 
                height:20, 
                backgroundColor:"#288BA8", 
                border: "solid 1px black"
              }}
        />
        <p class="justify-self-center">Alive Cells</p>
        <div
          class="justify-self-center align-baseline"
              style={{width:20, 
                height:20, 
                backgroundColor:undefined, 
                border: "solid 1px black"
              }}
        />
        <p class="justify-self-center">Dead Cells</p>
      </div>
      <p>
      Each cell interacts with its eight neighbors (horizontal, vertical, diagonal) using the following four rules (taken from this Wikipedia article. <a class="text-red-300" href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noreferrer">Click Here</a>):
      </p>
      <div class="justify-center mx-10 font-semibold text-lg">
        <ul>
        <li>Any live cell with fewer than two live neighbors dies by under-population.</li>
        <li>Any live cell with two or three live neighbors lives on to the next generation.</li>
        <li>Any live cell with more than three live neighbors dies, by over-population.</li>
        <li>Any dead cell with exactly three live neighbors becomes a live cell, by reproduction.</li>
        </ul>
      </div>
      <br/>
      
      <h1 class="justify-center my-1 text-xl" style={{color:"#288BA8"}}>Instructions:</h1>
      <p>
        Click on the boxes to mark them as alive cells, you can also reset them to dead cells, by re-clicking on the alive cells.
      </p>
      <p>
        Or
      </p>
      <p>
        You can use the random button to randomly set some cells as alive cells.
      </p>
    </div>
    <div class="justify-center my-2">
      <button
          class={`${running?"bg-red-500":"bg-sky-600"} hover:${running?"bg-red-700":"bg-sky-700"} px-6 py-2 mx-2 rounded-full text-white`}
          onClick={() => {
            setRunning(!running);
            if(!running) {
              runningRef.current = true;
              runSimulation();
            }
          }
          }
        >
          {running?'stop':'start'}
        </button>
        <button
          class="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 px-6 py-2 mx-2 rounded-full text-white"
          onClick={() => {
            setGrid(generateRandomGrid());
          }}
        >
          random
        </button>
        <button
          class="bg-sky-600 hover:bg-sky-700 px-6 py-2 mx-2 rounded-full text-white"
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          clear
        </button>
      </div>
      <div
      class="my-4 justify-center"
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}
      >
        {grid.map((rows,i) => 
          rows.map((col, j) => 
          <div
          key={`${i}-${j}`}
          onClick={()=>{
            const newGrid = produce(grid, gridCopy => {
              gridCopy[i][j]=gridCopy[i][j]?0:1;
            })
            setGrid(newGrid);
          }} 
          style={{width:20, 
            height:20, 
            backgroundColor: grid[i][j]?"#288BA8":undefined, 
            border: "solid 1px black"
          }}/>
          ))}
      </div>
    </div>
  );
}

export default App;

import { useState, useRef, useCallback } from 'react';
import produce from 'immer';

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
    <div style={{
      textAlign: 'center'
    }}>
    <h1 style={{color:"#288BA8"}}>Game Of Life</h1>
      <button
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
        onClick={() => {
          setGrid(generateRandomGrid());
        }}
      >
        random
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        clear
      </button>
      <div
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
          style={{width:18, 
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

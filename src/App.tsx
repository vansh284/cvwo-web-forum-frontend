import "./App.css";
import ThreadsList from "./features/threads/ThreadsList";
import { Route, Routes } from "react-router-dom";
import { ThreadPage } from "./features/threads/ThreadPage";
import Home from "./features/user/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/threads" element={<ThreadsList />} />
      <Route path="/thread/:id" element={<ThreadPage />} />
    </Routes>
  );
}

export default App;
// <div className="App">
//   <header className="App-header">
//     <img src={logo} className="App-logo" alt="logo" />
//     <Counter />
//     <p>
//       Edit <code>src/App.tsx</code> and save to reload.
//     </p>
//     <span>
//       <span>Learn </span>
//       <a
//         className="App-link"
//         href="https://reactjs.org/"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         React
//       </a>
//       <span>, </span>
//       <a
//         className="App-link"
//         href="https://redux.js.org/"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         Redux
//       </a>
//       <span>, </span>
//       <a
//         className="App-link"
//         href="https://redux-toolkit.js.org/"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         Redux Toolkit
//       </a>
//       ,<span> and </span>
//       <a
//         className="App-link"
//         href="https://react-redux.js.org/"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         React Redux
//       </a>
//     </span>
//   </header>
// </div>

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

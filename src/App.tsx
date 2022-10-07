import "./App.css";
import { Scrollbar } from "./components";

function App() {
  return (
    <Scrollbar
      style={{
        position: "relative",
        top: "150px",
        left: "150px",
        width: "50%",
        height: "calc(100vh - 250px)",
      }}
    >
      <div style={{ width: "100px" }}>
        {[...Array(50)].map((_x, i) => (
          <p style={{ margin: 0 }} key={i}>
            {i}
          </p>
        ))}
      </div>
    </Scrollbar>
  );
}

export default App;

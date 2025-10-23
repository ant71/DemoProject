import './App.css'

function App() {
  return (
    <div className="App">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="content">
        <div className="hero-section">
          <h1 className="main-title">This is a demo project</h1>
          <p className="subtitle">Built with React, TypeScript & Vite</p>

          <div className="feature-cards">
            <div className="feature-card">
              <div className="icon">⚡</div>
              <h3>Fast</h3>
              <p>Lightning-fast development with Vite</p>
            </div>
            <div className="feature-card">
              <div className="icon">🎨</div>
              <h3>Modern</h3>
              <p>Beautiful and responsive design</p>
            </div>
            <div className="feature-card">
              <div className="icon">🚀</div>
              <h3>Ready</h3>
              <p>Production-ready setup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

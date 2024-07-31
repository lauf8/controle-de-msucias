import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CategoryForm from './components/CategoryForm';
import AlbumForm from './components/AlbumForm';
import SingerForm from './components/SingerForm';
import TrackForm from './components/TrackForm';
import AlbumList from './components/AlbumList'; // Import AlbumList
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Página Inicial</h2>
      <AlbumList /> {/* Include AlbumList here */}
      <div className="list-group mt-4">
        <Link to="/categories" className="list-group-item list-group-item-action">
          Cadastro de Categorias
        </Link>
        <Link to="/albums" className="list-group-item list-group-item-action">
          Cadastro de Álbuns
        </Link>
        <Link to="/singers" className="list-group-item list-group-item-action">
          Cadastro de Cantores
        </Link>
        <Link to="/tracks" className="list-group-item list-group-item-action">
          Cadastro de Tracks
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/">Cadastro de Música</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/categories">Categorias</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/albums">Álbuns</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/singers">Cantores</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/tracks">Tracks</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoryForm />} />
          <Route path="/albums" element={<AlbumForm />} />
          <Route path="/singers" element={<SingerForm />} />
          <Route path="/tracks" element={<TrackForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost/api/albums');
        const albumsWithDetails = await Promise.all(response.data.map(async (album) => {
          try {
            const singerResponse = await axios.get(`http://localhost/api/singers/${album.singer_id}`);
            const tracksResponse = await axios.get(`http://localhost/api/albums/${album.id}/tracks`);
            album.singerName = singerResponse.data.name;
            album.tracks = tracksResponse.data || []; 
            album.totalDuration = album.tracks.reduce((acc, track) => acc + track.duration, 0); 
            return album;
          } catch (error) {
            console.error('Erro ao buscar detalhes do álbum:', error);
            setError('Erro ao buscar detalhes do álbum');
            return { ...album, tracks: [], totalDuration: 0 };
          }
        }));
        setAlbums(albumsWithDetails);
      } catch (error) {
        console.error('Erro ao buscar álbuns:', error);
        setError('Erro ao buscar álbuns');
      }
    };

    fetchAlbums();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleAlbum = (albumId) => {
    setExpandedAlbum(expandedAlbum === albumId ? null : albumId);
  };

  const deleteAlbum = async (albumId) => {
    if (window.confirm('Tem certeza que deseja excluir este álbum?')) {
      try {
        await axios.delete(`http://localhost/api/albums/${albumId}`);
        setAlbums(albums.filter(album => album.id !== albumId));
      } catch (error) {
        console.error('Erro ao excluir álbum:', error);
        setError('Erro ao excluir álbum');
      }
    }
  };

  const deleteTrack = async (trackId, albumId) => {
    if (window.confirm('Tem certeza que deseja excluir esta música?')) {
      try {
        await axios.delete(`http://localhost/api/albums/${albumId}/tracks/${trackId}`);
        setAlbums(albums.map(album => {
          if (album.id === albumId) {
            return {
              ...album,
              tracks: album.tracks.filter(track => track.id !== trackId),
              totalDuration: album.tracks.reduce((acc, track) => track.id === trackId ? acc : acc + track.duration, 0) // Atualiza a duração total
            };
          }
          return album;
        }));
      } catch (error) {
        console.error('Erro ao excluir música:', error);
        setError('Erro ao excluir música');
      }
    }
  };

  const filteredAlbums = albums.filter(album => {
    const albumMatches = album.name.toLowerCase().includes(searchTerm.toLowerCase());
    const tracksMatch = album.tracks.some(track =>
      track.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return albumMatches || tracksMatch;
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Álbuns Cadastrados</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar por álbum ou música..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="list-group">
        {filteredAlbums.map((album) => (
          <div key={album.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>{album.name}</h5>
                <p>Artista: {album.singerName}</p>
              </div>
              <span>Duração Total: {album.totalDuration} min</span>
              <button
                className="btn btn-success"
                onClick={() => toggleAlbum(album.id)}
              >
                {expandedAlbum === album.id ? 'Mostrar Menos' : 'Mostrar Músicas'}
              </button>
              <button
                className="btn btn-danger btn-sm ml-2"
                onClick={() => deleteAlbum(album.id)}
              >
                Excluir Álbum
              </button>
            </div>
            {expandedAlbum === album.id && (
              <ul className="list-group mt-3">
                {album.tracks && album.tracks.length > 0 ? (
                  album.tracks.map((track) => (
                    <li key={track.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {track.name} - {track.duration} min
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteTrack(track.id, album.id)}
                      >
                        Excluir Música
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">Nenhuma música encontrada</li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlbumList;

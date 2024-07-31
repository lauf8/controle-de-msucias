
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AlbumForm() {
  const [album, setAlbum] = useState({ name: '', singer_id: '' });
  const [singers, setSingers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSingers = async () => {
      try {
        const response = await axios.get('http://localhost/api/singers');
        setSingers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Erro ao buscar cantores:', error);
      }
    };

    fetchSingers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlbum((prevAlbum) => ({ ...prevAlbum, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!album.name || !album.singer_id) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await axios.post('http://localhost/api/albums', album);
      console.log('Álbum adicionado com sucesso:', response.data);
      setAlbum({ name: '', singer_id: '' });
    } catch (error) {
      console.error('Erro ao adicionar álbum:', error);
      setError('Erro ao adicionar álbum');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="form-group">
        <label htmlFor="name">Nome do Álbum</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={album.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="singer_id">Cantor</label>
        <select
          className="form-control"
          id="singer_id"
          name="singer_id"
          value={album.singer_id}
          onChange={handleChange}
        >
          <option value="">Selecione um cantor</option>
          {singers.map((singer) => (
            <option key={singer.id} value={singer.id}>
              {singer.name}
            </option>
          ))}
        </select>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-primary">Adicionar Álbum</button>
    </form>
  );
}

export default AlbumForm;

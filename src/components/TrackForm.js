// src/components/TrackForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';

function TrackForm() {
  const [track, setTrack] = useState({ name: '', album_id: '', categories: [], duration: '' });
  const [categories, setCategories] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost/api/categories');
        const options = response.data.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setCategories(options);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost/api/albums');
        const options = response.data.map((album) => ({
          value: album.id,
          label: album.name,
        }));
        setAlbums(options);
      } catch (error) {
        console.error('Erro ao buscar álbuns:', error);
      }
    };

    fetchCategories();
    fetchAlbums();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrack((prevTrack) => ({ ...prevTrack, [name]: value }));
  };

  const handleCategoryChange = (newValue) => {
    setTrack((prevTrack) => ({ ...prevTrack, categories: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!track.name || !track.album_id || track.categories.length === 0 || !track.duration) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const trackData = {
      ...track,
      categories: track.categories.map((category) => category.value),
    };

    try {
      const response = await axios.post('http://localhost/api/tracks', trackData);
      console.log('Track adicionada com sucesso:', response.data);
      setTrack({ name: '', album_id: '', categories: [], duration: '' });
    } catch (error) {
      console.error('Erro ao adicionar track:', error);
      setError('Erro ao adicionar track');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="form-group">
        <label htmlFor="name">Nome da Track</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={track.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="album_id">Álbum</label>
        <select
          className="form-control"
          id="album_id"
          name="album_id"
          value={track.album_id}
          onChange={handleChange}
        >
          <option value="">Selecione um álbum</option>
          {albums.map((album) => (
            <option key={album.value} value={album.value}>
              {album.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="categories">Categorias</label>
        <CreatableSelect
          isMulti
          id="categories"
          name="categories"
          options={categories}
          value={track.categories}
          onChange={handleCategoryChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="duration">Duração</label>
        <input
          type="number"
          className="form-control"
          id="duration"
          name="duration"
          value={track.duration}
          onChange={handleChange}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-primary">Adicionar Track</button>
    </form>
  );
}

export default TrackForm;

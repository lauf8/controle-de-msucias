import React, { useState } from 'react';
import axios from 'axios';

function SingerForm() {
  const [singer, setSinger] = useState({ name: ''});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSinger((prevSinger) => ({ ...prevSinger, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!singer.name) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await axios.post('http://localhost/api/singers', singer);
      console.log('Cantor adicionado com sucesso:', response.data);
      setSinger({ name: '', });
    } catch (error) {
      console.error('Erro ao adicionar cantor:', error);
      setError('Erro ao adicionar cantor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="form-group">
        <label htmlFor="name">Nome do Cantor</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={singer.name}
          onChange={handleChange}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <br></br>
      <button type="submit" className="btn btn-primary">Adicionar Cantor</button>
    </form>
  );
}

export default SingerForm;

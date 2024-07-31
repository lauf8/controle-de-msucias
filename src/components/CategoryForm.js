// src/components/CategoryForm.js
import React, { useState } from 'react';
import axios from 'axios';

function CategoryForm() {
  const [category, setCategory] = useState({ name: '' });
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!category.name) {
      setError('O nome da categoria é obrigatório');
      return;
    }

    try {
      const response = await axios.post('http://localhost/api/categories', category);
      console.log('Categoria adicionada com sucesso:', response.data);
      setCategory({ name: '' });
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      setError('Erro ao adicionar categoria');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="form-group">
        <label htmlFor="name">Nome da Categoria</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={category.name}
          onChange={handleChange}
        />
      </div>
      <br></br>
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-primary">Adicionar Categoria</button>
    </form>
  );
}

export default CategoryForm;

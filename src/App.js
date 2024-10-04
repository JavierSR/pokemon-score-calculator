import React, { useState, useEffect } from "react";
import './App.css';  // Importa el archivo de estilos

// Función para calcular el puntaje (versión corregida)
const calcularPuntajePokemon = (naturaleza, habilidad, ivsTotales, ivsPrincipales) => {
  const naturalezaPuntajes = {
    ideal: 100,
    buena: 80,
    neutra: 50,
    perjudicial: 20,
  };

  const habilidadPuntajes = {
    ideal: 10,
    util: 6,
    inservible: 4,
  };

  const pesoIVsTotales = 0.35;
  const pesoIVsPrincipales = 0.65;W

  const puntajeNaturaleza = naturalezaPuntajes[naturaleza.toLowerCase()] || 0;
  const puntajeHabilidad = habilidadPuntajes[habilidad.toLowerCase()] || 1;

  const ivsTotalesMax = 155;
  const ivsPrincipalesMax = 62;

  const proporcionIVsTotales = Math.min(ivsTotales, ivsTotalesMax) / ivsTotalesMax;
  const proporcionIVsPrincipales = Math.min(ivsPrincipales, ivsPrincipalesMax) / ivsPrincipalesMax;

  const puntajeIVs = (pesoIVsTotales * proporcionIVsTotales) + (pesoIVsPrincipales * proporcionIVsPrincipales);

  const puntajeTotal = puntajeNaturaleza * (puntajeHabilidad / 15) * puntajeIVs;

  return Math.min(Math.round(puntajeTotal), 100);
};

const obtenerClaseTier = (ivs) => {
  if (ivs >= 130) {
    return 'epic'
  }

  if (ivs >= 100) {
    return 'gold'
  }

  if (ivs < 70) {
    return 'trash'
  }

  return ''
}

const obtenerClasePuntaje = (score) => {
  if (score >= 85) {
    return 'epic-score'
  }

  if (score >= 70) {
    return 'gold-score'
  }

  if (score < 20) {
    return 'trash-score'
  }

  return ''
}


const App = () => {
  const [pokemon, setPokemon] = useState({ nombre: "", naturaleza: "Ideal", habilidad: "Ideal", ivsTotales: 0, ivsPrincipales: 0, notas: "" });
  const [listaPokemon, setListaPokemon] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Cargar datos desde localStorage cuando se monta el componente
  useEffect(() => {
    const dataLocal = JSON.parse(localStorage.getItem("pokemon-calculator-list")) || [];
    setListaPokemon(dataLocal);
  }, []);

  // Guardar en localStorage cuando se actualiza listaPokemon
  useEffect(() => {
    localStorage.setItem("pokemon-calculator-list", JSON.stringify(listaPokemon));
  }, [listaPokemon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPokemon((prev) => ({ ...prev, [name]: value }));
  };

  const agregarPokemon = () => {
    const puntaje = calcularPuntajePokemon(pokemon.naturaleza, pokemon.habilidad, parseInt(pokemon.ivsTotales), parseInt(pokemon.ivsPrincipales));
    const nuevoPokemon = { ...pokemon, puntaje };
    setListaPokemon([...listaPokemon, nuevoPokemon]);
  };

  const eliminarPokemon = (nombre) => {
    const nuevaLista = listaPokemon.filter((poke) => poke.nombre !== nombre);
    setListaPokemon(nuevaLista);
  };

  const listaFiltrada = listaPokemon.filter((poke) => poke.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const ordenarPor = (campo) => {
    const listaOrdenada = [...listaPokemon].sort((a, b) => (a[campo] < b[campo] ? 1 : -1));
    setListaPokemon(listaOrdenada);
  };

  return (
    <div className="App">
      <h1>Calculadora de puntaje Pokémon</h1>
      <h6>Gallardo se lo come el tio</h6>
      {/* Formulario */}
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" value={pokemon.nombre} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="naturaleza">Naturaleza</label>
          <select id="naturaleza" name="naturaleza" value={pokemon.naturaleza} onChange={handleChange}>
            <option value="Ideal">Ideal</option>
            <option value="Buena">Buena</option>
            <option value="Neutra">Neutra</option>
            <option value="Perjudicial">Perjudicial</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="habilidad">Habilidad</label>
          <select id="habilidad" name="habilidad" value={pokemon.habilidad} onChange={handleChange}>
            <option value="Ideal">Ideal</option>
            <option value="Util">Útil</option>
            <option value="Inservible">Inservible</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ivsTotales">IVs Totales (Suma de los IVs de las 5 estadisticas Utiles del pokemon)</label>
          <input id="ivsTotales" type="number" name="ivsTotales" value={pokemon.ivsTotales} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="ivsPrincipales">IVs Principales (Suma de los IVs de las 2 estadisiticas principales)</label>
          <input id="ivsPrincipales" type="number" name="ivsPrincipales" value={pokemon.ivsPrincipales} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="notas">Notas</label>
          <input id="notas" name="notas" value={pokemon.notas} onChange={handleChange} />
        </div>

        <button onClick={agregarPokemon}>Calcular y Agregar</button>
      </div>

      {/* Buscador */}
      <input type="text" placeholder="Buscar Pokémon" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      {/* Tabla */}
      <table>
        <thead>
          <tr>
            <th onClick={() => ordenarPor("nombre")}>Nombre</th>
            <th onClick={() => ordenarPor("naturaleza")}>Naturaleza</th>
            <th onClick={() => ordenarPor("habilidad")}>Habilidad</th>
            <th onClick={() => ordenarPor("ivsTotales")}>IVs Totales</th>
            <th onClick={() => ordenarPor("ivsPrincipales")}>IVs Principales</th>
            <th onClick={() => ordenarPor("puntaje")}>Puntaje</th>
            <th>Notas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaFiltrada.map((poke, index) => (
            <tr key={index}>
              <td>{poke.nombre}</td>
              <td>{poke.naturaleza}</td>
              <td>{poke.habilidad}</td>
              <td className={obtenerClaseTier(poke.ivsTotales)}>{poke.ivsTotales}</td>
              <td>{poke.ivsPrincipales}</td>
              <td className={obtenerClasePuntaje(poke.puntaje)}>{poke.puntaje}%</td>
              <td>{poke.notas}</td>
              <td>
                <button className="eliminar" onClick={() => eliminarPokemon(poke.nombre)}>Eliminar</button>
                {poke.puntaje <= 16 && <div>Y RELEASE :)</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

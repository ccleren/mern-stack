import './App.css';
import { useState, useEffect } from "react";
import Axios from "axios";


function App() {

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [listOfInventario, setListOfInventario] = useState([]);

  const addInventario = () => {
    Axios.post("http://localhost:19283/addinventario", {
      name: name,
      amount: amount,
      description: description,
    })
      .then((response) => {
        alert("Inventario actualizado");
        setListOfInventario([...listOfInventario, { _id: response.data._id, name: name, amount: amount, description: description }]);
      })
      .catch(() => {
        alert("Algo ha salido mal :(");
      });
  };

  const updateInventario = (id) => {
    const newAmount = prompt("Introduce la cantidad actual: ");

    Axios.put("http://localhost:19283/update", {
      newAmount: newAmount,
      id: id
    })
      .then(() => {
        setListOfInventario(
          listOfInventario.map((val) => {
            return val._id == id
              ? { _id: id, name: val.name, amount: newAmount, description: description }
              : val;
          }))
      });
  };

  const deleteInventario = (id) => {
    Axios.delete(`http://localhost:19283/delete/${id}`).then(() => {
      setListOfInventario(
        listOfInventario.filter((val) => {
          return val._id != id;
        })
      );
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:19283/read")
      .then((response) => {
        setListOfInventario(response.data);
      })
      .catch(() => {
        console.log("ERROR");
      });
  }, []);

  return (
    <div className="App">
      <div className="inputs">
        <input
          type="text"
          placeholder="Nombre de la herramienta..."
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Cantidad..."
          onChange={(event) => {
            setAmount(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Descripcion..."
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
        <button onClick={addInventario}>Añadir al inventario</button>
      </div>
      <div className="tabla">
        <table className="listOfInventario" border="black 2px">
          <tr>
            <td><b>NOMBRE</b></td>
            <td><b>CANTIDAD</b></td>
            <td><b>DESCRIPCION</b></td>
          </tr>
          {listOfInventario.map((val) => {
            return (
              <tr className="inventario">
                <td>{val.name}</td>
                <td>{val.amount}</td>
                <td>{val.description}</td>
                <td><button className="Update" onClick={() => { updateInventario(val._id); }}>Actualizar</button></td>
                <td><button className="Erase" onClick={() => { deleteInventario(val._id); }}>X</button></td>
              </tr>
            );
          })}
        </table>
      </div>
    </div >
  );
}

export default App;

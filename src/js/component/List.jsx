import React, { useEffect, useState } from "react";



// // FUNCION PARA CREAR UN USUARIO//POST(SI ESPERA BODY)
// async function nuevoCliente() {
//     try {
//         const res = await fetch('', {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ name: '' })
//         });
//         const data = await res.json();
//         console.log(data);
//         return data;
//     } catch (error) {
//         console.log('Error al crear nuevo usuario', error);
//     }
// }


// // FUNCION PARA ELIMINAR UN USUARIO//DELETE(NO ESPERA BODY)

// async function eliminarCliente() {
//     try {
//         const res = await fetch('', {
//             method: "DELETE"
//         });
//         const data = await res.json();
//         console.log(data);
//         return data;
//     } catch (error) {
//         console.log('Error al eliminar cliente', error);
//     }
// }


// // FUNCION PARA LEER UN USUARIO
// async function leerCliente() {
//     try {
//         const resultado = await fetch('');
//         const data = await resultado.json();
//         console.log(data);
//         return data;
//     } catch (error) {
//         console.log('Error', error);
//         return null;
//     }
// }



// COMPONENTE 
const List = () => {
    const [inputValue, setInputValue] = useState("");
    const [todoList, setTodoList] = useState([]);


    const [estado, setEstado] = useState(false);
    const numTareas = todoList.length;


    // FUNCION ASINCRONA CREAR NUEVA TAREA 
    async function onSubmit(e) {
        e.preventDefault();
        await creartodoList(inputValue);
        setInputValue('');
        console.log("onSubmit");
    };




    // FUNCIONES PARA QUE APAREZCA O NO EL ELEMENTO
    function mauseEncimaElemento(index) {
        setEstado(index);
    }

    function mauseFueraElemento() {
        setEstado(false);
    }





    async function eliminarTarea(index) {
        const item = todoList[index];
        await eliminarCliente(item.id);
        const resultado = todoList.filter((_, i) => i !== index);
        todoList(resultado);
        console.log("onDelete");
    };






    async function creartodoList(item) {
        try {
            const res = await fetch('', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "label": item,
                    "value": false
                })
            });
            const data = await res.json();
            const nuevaLista = [...todoList, { id: data.id, label: item }];
            setTodoList(nuevaLista);
            console.log(data);
        } catch (error) {
            console.log('Error al crear TodoList', error);
        }
    }

    async function eliminarTodoList(id) {
        try {
            const res = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                throw new Error('Error al eliminar el TodoList');
            }
            await leerCliente();
        } catch (error) {
            console.log('Error ==> ', error);
        }
    }
    async function limpiarTodoList() {
        for (const item of todoList) {
            await eliminarTodoList(item.id);
        }
        setTodoList([]);
        eliminarCliente();
    }

    async function fetchData() {
        const data = await leerCliente();
        console.log(data);
        if (data && Array.isArray(data.todos)) {
            setTodoList(data.todos);
        } else {
            await nuevoCliente();
            const nuevaLista = await leerCliente();
            setTodoList(nuevaLista.todos);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);




















    return (
        <div className="container w-80 text-center">
            <label htmlFor="exampleInputEmail1" className="form-label"
                style={{ fontSize: "35px", paddingTop: "15px" }}>TodoList</label>
            <div className="container-flex lavenderBlush border myStyle">
                <form onSubmit={onSubmit}>
                    <div className="container-flex border-bottom p-1">
                        <input
                            onChange={(e) =>
                                setInputValue(e.target.value)} value={inputValue}
                            type="text"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setTodoList(todoList.concat(inputValue));
                                    setInputValue("");
                                }
                            }}
                            placeholder="Escribe una tarea a realizar">
                        </input>
                    </div>
                </form>

                <ul className="list-group list-group-flush">
                    {todoList.length === 0 ? (
                        <p className="text-center pt-3">No hay tareas</p>
                    ) : (
                        todoList.map((item, index) => (
                            <li
                                key={index}
                                className="list-group-item lavenderBlush d-flex justify-content-between align-items-center"
                                onMouseOver={() => mauseEncimaElemento(index)}
                                onMouseOut={() => mauseFueraElemento()}
                            >
                                {item.label}
                                {estado === index && (
                                    <button
                                        className="btn" onClick={() => eliminarTarea(index)}>
                                        <svg
                                            className="clear"
                                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                        </svg>
                                    </button>
                                )}
                            </li>
                        ))
                    )}
                </ul>
                <div className="pt-3 ps-2 border-top d-flex justify-content-around">
                    Tareas pendientes: {numTareas}
                    <button className="btn" onClick={limpiarTodoList}>Limpiar</button>
                </div>
            </div>
            <div style={{ height: "3px", borderRadius: "3px" }} className="lavenderBlush border mx-1"></div>
            <div style={{ height: "3px", borderRadius: "3px" }} className="lavenderBlush border mx-2"></div>
        </div>


    );
};

export default List;

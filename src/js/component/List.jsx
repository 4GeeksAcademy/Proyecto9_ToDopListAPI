import React, { useEffect, useState } from "react";



// FUNCION PARA CREAR UN USUARIO//POST(SI ESPERA BODY)
async function nuevaTarea() {
    try {
        const res = await fetch('https://playground.4geeks.com/todo/users/AlexTodoList', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'AlexTodoList' })
        });
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error al crear nuevo usuario', error);
    }
}


// FUNCION PARA ELIMINAR UN USUARIO//DELETE(NO ESPERA BODY)
async function eliminarTareaAPI(id) {
    try {
        await fetch(`https://playground.4geeks.com/todo/todos/${id}`, { method: "DELETE" });
        console.log("Tarea eliminada de la API");
    } catch (error) {
        console.log("Error al eliminar tarea de la API", error);
    }
}


// FUNCION PARA LEER UN USUARIO
async function leerTarea() {
    try {
        const resultado = await fetch('https://playground.4geeks.com/todo/users/AlexTodoList');
        const data = await resultado.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error', error);
        return null;
    }
}







// COMPONENTE 
const List = () => {
    const [inputValue, setInputValue] = useState(""); // Valor del input
    const [todoList, setTodoList] = useState([]);   // Lista de tareas
    const [estado, setEstado] = useState(false);     // Estado de los elementos (si se está pasando el mouse encima)
    
    
    const numTareas = todoList.length;


    // FUNCIONES PARA QUE APAREZCA O NO EL ELEMENTO
    function mauseEncimaElemento(index) {
        setEstado(index); // Muestra el botón de eliminar al pasar el mouse sobre un elemento
    }

    function mauseFueraElemento() {
        setEstado(false); // Oculta el botón de eliminar cuando el mouse sale del elemento
    }




    async function eliminarTareaLocal(index) {
        const item = todoList[index];
        await eliminarTareaAPI(item.id);  // Eliminar tarea desde la API
        const resultado = todoList.filter((_, i) => i !== index);  // Eliminar de la lista local
        setTodoList(resultado);  // Actualizar la lista local
        console.log("Tarea eliminada");
    }



    // FUNCION ASINCRONA CREAR NUEVA TAREA 
    async function onSubmit(e) {
        e.preventDefault();
        await creartodoList(inputValue); // Crea nueva tarea
         setInputValue(''); // Limpiar el input
        console.log("onSubmit");
    };






    async function creartodoList(item) {
        try {
            const res = await fetch('https://playground.4geeks.com/todo/todos', {  // URL correcta para tareas
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "label": item,  // Texto de la tarea
                    "value": false   // Estado de la tarea 
                })
            });

            const data = await res.json();
            const nuevaLista = [...todoList, { id: data.id, label: item }]; // Añade la nueva tarea a la lista
            setTodoList(nuevaLista);  // Actualiza el estado con la nueva lista
            console.log(data);
        } catch (error) {
            console.log('Error al crear TodoList', error);
        }
    }





    // Eliminar todas las tareas de la lista local
    async function limpiarTodoList() {
        for (const item of todoList) {
            await eliminarTareaAPI(item.id);  // Eliminar tarea en la API
        }
        setTodoList([]);  // Limpiar la lista local
    }



    // Eliminar todas las tareas de la lista
    async function limpiarTodoList() {
        for (const item of todoList) {
            await eliminarTareaLocal(item.id);  // Eliminar tarea de la API
        }
        setTodoList([]);  // Limpiar la lista local
    }





    // Función para obtener datos y manejar la creación del usuario
    async function fetchData() {
        const data = await leerTarea();  // Leer datos desde la API
        console.log(data);
        if (data && data.todos && Array.isArray(data.todos)) {
            setTodoList(data.todos);  // Si existe la propiedad 'todos' y es un arreglo, actualizar la lista
        } else {
            await nuevaTarea();  // Si no existe el usuario, crearlo
            const nuevaLista = await leerTarea();  // Leer las tareas de nuevo
            if (nuevaLista && nuevaLista.todos) {
                setTodoList(nuevaLista.todos);  // Establecer las tareas
            } else {
                setTodoList([]);  // Si no hay tareas, establecer lista vacía
            }
        }
    }


    useEffect(() => {
        fetchData();  // Llamar a fetchData al montar el componente
    }, []);  // Dependencias vacías para que solo se ejecute una vez






    return (
        <div className="container w-80 text-center">
            <label htmlFor="exampleInputEmail1" className="form-label"
                style={{ fontSize: "35px", paddingTop: "15px" }}>TodoList</label>
            <div className="container-flex lavenderBlush border myStyle">
                <form onSubmit={onSubmit}>
                    <div className="container-flex border-bottom p-1">
                        <input
                            onChange={(e) =>
                                setInputValue(e.target.value)} 
                            value={inputValue}
                            required
                            type="text"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && inputValue.trim() !== "") {
                                    // Verificar si la tarea ya existe en la lista
                                    // if (!todoList.some(task => task.label.toLowerCase() === inputValue.toLowerCase())) {
                                    //     setTodoList(todoList.concat({ label: inputValue, value: false }));
                                    //     setInputValue("");  // Limpiar el input
                                    const newValue = inputValue.trim()

                                    if (inputValue && newValue != "") {
                                         creartodoList(inputValue) 

                                    
                                    } else {
                                        alert("¡Esta tarea ya existe!");
                                    }
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
                                        className="btn" onClick={() => eliminarTareaLocal(index)}>
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

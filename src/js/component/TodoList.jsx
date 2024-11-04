import React from "react";

const TodoList = () => {



    return (
        <div className="TodoList">
            <div>
                <h1>Todo List</h1>
                <div className="input">
                    <span className="check"></span>
                </div>
                <input
                    type="text"
                    className="tarea"
                    onChange={e => setInputValue(e.target.value)} value={inputValue}
                    placeholder="Pon tu tarea aqui"
                    
                />
              
            </div>
        </div>
    );
};

export default TodoList;

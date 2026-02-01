import React, { useState } from 'react';
import styles from './TodoList.module.css';
import { ListTodo, Trash2 } from 'lucide-react';

interface Todo {
    text: string;
    done: boolean;
}

interface TodoListProps {
    todos?: Todo[];
    onUpdate: (todos: Todo[]) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos = [], onUpdate }) => {
    const [newItem, setNewItem] = useState('');

    const handleAdd = () => {
        if (newItem.trim()) {
            onUpdate([...todos, { text: newItem, done: false }]);
            setNewItem('');
        }
    };

    const handleToggle = (index: number) => {
        const newTodos = [...todos];
        newTodos[index].done = !newTodos[index].done;
        onUpdate(newTodos);
    };

    const handleDelete = (index: number) => {
        const newTodos = todos.filter((_, i) => i !== index);
        onUpdate(newTodos);
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <ListTodo size={20} />
                To-Do List
            </h3>

            <div className={styles.inputForm}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Add a new task..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button className={styles.addButton} onClick={handleAdd}>Add</button>
            </div>

            <div className={styles.list}>
                {todos.map((todo, index) => (
                    <div key={index} className={styles.todoItem}>
                        <input
                            type="checkbox"
                            className={styles.todoCheckbox}
                            checked={todo.done}
                            onChange={() => handleToggle(index)}
                        />
                        <span className={`${styles.todoText} ${todo.done ? styles.completed : ''}`}>
                            {todo.text}
                        </span>
                        <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(index)}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {todos.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-2">No tasks for today.</p>
                )}
            </div>
        </div>
    );
};

export default TodoList;

import { useEffect, useState } from "react"
import useServer from "../hooks/useServer.js"
import Todo from "../components/Todo.jsx"

function Todos() {
  const { get, post, delete: destroy } = useServer()
  const [todos, setTodos] = useState([])

  const getTodos = async() => {
    const { data } = await get({ url: '/todos' })
    setTodos(data)
  }

  const createTodoHandler = async (e) => {
    e.preventDefault()

    const todo = Object.fromEntries(new FormData(e.target))
    const { data } = await post({ url: '/todos', body: todo })

    setTodos([ ...todos, data ])
  }

  const deleteTodoHandler = async (id) => {
    const { data } = await destroy({ url: `/todos/${id}` })
    console.log(data)
    if (data.deleted) {
      const newList = todos.filter(todo => todo.id !== id)
      setTodos(newList)
    }
  }

  useEffect(() => {
    getTodos()
  }, [])

  return <>
    <h1>ToDos</h1>
    { todos && <ul>
      {todos.map(todo => <Todo key={todo.id} todo={todo} deleteTodo={deleteTodoHandler} />)}
    </ul> }

    <form onSubmit={createTodoHandler}>
      <input type="text" name="content" />
      <button type="submit">Crear Todo</button>
    </form>
  </>
}

export default Todos

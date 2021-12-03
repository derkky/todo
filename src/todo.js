const createTodo = (title, description, dueDate, priority) => {
	const todoTitle = title
	const todoDescription = description
	const todoDueDate = dueDate
	const todoPriority = priority
	const todoId = (Date.now() + Math.random()*100000).toString()
	var done = false

	const getTitle = () => todoTitle
	const getDescription = () => todoDescription
	const getDueDate = () => todoDueDate
	const getPriority = () => todoPriority
	const getId = () => todoId
	const toggleDone = () => {
		done = (done) ? false : true
	}
	const isDone = () => done


	return {getTitle, getDescription, getDueDate, getPriority, getId, toggleDone, isDone}
}

export {createTodo}

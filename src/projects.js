const createProject = (name) =>{
	var projName = name
	const todoList = []
	var selected = false

	const projId = Date.now().toString() + (Math.random()*1000000).toString()

	const getProjectName = () => projName

	const addTodo = (todo) => {
		todoList.push(todo)
	}

	const removeTodo = (todo) => {
		const index = todoList.indexOf(todo)
		todoList.splice(index, 1)
	}

	const setProjectName = (newName) =>{
		projName = newName
	}

	const getTodoList = () => todoList

	const getProjectId = () => projId

	const isSelected = () => selected

	const select = () => {
		selected = true
	}

	const deselect = () => {
		selected = false
	}

	return {getProjectName, addTodo, removeTodo, getTodoList, setProjectName, getProjectId, isSelected, select, deselect}
}


const projectList = (() =>{
	var list = []

	const addProject = (project) =>{
		list.push(project)
	}

	const removeProject = (project) =>{
		const index = list.indexOf(project)
		list.splice(index, 1)
	}

	const clearList = () => {
		var list = []
	}

	const getList = () => list

	return {getList, addProject, removeProject, clearList}
})()

export {createProject, projectList}
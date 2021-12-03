
import {createProject, projectList} from "./projects.js"
import {createTodo} from "./todo.js"


const content = document.getElementById("content")

// returns html element of a project
const createProjectElement = function(project){
	const projectName = project.getProjectName()

	const projectElement = document.createElement("div")

	if (project.isSelected()){
		projectElement.classList.add("projectSelected", "flexbox")
	} else{
		projectElement.classList.add("project", "flexbox")
	}


	const projectElementName = document.createElement("p")
	projectElementName.classList.add("projectName")
	projectElementName.contentEditable = "true"
	projectElementName.innerText = projectName

	projectElementName.onclick = function(){
		if (!e) var e = window.event
		e.cancelBubble = true
		if (e.stopPropagation) e.stopPropagation()
	}
	//updates name of project when the element is edited
	projectElementName.addEventListener("input", function(){
		project.setProjectName(projectElementName.innerText)
	})

	//ignores "enter" keypress
	projectElementName.addEventListener("keydown", function(ev){
		if (ev.keyCode == 13){
			ev.preventDefault()
		}
	})

	const projectElementDelete = document.createElement("p")
	projectElementDelete.classList.add("deleteProject")
	projectElementDelete.innerHTML = "&times;"
	projectElementDelete.onclick = () => {
		projectList.removeProject(project)
		const sidebar = document.getElementsByClassName("sidebar")[0]
		sidebar.remove()
		renderSidebar()

		// if project of current projectpage is deleted, then de-render the page
		const currentPage = document.getElementsByClassName("projectPage")[0]
		if (currentPage.dataset.projectId == project.getProjectId()){
			currentPage.innerHTML = ""
		}

		//stop event propagation 
		if (!e) var e = window.event
		e.cancelBubble = true
		if (e.stopPropagation) e.stopPropagation()
	}

	projectElement.appendChild(projectElementName)
	projectElement.appendChild(projectElementDelete)

	projectElement.onclick = function(){
		// marks project as "selected" to be rendered with the appropriate class
		const sidebar = document.getElementsByClassName("sidebar")[0]
		sidebar.remove()
		//deselect all projects and only select own project
		const currentProjects = document.getElementsByClassName("project")
		for (var currentProject of projectList.getList()){
			currentProject.deselect()
		}
		project.select()
		renderSidebar()
		//removes current page and renders clicked page
		const currentPage = document.getElementsByClassName("projectPage")[0]
		currentPage.remove()
		renderProjectPage(project)
	}
	
	return projectElement
}



const renderSidebar = () =>{
	const sidebar = document.createElement("div")
	sidebar.classList.add("sidebar", "flexbox")

	const sidebarHeader = document.createElement("h1")
	sidebarHeader.innerText = "PROJECTS"
	sidebarHeader.classList.add("sidebarHeader")
	sidebar.appendChild(sidebarHeader)

	for (var project of projectList.getList()){
			const projectElement = createProjectElement(project)
			sidebar.appendChild(projectElement)
	}


	const addProjectButton = document.createElement("button")
	addProjectButton.innerText = "Add Project"
	addProjectButton.classList.add("addProject")
	addProjectButton.onclick = () => {
		const newProject = createProject("New Project")
		projectList.addProject(newProject)
		sidebar.remove()
		renderSidebar()
	}

	sidebar.appendChild(addProjectButton)

	content.appendChild(sidebar)

} 

const createModal = function(project){
	const modal = document.createElement("div")
	modal.classList.add("modal")

	const modalContent = document.createElement("form")
	modalContent.classList.add("modalContent")

	const closeButtonBox = document.createElement("div")
	closeButtonBox.classList.add("flexbox", "modalCloseButtonBox")
	const closeButton = document.createElement("div")
	closeButton.classList.add("modalCloseButton")
	closeButton.innerHTML = "&times;"
	closeButton.onclick = () => {
		modal.style.display= "none"
	}
	closeButtonBox.appendChild(closeButton)

	const inputContainer = document.createElement("div")
	inputContainer.classList.add("inputContainer", "flexbox")

	const createInput = function(name){
		const input = document.createElement("div")
		input.classList.add("input" , "flexbox")

		const inputElement = document.createElement("input")
		inputElement.classList.add("inputElement")
		inputElement.name = name
		inputElement.required = "true"

		const inputLabel = document.createElement("label")
		inputLabel.for = name
		inputLabel.innerText = name

		input.appendChild(inputLabel)
		input.appendChild(inputElement)

		return input

	}

	const createDateInput = function(name){
		const input = document.createElement("div")
		input.classList.add("input" , "flexbox")

		const inputElement = document.createElement("input")
		inputElement.classList.add("inputElement")
		inputElement.type = "datetime-local"
		inputElement.name = name

		const inputLabel = document.createElement("label")
		inputLabel.for = name
		inputLabel.innerText = name

		input.appendChild(inputLabel)
		input.appendChild(inputElement)

		return input
	}

	const createMessageBox = function(name){
		const messageBox = document.createElement("textarea")
		messageBox.classList.add("messageBox")
		messageBox.name = name

		const messageLabel = document.createElement("label")
		messageLabel.for = name
		messageLabel.innerText = name

		const messageBoxInput = document.createElement("div")
		messageBoxInput.classList.add("flexbox", "input")

		messageBoxInput.appendChild(messageLabel)
		messageBoxInput.appendChild(messageBox)

		return messageBoxInput

	}

	const submitButton = document.createElement("input")
	submitButton.type = "submit"
	submitButton.classList.add("submitButton")

	modalContent.onsubmit = function(ev){
		ev.preventDefault()

		const todoTitle = document.getElementsByName("Title")[0].value
		const todoDescription = document.getElementsByName("Description")[0].value
		const todoDueDate = document.getElementsByName("Due Date")[0].value

		const todo = createTodo(
			todoTitle,
			todoDescription,
			todoDueDate)

		project.addTodo(todo)

		const currentPage = document.getElementsByClassName("projectPage")[0]
		currentPage.remove()
		renderProjectPage(project)
	}

	inputContainer.appendChild(createInput("Title"))
	inputContainer.appendChild(createDateInput("Due Date"))
	inputContainer.appendChild(createMessageBox("Description"))
	inputContainer.appendChild(submitButton)

	modalContent.appendChild(inputContainer)
	modalContent.appendChild(closeButtonBox)
	modal.appendChild(modalContent)

	return modal
}

const createTodoElement = (todo) => {
	const todoElement = document.createElement("div")
	//add logic here to check if checkbox ticked, give todo if unticked or todochecked if ticked
	if (todo.isDone()){
		todoElement.classList.add("todoChecked")
	} else {
		todoElement.classList.add("todo")
	}

	todoElement.setAttribute("name", "todo")
	todoElement.dataset.todoId = todo.getId()

	const todoName = document.createElement("div")
	todoName.classList.add("todoName", "flexbox")
	todoName.innerText = todo.getTitle()
	todoElement.appendChild(todoName)

	const todoDescription = document.createElement("div")
	todoDescription.classList.add("todoDescription", "flexbox")
	todoDescription.innerText = todo.getDescription()
	todoElement.appendChild(todoDescription)

	const todoDueDate = document.createElement("div")
	todoDueDate.classList.add("todoDueDate", "flexbox")
	todoDueDate.innerText = todo.getDueDate()
	todoElement.appendChild(todoDueDate)

	const todoCheckContainer = document.createElement("div")
	todoCheckContainer.classList.add("todoCheckContainer", "flexbox")
	const todoCheck = document.createElement("input")
	todoCheck.classList.add("todoCheck")
	todoCheck.type = "checkbox"
	todoCheck.checked = (todo.isDone()) ? true : false; //renders box checked if its already done
	todoCheck.onclick = function(){
		const currentTodos = document.getElementsByName("todo")

		for (var currentTodo of currentTodos) {
			if (currentTodo.dataset.todoId == todo.getId()) {
				for (var project of projectList.getList()){
					if (currentTodo.dataset.projectId == project.getProjectId()){
						// if checked, change to "checked state", else revert
						if (todoCheck.checked){
							todo.toggleDone()
							todoElement.classList.remove("todo")
							todoElement.classList.add("todoChecked")
						} else {
							todo.toggleDone()
							todoElement.classList.remove("todoChecked")
							todoElement.classList.add("todo")
						}
					}
				}
			}
		}
	}
	todoCheckContainer.appendChild(todoCheck)
	todoElement.appendChild(todoCheckContainer)

	const todoDelete = document.createElement("div")
	todoDelete.classList.add("todoDelete", "flexbox")
	const deleteIcon = document.createElement("i")
	deleteIcon.classList.add("fa", "fa-trash", "fa-lg", "deleteIcon")
	deleteIcon.onclick = function(){
		const currentTodos = document.getElementsByName("todo")

		//remove todo from page and its corresponding project list
		for (var currentTodo of currentTodos) {
			if (currentTodo.dataset.todoId == todo.getId()) {
				for (var project of projectList.getList()){
					if (currentTodo.dataset.projectId == project.getProjectId()){
						//console.log("removed from project list")
						project.removeTodo(currentTodo)
						currentTodo.remove()
					}
				}
				//console.log("removed")
			}
		}
	}
	todoDelete.appendChild(deleteIcon)
	todoElement.appendChild(todoDelete)

	const todoSep = document.createElement("hr")
	todoSep.classList.add("todoSep")
	todoElement.appendChild(todoSep)

    return todoElement
}


const renderProjectPage = function(project){

	const projectPage = document.createElement("div")
	projectPage.classList.add("flexbox", "projectPage")

	projectPage.dataset.projectId = `${project.getProjectId()}`

	const projectPageHeader = document.createElement("h1")
	projectPageHeader.classList.add("projectPageHeader")
	projectPageHeader.innerText = "TO-DO"
	projectPage.appendChild(projectPageHeader)

	for (var todo of project.getTodoList()){
		const todoElement = createTodoElement(todo)
		todoElement.dataset.projectId = project.getProjectId()
		projectPage.appendChild(todoElement)
	} 

	const modal = createModal(project)
	const addTodoButton = document.createElement("button")
	addTodoButton.classList.add("addTodo")
	addTodoButton.innerText = "Add To-Do"
	addTodoButton.onclick = function(){
		modal.style.display = "block"
	}

	projectPage.appendChild(modal)
	projectPage.appendChild(addTodoButton)

	content.appendChild(projectPage)

}

const renderHeader = function(){
	const header = document.createElement("div")
	header.classList.add("header", "flexbox")
	const name = document.createElement("h1")
	name.classList.add("name")
	name.innerText = "To-Don"
	
	header.appendChild(name)

	content.appendChild(header)

}

const renderFooter = function(){
	const footer = document.createElement("div")
	footer.classList.add("footer", "flexbox")
	footer.innerText = "Designed by Don Foh"

	content.appendChild(footer)
}



export {renderSidebar, renderProjectPage, renderHeader, renderFooter} 
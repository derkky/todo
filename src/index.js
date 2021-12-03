import {createTodo} from "./todo.js"
import {createProject, projectList} from "./projects.js"
import {renderSidebar, renderProjectPage, renderHeader, renderFooter} from "./domStuff.js"

//Initialize project list with default projects inside

const defaultProject = createProject("Default")
defaultProject.select()
projectList.addProject(defaultProject)


renderHeader()
renderFooter()
renderSidebar(projectList)

renderProjectPage(defaultProject)






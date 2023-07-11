
Todo List CLI Application

This is a command-line interface (CLI) application for managing a todo list. It provides a simple and convenient way to add, update, and remove todo items directly from your terminal.

Features
Add new todo items with a title.
Mark todo items as completed or pending.
Delete todo items.
List all todo items or filter by status (done, pending).
Installation
Clone the repository:
git clone https://github.com/your-username/todo-list-cli.git

Navigate to the project directory:
cd todo-list-cli

Install the dependencies:
npm install
Set up your PostgreSQL database and update the database configuration in db.js file.

Run the application:
node app.js --help

Usage
The application supports the following commands:

add: Add a new todo item.
Options:
--title: Title of the todo item (required).

list [status]: List todo items.
Options:
status: Filter by status (all, completed, pending). Default is all.

done [id]: Mark a todo item as completed.
Options:
id: ID of the todo item to mark as completed.

delete [id]: Delete a todo item.
Options:
id: ID of the todo item to delete.
help: Display help information about the commands.

version: Display the version of the application.

Examples

Add a new todo item:
node app.js add --title "Buy groceries"

List all todo items:
node app.js list

List only completed todo items:
node app.js list done

Mark a todo item as completed:
node app.js done 1

Delete a todo item:
node app.js delete 1

License
This project is licensed under the MIT License. See the LICENSE file for more information.

Feel free to contribute and enhance this todo list CLI application. Happy organizing your todos!

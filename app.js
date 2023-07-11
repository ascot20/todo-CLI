const yargs = require('yargs');
const pool = require('./db');

yargs
    .command({
        command: 'new',
        describe: 'Add new todo item',
        builder: {
            title: {
                describe: 'Title of the todo item',
                demandOption: true,
                type: 'string'
            }
        },
        handler: async (argv)=>{
            const {title} = argv;

            try {
                //Connect to the Postgres database
                const client = await pool.connect();

                //Insert the todo item into the database
                const query = 'INSERT INTO todos(title,completed) VALUES ($1,$2)'
                const values = [title,false]
                await client.query(query, values)

                //Release the database connection
                client.release()

                //Print success message
                console.log('Adding new todo item...')
                console.log('Title:', argv.title)
            } catch (error) {
                console.error('Error adding todo item: ', error)
            }
        }
    })
    .command({
        command: 'list [status]',
        describe: 'List todo items',
        builder: {
            status: {
                describe: 'Filer by status (all, pending, done)',
                choices: ['all', 'pending', 'done'],
                default: 'all',
                type: 'string'
            }
        },
        handler: async(argv)=>{
            const {status} = argv;

            try {
                //Connect to Postgres database
                const client = await pool.connect();

                let query = 'SELECT * FROM todos';
                let values = [];

                //Filter the query based on the status
                if(status ==='done'){
                    query += ' WHERE completed = true'
                }
                else if(status === 'pending'){
                    query += ' WHERE completed = false'
                }

                //Execute the query
                const result = await client.query(query,values)

                //Release the database connection
                client.release();

                //Print the list of todo items
                console.log('Listing Todo items with status: ',status)
                result.rows.forEach((row)=>{
                    console.log(`- ${row.id}.${row.title} [${row.completed?'✅':'❌'}]`);
                })
            } catch (error) {
                console.error('Error listing todo items: ',error)
            }
        }
    })
    .command({
        command: 'done [id]',
        describe: 'Mark todo item as completed',
        builder: {
            id: {
                describe: 'Id of todo item',
                demandOption: true,
                type: 'number',
            }
        },
        handler:async(argv)=>{
            const {id} = argv;

            try {
                //Connect to the Postgres database
                const client = await pool.connect();

                //Check if the todo item exists
                const checkQuery = 'SELECT * FROM todos WHERE id = $1';
                const checkResult = await client.query(checkQuery,[id]);
                if(checkResult.rows.length === 0){
                    console.log(`Todo item with ID ${id} does not exist`);
                    return;
                }

                //Mark the todo item as done
                const updateQuery = 'UPDATE todos SET completed = true WHERE id = $1';
                await client.query(updateQuery,[id])

                //Release the database connection
                client.release();

                console.log(`Todo item with ID ${id} has been marked as done`);
            } catch (error) {
                console.error('Error marking item as done',error);
            }
        }
    })
    .command({
        command:'delete [id]',
        describe: 'Delete a todo item',
        builder: {
            id: {
                describe:'ID of the todo item',
                demandOption: true,
                type: 'number'
            }
        },
        handler: async (argv)=>{
            const {id} = argv;

            try {
                //Connect to Postgres Databse
                const client = await pool.connect();
    
                //Check if todo item exists
                const checkQuery = 'SELECT * FROM todos WHERE id = $1';
                const checkResult = await client.query(checkQuery,[id]);
                if(checkResult.rows.length === 0){
                    console.log(`Todo item with ID ${id} does not exist`)
                    return;
                }
    
                //Delete todo item
                const deleteQuery = 'DELETE FROM todos WHERE id = $1';
                await client.query(deleteQuery,[id]);
    
                //Release the database connection
                client.release();
    
                console.log(`Todo item with ID ${id} has been deleted`)
                
            } catch (error) {
                console.error(`Error deleting todo item`, error)
            }
        }
    })
    .help()
    .version()
    .argv;
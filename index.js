const fs = require('fs');
const path = require('path');



class Database {
  constructor(databaseName, username, password) {
    this.databaseName = databaseName;
    this.databasePath = path.join(__dirname, databaseName);
    this.username = username;
    this.password = password;
    
  }

  authenticate(username, password) {
    return username === this.username && password === this.password;
  }

  createTable(tableName, schema, username, password) {
    if (!this.authenticate(username, password)) {
      throw new Error('Authentication failed');
    }

    const tablePath = path.join(this.databasePath, `${tableName}.json`);

    if (fs.existsSync(tablePath)) {
      throw new Error(`Table ${tableName} already exists`);
    }

    const columns = schema.reduce((acc, column) => {
      acc[column] = null;
      return acc;
    }, {});

    const data = { columns, rows: [] };
    fs.writeFileSync(tablePath, JSON.stringify(data));
  }

  insert(tableName, row, username, password) {
    if (!this.authenticate(username, password)) {
      throw new Error('Authentication failed');
    }

    const tablePath = path.join(this.databasePath, `${tableName}.json`);

    if (!fs.existsSync(tablePath)) {
      throw new Error(`Table ${tableName} does not exist`);
    }

    const tableData = JSON.parse(fs.readFileSync(tablePath));

    const newRow = Object.keys(tableData.columns).reduce((acc, column) => {
      if (column in row) {
        acc[column] = row[column];
      } else {
        acc[column] = null;
      }
      return acc;
    }, {});

    tableData.rows.push(newRow);
    fs.writeFileSync(tablePath, JSON.stringify(tableData));
  }

  select(tableName, condition, username, password) {
    if (!this.authenticate(username, password)) {
      throw new Error('Authentication failed');
    }

    const tablePath = path.join(this.databasePath, `${tableName}.json`);

    if (!fs.existsSync(tablePath)) {
      throw new Error(`Table ${tableName} does not exist`);
    }

    const tableData = JSON.parse(fs.readFileSync(tablePath));

    const filteredRows = tableData.rows.filter(condition);

    return filteredRows;
  }

  update(tableName, condition, updateValues, username, password) {
    if (!this.authenticate(username, password)) {
      throw new Error('Authentication failed');
    }

    const tablePath = path.join(this.databasePath, `${tableName}.json`);

    if (!fs.existsSync(tablePath)) {
      throw new Error(`Table ${tableName} does not exist`);
    }

    const tableData = JSON.parse(fs.readFileSync(tablePath));

    tableData.rows.forEach(row => {
      if (condition(row)) {
        Object.keys(updateValues).forEach(key => {
          row[key] = updateValues[key];
        });
      }
    });

    fs.writeFileSync(tablePath, JSON.stringify(tableData));
  }

  delete(tableName, condition, username, password) {
    if (!this.authenticate(username, password)) {
      throw new Error('Authentication failed');
    }

    const tablePath = path.join(this.databasePath,`${tableName}.json`);

    if (!fs.existsSync(tablePath)) {
      throw new Error(`Table ${tableName} does not exist`);
    }

    const tableData = JSON.parse(fs.readFileSync(tablePath));

    const filteredRows = tableData.rows.filter(row => !condition(row));

    tableData.rows = filteredRows;
    fs.writeFileSync(tablePath, JSON.stringify(tableData));
  }

  getarr(obj){
      console.log(obj);
      
  }

  createrelation(Dbname,unique_key){
    const array = {}
    
      const readdir = fs.readdirSync(Dbname)
      readdir.map(files => {
          const location = path.join(Dbname,files)
          const read = JSON.parse(fs.readFileSync(location))
          read.rows.forEach(row =>{
            if (row.phonenumber === unique_key) {
              // array.push(row)
                Object.assign(array,row)
            }
         })
          
      })
      // console.log(array['0']);
      // console.log(array['1']);

      // console.log((Object.keys(array)));
      // for (let i = 0; i < array.length; i++) {
      //     return array[i]
      // }

      return(array)
    
  }
}



const db = new Database('mydatabase', 'admin', 'password');

const relationship = db.createrelation('mydatabase',9876543210)
console.log(relationship.name);








// Create a new table called 'users' with two columns: 'name' and 'age'
// db.createTable('orders', ['pl','phonenumber','prodid'], 'admin', 'password');

// Insert some rows into the 'users' table
// db.insert('users', {name : 'shashank', email : "shashank.BR", phonenumber : 9876543210,email : "sha@gmail.com"}, 'admin', 'password');
// db.insert('orders', { pl: 267890465, phonenumber : 9876543210, prodid : 56}, 'admin', 'password');
// db.insert('users', { name: 'Charlie'  }, 'admin', 'password'); // 'age' will be null for this row

// Select all rows from the 'users' table
// const allUsers = db.select('customers', (row) => row.phonenumber === 908867342 , 'admin', 'password');
// console.log(allUsers);

// // Select only rows where the 'age' column is greater than 35
// const usersOver35 = db.select('users', row => row.age > 35, 'admin', 'password');
// console.log(usersOver35);

// // Update the 'age' of all rows where the 'name' is 'Bob'
// db.update('customers', row => row.phonenumber === 908867342, { name : "shashank.BR" }, 'admin', 'password');

// // Delete all rows where the 'name' is 'Charlie'
// db.delete('users', row => row.name === 'Charlie', 'admin', 'password');
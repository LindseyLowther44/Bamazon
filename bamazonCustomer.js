var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table3");
    
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Kmj98432!",
    database: "bamazon_db"
    });

    connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
    });    

    var start = function(){
        inquirer.prompt([{
            type: "confirm",
            name: "confirm",
            message: "Welcome to Bamazon! Would you like to checkout our inventory?",
            default: true
        }]).then(function(user) {
            if(user.confirm === true) {
                inventory();
            } else {
                console.log("Sorry we werent able to help you, Please come again soon!")
            }
        });
    }
    
    var inventory = function() {
        var table  = new Table ({
            head: ['id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 30, 30, 30, 30]
        });
        showInventory();

        function showInventory() {
            connection.query("SELECT * FROM products", function(err, res){
                for (var i = 0; i < res.length; i++){

                    var id = res[i].id,
                        name = res[i].product_name,
                        department = res[i].department_name,
                        price = res[i].price,
                        qty = res[i].stock_quantity;

                    table.push(
                        [id, name, department, price, qty]
                    );

                }
                console.log(`\n
                \n==================INVENTORY===================
                \n
                \n
                `);
                console.log(table.toString());

                continueP();
            });
        }
        
    }
    
    
    
    var continueP = function (){
        inquirer.prompt ([{

                type: 'confirm',
                name: 'continue',
                message: 'Are you interested in purchasing an item from our inventory?',
                default: true
        }]).then(function(user) {
            if(user.continue === true) {
                selectionP();
            } else {
                console.log('Sorry to hear that! Come back again soon!!')
            }
        });
    }
    
var selectionP = function () {
        
        inquirer.prompt([{

            type: "input",
            name: "item",
            message: "Please enter in the ID number of the product you would like to purchase!"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many of this item would you like to purchase?"
        }
    ]).then(function(userChoice) {
        connection.query("SELECT * FROM products WHERE id=?", userChoice.item, function(err, res) {
            if (err) throw err;
            for(var i = 0; i < res.length; i++) {
                if (userChoice.quantity > res[i].stock_quantity) {
                    console.log(`\n
                                \nSorry, Limited Stock, Please try again later!
                                \n`)
                                startPrompt();
                } else {
                    console.log(`\n
                                \nGreat, we can complete this order!
                                \n`)
                    console.log("You have selected: " + res[i].product_name);
                    console.log("Department: " + res[i].department_name);
                    console.log("Price: " + res[i].price);
                    console.log("Quantity: " + userChoice.quantity);
                    console.log("Total: " + res[i].price * userChoice.quantity);

                    var newINV = (res[i].stock_quantity - userChoice.quantity);
                    var pID = (userChoice.quantity);
                    confirmP(newINV, pID);
                }
            }
        });
    });
}

var confirmP = function(newINV, pID) {
    inquirer.prompt([{
        type: "confirm",
        name: "confirmation",
        message: "Are you sure You would like to purchase this item?",
        default: true
    }]).then(function(userChoice) {
        if(userChoice.confirmation === true) {
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newINV
            }, {
                id: pID
            }], function(err, res) {
                if (err) throw err;
            });

            console.log("=================================");
            console.log("Transaction completed. Thank you.");
            console.log("=================================");
            start();
        } else {
            console.log("=================================");
            console.log("No worries. Maybe next time!");
            console.log("=================================");
            start();
        }
    });
}
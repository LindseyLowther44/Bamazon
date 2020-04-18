var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table3");

// connect to mysql localhost

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
});

var display = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(`==================================
                    \n        WELCOME TO BAMAZON
                    \n==================================
                    \n
                    \nBelow are our objects for sale!`);
        
        var table = new Table({
            head: ["Id", "Product Name", "Department Name", "Price", "Quantity"],
            colWidths: [5, 20, 15, 10, 10],
            colAligns: ["center"],
            style: {
            head: ["aqua"],
            compact: false
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log("");
        shopping();
        }); 
    };

var userShop = function() {
    inquirer
    .prompt({
        name: "productToBuy",
        type: "input",
        message: "Please select the product you would like by entering the ID!"
    })
    .then(function(userChoice1) {
        var userSelection = userChoice1.productToBuy;
        connection.query("SELECT * FROM products WHERE Id=?", userSelection, function(
        err,
        res
        ) {
        if (err) throw err;
        if (res.length === 0) {
            console.log(
            "There"
            );

            userShop();
        } else {
            inquirer
            .prompt({
                name: "quantity",
                type: "input",
                message: "How many items would you like to purchase?"
            })
            .then(function(userChoice2) {
                var quantity = answer2.quantity;
                if (quantity > res[0].stock_quantity) {
                console.log(
                    "Our Apologies we only have " +
                    res[0].stock_quantity +
                    " items of the product selected"
                );
                userShop();
                } else {
                console.log("");
                console.log(res[0].product_name + " purchased");
                console.log(quantity + " qty @ $" + res[0].price);
                var newQuantity = res[0].stock_quantity - quantity;
                connection.query(
                    "UPDATE products SET stock_quantity = " +
                    newQuantity +
                    " WHERE id = " +
                    res[0].id,
                    function(err, resUpdate) {
                    if (err) throw err;
                    console.log(`
                                \nYour order is complete, Thank you for shooping with us
                                \n
                                `)
                    connection.end();
                    }
                );
                }
            });
        }
        });
    });
};
    
    display();
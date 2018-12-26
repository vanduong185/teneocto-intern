var express = require("express");
var bodyParser = require('body-parser');
var db = require('./db');
var fdb = require('./firestore_db');
var formidable = require("formidable");
var fsex = require("fs-extra");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/product", function (req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    new_product = fields;
    query_str = "INSERT INTO products (name, description, price, category_id) VALUES ?";
    values = [
      [new_product.name, new_product.desc, new_product.price, new_product.category]
    ];
    db.query(query_str, [values], function (err, result) {
      if (err) {
        console.log(err)
        res.status(200).json({
          message: "Error"
        })
      }
      else {
        product_id = result.insertId;

        if (files.image.size > 0) {
          new_path = "./assets/images/" + product_id + "/" + files.image.name;
          fsex.moveSync(files.image.path, new_path);
          query_str = "INSERT INTO images (path, product_id) VALUES ?";
          values = [
            [new_path, product_id]
          ];
          db.query(query_str, [values], function (err, result) {
            if (err) {
              console.log(err)
              res.status(200).json({
                message: "Error"
              })
            }
            else {
              res.status(200).json({
                message: "Success"
              })
            }
          })
        }
      }
    })
  })
})

app.put("/product", function (req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    update_product = fields;

    query_str = "UPDATE products SET name = ?, description = ?, price = ?, category_id = ? WHERE id = ?";
    values = [update_product.name, update_product.desc, update_product.price, update_product.category, update_product.id]
    db.query(query_str, values, function (err, result) {
      if (err) {
        console.log(err)
        res.status(200).json({
          message: "Error"
        })
      }
      else {
        if (files.image && files.image.size > 0) {
          new_path = "./assets/images/" + update_product.id + "/" + files.image.name;
          if (!fsex.existsSync(new_path)) {
            fsex.moveSync(files.image.path, new_path);
            query_str = "UPDATE images SET path = ? WHERE product_id = ?";
            db.query(query_str, [new_path, update_product.id], function (err, result) {
              if (err) {
                console.log(err)
                res.status(200).json({
                  message: "Error"
                })
              }
            })
          }
        }
        res.status(200).json({
          message: "Success"
        })
      }
    })
  })
})

app.delete("/product", function (req, res) {
  product = req.body;

  query_str = "DELETE FROM products WHERE id = ?";
  db.query(query_str, [product.id], function(err, result) {
    if (err) {
      console.log(err)
      res.status(200).json({
        message: "Error"
      })
    }
    else {
      fsex.remove("./assets/images/" + product.id, function(err) {
        if (err) {
          console.log(err)
          res.status(200).json({
            message: "Error"
          })
        }
        else {
          res.status(200).json({
            message: "Success"
          })
        }
      })
    }
  })
})

app.get("/products", function (req, res) {
  query_str = "SELECT p.id, p.name, p.description, p.price, i.path as image, c.name as category " +
    "FROM products p JOIN images i ON i.product_id = p.id JOIN categories c ON c.id = p.category_id";

  db.query(query_str, function (err, products) {
    if (err) {
      console.log(err)
      res.status(200).json({
        message: "Error"
      })
    }
    else {
      res.status(200).json({
        message: "Success",
        data: {
          products: products
        }
      })
    }
  })
})

// app.get("/fsproducts", function (req, res) {
//   fdb.collection("products").get().then(function(result) {
//     products = [];
//     result.docs.forEach(doc => {
//       products.push(doc.data())
//     });
//     console.log(products);
//   fdb.collection("products").doc

//   fsb
// })

app.listen(8000, function () {
  console.log('App listening on port 8000!');
});

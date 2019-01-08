db.collection("products").onSnapshot(snap => {
  let changes = snap.docChanges();
  changes.forEach(change => {
    if (change.type == "added") {
      let product = change.doc.data();
      product.id = change.doc.id;
      product.isEditing = false;
      product.isDeleting = false;
      product.image_file = null;
      product.category = product.category.id;
      app.products.push(product)
    }
    else if (change.type == "removed") {
      for (var i = 0; i < app.products.length; i++) {
        if (app.products[i].id == change.doc.id) {
          app.products.splice(i, 1);
        }
      }
    }
    else if (change.type == "modified") {
      for (var i = 0; i < app.products.length; i++) {
        if (app.products[i].id == change.doc.id) {
          app.products[i].name = change.doc.data().name;
          app.products[i].description = change.doc.data().description;
          app.products[i].price = change.doc.data().price;
          app.products[i].image = change.doc.data().image;
          app.products[i].category = change.doc.data().category.id;
        }
      }
    }
  })
})

var app = new Vue({
  el: "#app",
  data: {
    products: [],
    new_product: {
      name: "",
      description: "",
      category: "zXysLStjivQBlYbYidk0",
      price: "",
      image: ""
    },
    file_image: "",
    categories: {
      "Laptop": "zXysLStjivQBlYbYidk0",
      "Phone": "nDUFVMG5MJa9nkY8FT89",
      "Tablet": "GN3rVzTpOVJd7Be5ScsW",
      "Accessory": "u1DT5MfxIU6v1eMdBTTf"
    },
    categories_inv: {
      "zXysLStjivQBlYbYidk0": "Laptop",
      "nDUFVMG5MJa9nkY8FT89": "Phone",
      "GN3rVzTpOVJd7Be5ScsW": "Tablet",
      "u1DT5MfxIU6v1eMdBTTf": "Accessory"
    }
  },
  methods: {
    createProduct: function () {
      var vm = this;
      vm.new_product.category = db.doc("/categories/" + vm.new_product.category)
      db.collection("products").add(vm.new_product).then(doc => {
        var productRef = storageRef.child("products/" + doc.id + "/" + vm.file_image.name);
        productRef.put(vm.file_image).then(snap => {
          storageRef.child(snap.metadata.fullPath).getDownloadURL().then(function (url) {
            db.collection("products").doc(doc.id).update({
              image: url
            }).then(snap => {
              vm.new_product = {
                name: "",
                description: "",
                category: "zXysLStjivQBlYbYidk0",
                price: "",
                image: ""
              }
              vm.$refs.file.value = null;
            })
          })
        })

      })
    },
    updateProduct: function (product) {
      let update_product = {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: db.doc("/categories/" + product.category)
      }

      vm = this;

      if (product.image_file) {
        var productsRef = storageRef.child("products/" + product.id + "/" + product.image_file.name);
        productsRef.put(product.image_file).then(snap => {
          storageRef.child(snap.metadata.fullPath).getDownloadURL().then(function (url) {
            update_product.image = url;
            db.collection("products").doc(product.id).update(update_product).then(snap => {
              for (i = 0; i < vm.products.length; i++) {
                if (vm.products[i].id == product.id) {
                  vm.products[i].isEditing = false
                }
              }
            })
          })
        })
      }
      else {
        db.collection("products").doc(product.id).update(update_product).then(snap => {
          for (i = 0; i < vm.products.length; i++) {
            if (vm.products[i].id == product.id) {
              vm.products[i].isEditing = false
            }
          }
        })
      }
    },
    deleteProduct: function (product) {
      vm = this;
      db.collection("products").doc(product.id).delete()
    }
  }
})

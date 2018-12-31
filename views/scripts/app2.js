var products = [];

var categories = {
  "Laptop": "zXysLStjivQBlYbYidk0",
  "Phone": "nDUFVMG5MJa9nkY8FT89",
  "Tablet": "GN3rVzTpOVJd7Be5ScsW",
  "Accessory": "u1DT5MfxIU6v1eMdBTTf"
}

var categories_inv = {
  "zXysLStjivQBlYbYidk0": "Laptop",
  "nDUFVMG5MJa9nkY8FT89": "Phone",
  "GN3rVzTpOVJd7Be5ScsW": "Tablet",
  "u1DT5MfxIU6v1eMdBTTf": "Accessory"
}

renderProduct = (doc) => {
  let product = doc.data();
  product.id = doc.id;
  product.category.get().then(snap => {
    product.category = snap.data();
    $("#products").append("<tr id='" + product.id + "'><td class='name'>" + product.name +
      "</td><td class='image'>" + "<img src='" + product.image + "' class='image-sm'>" +
      "</td><td class='desc'>" + product.description + "</td><td class='price'>" + product.price +
      "</td><td class='category'>" + product.category.name +
      "</td><td class='edit'><a href='javascript:;' onclick='showEdit(" + JSON.stringify(product.id) + ")'>Edit</a></td>" +
      "<td class='delete'><a href='javascript:;' onclick='showDelete(" + JSON.stringify(product.id) + ")'>Delete</a></td></tr>")
  })
}

db.collection("products").onSnapshot(snap => {
  let changes = snap.docChanges();
  changes.forEach(change => {
    if (change.type == "added") renderProduct(change.doc)
    else if (change.type == "removed") {
      let tr = $("tr#" + change.doc.id);
      tr.remove();
    }
    else if (change.type == "modified") {
      let tr = $("tr#" + change.doc.id);
      product = change.doc.data();
      product.id = change.doc.id;
      product.category.get().then(snap => {
        product.category = snap.data();
        tr.replaceWith("<tr id='" + product.id + "'><td class='name'>" + product.name +
          "</td><td class='image'>" + "<img src='" + product.image + "' class='image-sm'>" +
          "</td><td class='desc'>" + product.description + "</td><td class='price'>" + product.price +
          "</td><td class='category'>" + product.category.name +
          "</td><td class='edit'><a href='javascript:;' onclick='showEdit(" + JSON.stringify(product.id) + ")'>Edit</a></td>" +
          "<td class='delete'><a href='javascript:;' onclick='showDelete(" + JSON.stringify(product.id) + ")'>Delete</a></td></tr>");
      })
    }
  })
})

function createProduct(e) {
  new_product = {
    name: $('#name').val(),
    description: $('#desc').val(),
    price: $('#price').val(),
    category: db.doc(`/categories/${$('#category').val()}`)
  }

  image_file = $('#image')[0].files[0];

  db.collection("products").add(new_product).then(doc => {
    var productsRef = storageRef.child("products/" + doc.id + "/" + image_file.name);
    productsRef.put(image_file).then(snap => {
      storageRef.child(snap.metadata.fullPath).getDownloadURL().then(function (url) {
        db.collection("products").doc(doc.id).update({
          image: url
        })
      })
    })
  });


  e.preventDefault();
}

$('#form-upload').submit(createProduct);

var showDelete = function (id) {
  $("tr#" + id + " td.edit")[0].innerHTML = "<a href='javascript:;' onclick='deleteProduct(" + JSON.stringify(id) + ")'>Yes</a>";
  $("tr#" + id + " td.delete")[0].innerHTML = "<a href='javascript:;' onclick='cancelDelete(" + JSON.stringify(id) + ")'>No</a>";
}

var deleteProduct = function (product_id) {
  db.collection("products").doc(product_id).delete();
}

var cancelDelete = function (id) {
  $("tr#" + id + " td.edit")[0].innerHTML = "<a href='javascript:;' onclick='showEdit(" + JSON.stringify(id) + ")'>Edit</a>";
  $("tr#" + id + " td.delete")[0].innerHTML = "<a href='javascript:;' onclick='showDelete(" + JSON.stringify(id) + ")'>Delete</a>";
}

var showEdit = function (product_id) {
  row = $("tr#" + product_id)[0];
  product = {
    id: product_id,
    name: row.childNodes[0].textContent,
    image: row.childNodes[1].lastChild.src,
    desc: row.childNodes[2].textContent,
    price: row.childNodes[3].textContent,
    category: categories[row.childNodes[4].textContent]
  }

  $("tr#" + product_id + " td.name")[0].innerHTML = "<input class='form-control' type='text' value='" + product.name + "' id='row-name'>";
  $("tr#" + product_id + " td.image")[0].innerHTML = "<input type='file' class='form-control' id='row-image'>";
  $("tr#" + product_id + " td.desc")[0].innerHTML = "<input class='form-control' type='text' value='" + product.desc + "' id='row-desc'>";
  $("tr#" + product_id + " td.price")[0].innerHTML = "<input class='form-control' type='text' value='" + product.price + "' id='row-price'>";
  $("tr#" + product_id + " td.category")[0].innerHTML = "<select class='custom-select' id='row-category' value='" + product.category + "'>"
    + "<option value='zXysLStjivQBlYbYidk0'>Laptop</option>"
    + "<option value='nDUFVMG5MJa9nkY8FT89'>Phone</option>"
    + "<option value='GN3rVzTpOVJd7Be5ScsW'>Tablet</option>"
    + "<option value='u1DT5MfxIU6v1eMdBTTf'>Accessory</option>"
    + "</select>";
  $("tr#" + product_id + " td.category select option[value='" + product.category +"']").attr("selected", "selected");
  $("tr#" + product_id + " td.edit")[0].innerHTML = "<a href='javascript:;' onclick='updateProduct(" + JSON.stringify(product) + ")'>Save</a>";
  $("tr#" + product_id + " td.delete")[0].innerHTML = "<a href='javascript:;' onclick='cancelEdit(" + JSON.stringify(product) + ")'>Cancel</a>";
}

function updateProduct(old_product) {
  product_id = old_product.id;
  new_product = {
    name: $("tr#" + product_id + " td.name input").val(),
    description: $("tr#" + product_id + " td.desc input").val(),
    price: $("tr#" + product_id + " td.price input").val(),
    category: $("tr#" + product_id + " td.category select").val()
  }

  new_product.category = db.doc(`/categories/${new_product.category}`)

  if ($("tr#" + product_id + " td.image input")[0].files.length > 0) {
    image_file = $("tr#" + product_id + " td.image input")[0].files[0];
    var productsRef = storageRef.child("products/" + product_id + "/" + image_file.name);
    productsRef.put(image_file).then(snap => {
      storageRef.child(snap.metadata.fullPath).getDownloadURL().then(function (url) {
        new_product.image = url;
        db.collection("products").doc(product_id).update(new_product);
      })
    })
  }
  else {
    new_product.image = old_product.image;
    db.collection("products").doc(product_id).update(new_product);
  }
}

var cancelEdit = function (product) {
  $("tr#" + product.id + " td.name")[0].innerHTML = product.name;
  $("tr#" + product.id + " td.image")[0].innerHTML = "<img src='" + product.image + "' class='image-sm'>";
  $("tr#" + product.id + " td.desc")[0].innerHTML = product.desc;
  $("tr#" + product.id + " td.price")[0].innerHTML = product.price;
  $("tr#" + product.id + " td.category")[0].innerHTML = categories_inv[product.category];

  $("tr#" + product.id + " td.edit")[0].innerHTML = "<a href='javascript:;' onclick='showEdit(" + JSON.stringify(product.id) + ")'>Edit</a>";
  $("tr#" + product.id + " td.delete")[0].innerHTML = "<a href='javascript:;' onclick='showDelete(" + JSON.stringify(product.id) + ")'>Delete</a>";
}

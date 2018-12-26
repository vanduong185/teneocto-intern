var products = [];

$(document).ready(function () {
  $.get("/products", function (data) {
    products = data.data.products;
    products.forEach(product => {
      $("#products").append("<tr id='" + product.id + "'><td>" + product.id + "</td><td class='name'>" + product.name +
        "</td><td class='image'>" + "<img src='" + product.image + "' class='image-sm'>" +
        "</td><td class='desc'>" + product.description + "</td><td class='price'>" + product.price +
        "</td><td class='category'>" + product.category +
        "</td><td class='edit'><a href='javascript:;' onclick='showEdit(" + product.id + ")'>Edit</a></td>" +
        "<td class='delete'><a href='javascript:;' onclick='showDelete(" + product.id + ")'>Delete</a></td></tr>")
    });
  })
});

var categories = ["Laptop", "Phone", "Tablet", "Accessory"];

(function ($) {
  function createProduct(e) {
    data = new FormData();
    data.append('image', $('#image')[0].files[0]);
    data.append('name', $('#name').val());
    data.append('desc', $('#desc').val());
    data.append('price', $('#price').val());
    data.append('category', $('#category').val());

    $.ajax({
      method: 'POST',
      url: "/product",
      data: data,
      processData: false,
      contentType: false,
      success: function (data, textStatus, jQxhr) {
        if (data.message == "Success") {
          location.reload(true);
        }
      }
    })

    e.preventDefault();
  }

  $('#form-upload').submit(createProduct);
})(jQuery);

var showEdit = function (product_id) {
  row = $("tr#" + product_id)[0];
  product = {
    id: row.childNodes[0].textContent,
    name: row.childNodes[1].textContent,
    image: row.childNodes[2].lastChild.src,
    desc: row.childNodes[3].textContent,
    price: row.childNodes[4].textContent,
    category: categories.indexOf(row.childNodes[5].textContent) + 1
  }

  console.log(product)

  $("tr#" + product_id + " td.name")[0].innerHTML = "<input class='form-control' type='text' value='" + product.name + "' id='row-name'>";
  $("tr#" + product_id + " td.image")[0].innerHTML = "<input type='file' class='form-control' id='row-image'>";
  $("tr#" + product_id + " td.desc")[0].innerHTML = "<input class='form-control' type='text' value='" + product.desc + "' id='row-desc'>";
  $("tr#" + product_id + " td.price")[0].innerHTML = "<input class='form-control' type='text' value='" + product.price + "' id='row-price'>";
  $("tr#" + product_id + " td.category")[0].innerHTML = "<select class='custom-select' id='row-category' value='" + product.category + "'>"
    + "<option value='1'>Laptop</option>"
    + "<option value='2'>Phone</option>"
    + "<option value='3'>Tablet</option>"
    + "<option value='4'>Accessory</option>"
    + "</select>";
  $("tr#" + product_id + " td.category select option[value='" + product.category +"']").attr("selected", "selected");
  $("tr#" + product_id + " td.edit")[0].innerHTML = "<a href='javascript:;' onclick='save(" + JSON.stringify(product) + ")'>Save</a>";
  $("tr#" + product_id + " td.delete")[0].innerHTML = "<a href='javascript:;' onclick='cancelEdit(" + JSON.stringify(product) + ")'>Cancel</a>";
}

var save = function (product_id) {
  updateProduct(product_id);
}

function updateProduct(old_product) {
  product_id = old_product.id;
  console.log(product_id)
  new_product = {
    name: $("tr#" + product_id + " td.name input").val(),
    desc: $("tr#" + product_id + " td.desc input").val(),
    price: $("tr#" + product_id + " td.price input").val(),
    category: $("tr#" + product_id + " td.category select").val()
  }


  if ($("tr#" + product_id + " td.image input")[0].files.length > 0) 
    filename_image = "./assets/images/" + product_id + "/" + $("tr#" + product_id + " td.image input")[0].files[0].name
  else
    filename_image = old_product.image;

  data = new FormData();
  data.append('id', product_id);
  data.append('image', $("tr#" + product_id + " td.image input")[0].files[0]);
  data.append('name', new_product.name);
  data.append('desc', new_product.desc);
  data.append('price', new_product.price);
  data.append('category', new_product.category);

  console.log(product_id)

  $.ajax({
    method: 'PUT',
    url: "/product",
    data: data,
    processData: false,
    contentType: false,
    success: function (data, textStatus, jQxhr) {
      if (data.message == "Success") {
        $("tr#" + product_id).hide();
        $("tr#" + product_id + " td.name")[0].innerHTML = new_product.name;
        $("tr#" + product_id + " td.image")[0].innerHTML = "<img src='" + filename_image + "' class='image-sm'>";
        $("tr#" + product_id + " td.desc")[0].innerHTML = new_product.desc;
        $("tr#" + product_id + " td.price")[0].innerHTML = new_product.price;
        $("tr#" + product_id + " td.category")[0].innerHTML = categories[new_product.category - 1];

        $("tr#" + product_id + " td.edit")[0].innerHTML = "<a href='javascript:;' onclick='showEdit(" + product_id + ")'>Edit</a>";
        $("tr#" + product_id + " td.delete")[0].innerHTML = "<a href='javascript:;' onclick='showDelete(" + product_id + ")'>Delete</a>";
        $("tr#" + product_id).fadeOut(1000).fadeIn(1000);
      }
    }
  })
}

var cancelEdit = function (product) {
  $("tr#" + product.id + " td.name")[0].innerHTML = product.name;
  $("tr#" + product.id + " td.image")[0].innerHTML = "<img src='" + product.image + "' class='image-sm'>";
  $("tr#" + product.id + " td.desc")[0].innerHTML = product.desc;
  $("tr#" + product.id + " td.price")[0].innerHTML = product.price;
  $("tr#" + product.id + " td.category")[0].innerHTML = categories[product.category - 1];

  $("tr#" + product.id + " td.edit")[0].innerHTML = "<a href='javascript:;' onclick='showEdit(" + product.id + ")'>Edit</a>";
  $("tr#" + product.id + " td.delete")[0].innerHTML = "<a href='javascript:;' onclick='showDelete(" + product.id + ")'>Delete</a>";
}

var showDelete = function (product_id) {
  row = $("tr#" + product_id)[0];
  product = {
    id: row.childNodes[0].textContent,
    name: row.childNodes[1].textContent,
    image: row.childNodes[2].lastChild.src,
    desc: row.childNodes[3].textContent,
    price: row.childNodes[4].textContent,
    category: categories.indexOf(row.childNodes[5].textContent) + 1
  }

  $("tr#" + product_id + " td.edit")[0].innerHTML = "<a href='javascript:;' onclick='deleteProduct(" + JSON.stringify(product) + ")'>Yes</a>";
  $("tr#" + product_id + " td.delete")[0].innerHTML = "<a href='javascript:;' onclick='cancelDelete()'>No</a>";
}

var deleteProduct = function (product) {
  $.ajax({
    method: 'DELETE',
    url: "/product",
    dataType: "json",
    data: product,
    success: function (data, textStatus, jQxhr) {
      location.reload(true);
    }
  })
}

var cancelDelete = function () {
  $("tr#" + product.id + " td.edit")[0].innerHTML = "<a href='javascript:;' onclick='showEdit(" + product.id + ")'>Edit</a>";
  $("tr#" + product.id + " td.delete")[0].innerHTML = "<a href='javascript:;' onclick='showDelete(" + product.id + ")'>Delete</a>";
}

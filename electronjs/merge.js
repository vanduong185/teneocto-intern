const fs = require("fs");

var arr;

fs.readFile("translate.json", 'utf8', (err, data) => {
  obj = JSON.parse(data);
  arr = obj;

  fs.readFile("translate1.json", 'utf8', (err, data)=> {
    obj = JSON.parse(data);
    arr = arr.concat(obj);
    fs.readFile("translate2.json", 'utf8', (err, data)=> {
      obj = JSON.parse(data);
      arr = arr.concat(obj);
      fs.writeFileSync("translate0.json", JSON.stringify(arr))
    })
  })
})
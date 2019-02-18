const fs = require("fs");

var arr;

fs.readFile("eng_data.json", 'utf8', (err, data) => {
  obj = JSON.parse(data);
  arr = obj;

  fs.readFile("eng_data1.json", 'utf8', (err, data)=> {
    obj = JSON.parse(data);
    arr = arr.concat(obj);
    fs.writeFileSync("eng_data2.json", JSON.stringify(arr))
  })
})
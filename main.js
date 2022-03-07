const fs = require("fs");
const { parse } = require("csv-parse");
const builder = require('xmlbuilder');



let csvData = [];
let headerAtts = [];
let itemAtts = [];
let orderList = [];
let itemList = [];
const read = () => {
  let i = 0;

  fs.createReadStream("./input/input.txt", "utf-8")
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvrow) {
      csvData.push(csvrow);
    })
    .on("end", function () {
      //do something with csvData
      // console.log(csvData);
      const regex = /;/g;
      for (i; i < csvData.length; i++) {
        let sa = csvData[i][0].replace(regex, ",");
        let arr = sa.split(",");

        if (i == 0) headerAtts = [...arr];
        if (i == 1) orderList = [...arr];
        if (i == 2) itemAtts = [...arr];

        if (i > 2) {
          arr = arr.filter(function (item) {
            return item != "";
          });
          itemList.push(arr);
        }
      }
     // console.log(itemList);
    });
};
read();

const writeFile=()=>{


    fs.writeFile('./output/output.xml',doc,(err)=>{
        if(err) console.log(err)
    })
}
writeFile()
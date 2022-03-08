const fs = require("fs");
const { parse } = require("csv-parse");
const builder = require("xmlbuilder");
var ET = require("elementtree");
var XML = ET.XML;
var ElementTree = ET.ElementTree;

//elementree ile xml tagları oluşturma ve text ekleme
const writeFile = () => {
  let order = ET.Element("order");
  let header = ET.SubElement(order, "header");
  //  console.log(orderList)
  for (let i = 0; i < headerAtts.length; i++) {
    let a = ET.SubElement(header, headerAtts[i]);
    a.text = orderList[i];
  }
  let lines = ET.SubElement(order, "lines");

  for (let i = 0; i < itemList.length; i++) {
    let line = ET.SubElement(lines, "line");
    let j = 0;
    for (const key in itemList[i]) {
      ET.SubElement(line, itemAtts[j]).text = itemList[i][j];
      j++;
      if (j == 7) {
        j = 0;
      }
    }
  }

  let etree = new ElementTree(order);
  let xml = etree.write({ xml_declaration: false });
  // console.log(xml);

  fs.writeFile("./output/output.xml", xml, function (err) { //fs modulü ile dosya yazdırma kısmı
    if (err) throw err;
  });
};

let csvData = [];
let headerAtts = [];
let itemAtts = [];
let orderList = [];
let itemList = [];
function read() {
  fs.createReadStream("./input/input.txt", "utf-8")
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvrow) {
      csvData.push(csvrow);
    })
    .on("end", function () {
      //do something with csvData
      // console.log(csvData);
      const regex = /;/g;

      for (i = 0; i < csvData.length; i++) { //row'ları düzenleme ve array içine push etme işlemi
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
      writeFile();
    });
}

read();

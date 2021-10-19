const xl = require("excel4node");
const fs = require("fs-extra");

module.exports = {
  createFile: (data) => {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Worksheet Name");

    const headingColumnNames = ["Name", "Email", "Mobile"];

    //Write Column Title in Excel file
    // let headingColumnIndex = 1;
    // headingColumnNames.forEach((heading) => {
    //   ws.cell(1, headingColumnIndex++).string(heading);
    // });

    // //Write Data in Excel file
    // let rowIndex = 2;
    // console.log(data);
    // data.forEach((record) => {
    //   let columnIndex = 1;
    //   Object.keys(record).forEach((columnName) => {
    //     ws.cell(rowIndex, columnIndex++).string(record[columnName]);
    //   });
    //   rowIndex++;
    // });

    const fileName = `${new Date().toLocaleDateString()}_${new Date()
      .toLocaleTimeString()
      .split(":")
      .join(".")}`;

    // wb.write(`./data/${fileName}.xlsx`, function (err, stats) {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.log(stats); // Prints out an instance of a node.js fs.Stats object
    //   }
    // });
    fs.writeFile(
      `./data/${fileName}.txt`,
      JSON.stringify(data),
      function (err) {
        if (err) return console.log(err);
        console.log("Hello World > helloworld.txt");
      },
    );
    return `./data/${fileName}.txt`;
  },
};

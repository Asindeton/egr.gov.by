const GovernmentApiCall = require("../javascripts/getApiInfo");
const XLSX = require("xlsx");

module.exports = {
  createFile: async (dataArr) => {
    const fileName = `${new Date().toLocaleDateString()}_${new Date()
      .toLocaleTimeString()
      .split(":")
      .join(".")}`;
    const path = `./data/${fileName}.xlsx`;

    const data = dataArr[0].data
      .concat(dataArr[1].data, dataArr[2].data)
      .sort(function (a, b) {
        return a["ngrn"] - b["ngrn"];
      });

    let _tempData = [];

    data.forEach((e, i) => {
      if (i + 1 === data.length) {
        _tempData.push(e);
      } else if (e == undefined) {
        return false;
      } else if (e["ngrn"] === data[i + 1]["ngrn"]) {
        _tempData.push({ ...e, ...data[i + 1] });
        data[i + 1] = undefined;
      } else {
        _tempData.push(e);
      }
    });

    // let _name = [];
    // const dataName = dataArr[0].data.sort(function (a, b) {
    //   return a["ngrn"] - b["ngrn"];
    // });
    // dataName.map(async (e, i) => {
    //   _name.push(await GovernmentApiCall.getIPinfo(e["ngrn"])[0].data);
    // });
    console.log(dataArr[3]);
    // const workSheet1 = XLSX.utils.json_to_sheet(dataArr[0].data);
    // const workSheet2 = XLSX.utils.json_to_sheet(dataArr[1].data);
    // const workSheet3 = XLSX.utils.json_to_sheet(dataArr[2].data);
    const workSheet4 = XLSX.utils.json_to_sheet(_tempData);
    // const workSheet5 = XLSX.utils.json_to_sheet(ataArr[3].data);
    const workBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workBook, workSheet1, "getIPFIOByPeriod");
    // XLSX.utils.book_append_sheet(workBook, workSheet2, "getAddressByPeriod");
    // XLSX.utils.book_append_sheet(workBook, workSheet3, "getJurNamesByPeriod");
    XLSX.utils.book_append_sheet(workBook, workSheet4, "_tempData");
    // XLSX.utils.book_append_sheet(workBook, workSheet5, "_name");
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workBook, path);
    return path;
  },
};

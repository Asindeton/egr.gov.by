const getName = require("../javascripts/getUserInfo");
const XLSX = require("xlsx");
const path = require("path");
require("dotenv").config();

module.exports = {
  createFile: async (dataArr, difficulty) => {
    let today = new Date();
    const fileName = `${today.getDate()}.${
      today.getMonth() + 1
    }.${today.getFullYear()}_${new Date().getHours()}.${new Date().getMinutes()}.${new Date().getSeconds()}.xlsx`;

    const pathDir = path.join(path.resolve("./data/"), fileName);

    async function getInfoForTable(arr1, additionalData, isSimple) {
      if (isSimple == 1) {
        return [];
      }
      let _nameId = [];
      let _tempData = [];

      arr1.map(async (e, i) => {
        _nameId.push(e["ngrn"]);
      });

      let searchRequest = "";
      let nameRequestValue = "";

      switch (additionalData) {
        // case "ИП":
        //   searchRequest = "getIPFIOByRegNum";
        //   nameRequestValue = "vfio";
        //   break;
        case "ЮР":
          searchRequest = "getJurNamesByRegNum";
          nameRequestValue = "vfn";
          break;
      }

      const _Name = await Promise.all(
        _nameId.map((ngrn) => getName.getIPinfo(searchRequest, ngrn)),
      );

      const _ss = await _Name.map((item) => {
        return item.data[0] !== undefined ? item.data[0] : undefined;
      });

      const _s = _ss.filter(function (el) {
        return el !== undefined;
      });

      const sortArray = _s.concat(arr1).sort(function (a, b) {
        return a["ngrn"] - b["ngrn"];
      });

      // console.table(_ss);
      // console.table(_s);

      // console.table(_ss);
      // console.table(_Name);

      sortArray.forEach((e, i) => {
        if (i + 1 === sortArray.length) {
          _tempData.push(e);
        } else if (e == undefined) {
          return false;
        } else if (e["ngrn"] === sortArray[i + 1]["ngrn"]) {
          _tempData.push({ ...e, ...sortArray[i + 1] });
          sortArray[i + 1] = undefined;
        } else {
          _tempData.push(e);
        }
      });
      // console.table(_tempData);
      const _t = _tempData.filter(function (e) {
        if (e === undefined) {
          return false;
        } else if (e[nameRequestValue]) {
          return true;
        }
        return false;
      });
      return _t;
    }
    // console.log("dataArr[0].data");
    // console.table(dataArr[0].data);
    // console.log("dataArr[1].data");
    // console.table(dataArr[1].data);

    const workSheet2 = XLSX.utils.json_to_sheet(dataArr[0].data);
    // const workSheet4 = XLSX.utils.json_to_sheet(dataArr[2].data);

    // const workSheet5 = XLSX.utils.json_to_sheet(
    //   await getInfoForTable(dataArr[0].data, "ИП"),
    // );

    // const workSheet3 = XLSX.utils.json_to_sheet(
    //   await getInfoForTable(dataArr[1].data, "ЮР"),
    // );

    const workSheet3 = XLSX.utils.json_to_sheet(dataArr[1].data);
    const workSheet4 = XLSX.utils.json_to_sheet(dataArr[2].data);

    const workSheet5 = XLSX.utils.json_to_sheet(
      await getInfoForTable(dataArr[1].data, "ЮР", difficulty),
    );
    // const workSheet4 = XLSX.utils.json_to_sheet(dataArr[1].data);

    // let some3 = XLSX.utils.sheet_to_buffer(await workSheet3);
    // console.log("some2");
    // console.log(some2);
    // console.log("some3");
    // console.log(some3);

    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet2, "ИП");
    // XLSX.utils.book_append_sheet(workBook, workSheet5, "ИП2");
    if (difficulty == "1") {
      XLSX.utils.book_append_sheet(workBook, workSheet3, "Юр. Лица Упрощённое");
      XLSX.utils.book_append_sheet(
        workBook,
        workSheet4,
        "Юр. Лица Упрощённое Адреса",
      );
    } else {
      XLSX.utils.book_append_sheet(workBook, workSheet5, "Юр. Лица");
    }

    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

    // XLSX.writeFile(workBook, pathDir);

    let data = XLSX.write(workBook, {
      type: "buffer",
      bookType: "xlsx",
      bookSST: false,
    });

    // console.log(data);
    return data;
  },
};

const getName = require("../javascripts/getUserInfo");
const XLSX = require("xlsx");

module.exports = {
  createFile: async (dataArr) => {
    const fileName = `${new Date().toLocaleDateString()}_${new Date()
      .toLocaleTimeString()
      .split(":")
      .join(".")}`;
    const path = `./data/${fileName}.xlsx`;

    async function getInfoForTable(arr1, additionalData) {
      let _nameId = [];
      let _tempData = [];

      arr1.map(async (e, i) => {
        _nameId.push(e["ngrn"]);
      });
      let searchRequest = "";
      let nameRequestValue = "";
      // console.table(arr1);
      switch (additionalData) {
        case "ИП":
          searchRequest = "getIPFIOByRegNum";
          nameRequestValue = "vfio";
          break;
        case "ЮР":
          searchRequest = "getJurNamesByRegNum";
          nameRequestValue = "vfn";
          break;
      }
      const _Name = await Promise.all(
        _nameId.map((ngrn) => getName.getIPinfo(searchRequest, ngrn)),
      );
      const _ss = await _Name.map((item) => item.data[0]);

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

    const workSheet2 = XLSX.utils.json_to_sheet(
      await getInfoForTable(dataArr[1].data, "ИП"),
    );
    const workSheet3 = XLSX.utils.json_to_sheet(
      await getInfoForTable(dataArr[1].data, "ЮР"),
    );
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet2, "ИП");
    XLSX.utils.book_append_sheet(workBook, workSheet3, "Юр. Лица");
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workBook, path);
    return path;
  },
};

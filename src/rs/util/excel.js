const excel = {}

excel.export = (JSONData, FileName, ShowLabel) => {
  let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
  let table = '<table>';
  let row = "<tr>";
  for (let i = 0, l = ShowLabel.length; i < l; i += 1) {
    row += "<td>" + ShowLabel[i].value + '</td>';
  }
  table += row + "</tr>";
  for (let i = 0; i < arrData.length; i += 1) {
    let row = "<tr>";
    for (let index in arrData[i]) {
      let value = arrData[i][index].value === "." ? "" : arrData[i][index].value;
      row += '<td>' + value + '</td>';
    }
    table += row + "</tr>";
  }
  table += "</table>";
  let excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
  excelFile += '; charset=UTF-8">';
  excelFile += "<head>";
  excelFile += "<!--[if gte mso 9]>";
  excelFile += "<xml>";
  excelFile += "<x:ExcelWorkbook>";
  excelFile += "<x:ExcelWorksheets>";
  excelFile += "<x:ExcelWorksheet>";
  excelFile += "<x:Name>";
  excelFile += "{worksheet}";
  excelFile += "</x:Name>";
  excelFile += "<x:WorksheetOptions>";
  excelFile += "<x:DisplayGridlines/>";
  excelFile += "</x:WorksheetOptions>";
  excelFile += "</x:ExcelWorksheet>";
  excelFile += "</x:ExcelWorksheets>";
  excelFile += "</x:ExcelWorkbook>";
  excelFile += "</xml>";
  excelFile += "<![endif]-->";
  excelFile += "</head>";
  excelFile += "<body>";
  excelFile += table;
  excelFile += "</body>";
  excelFile += "</html>";
  let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
  let link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = FileName + ".xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default excel;

const date = {}
date.format = (dateObj, fmt) => {
  const o = {
    "M+": dateObj.getMonth() + 1,
    "d+": dateObj.getDate(),
    "h+": dateObj.getHours(),
    "m+": dateObj.getMinutes(),
    "s+": dateObj.getSeconds(),
    "q+": Math.floor((dateObj.getMonth() + 3) / 3),
    "S": dateObj.getMilliseconds(),
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

date.toString = function (str, format) {
  format = format === undefined ? 'yyyy-MM-dd hh:mm:ss' : format;
  let dateTime = new Date(parseInt(str.substring(6, str.length - 2)));
  format = format.replace("yyyy", dateTime.getFullYear());
  format = format.replace("yy", dateTime.getFullYear().toString().substr(2));
  format = format.replace("MM", (dateTime.getMonth() + 1) < 10 ? `0${(dateTime.getMonth() + 1)}` : dateTime.getMonth() + 1);
  format = format.replace("dd", dateTime.getDate() < 10 ? `0${dateTime.getDate()}` : dateTime.getDate());
  let hour = 0, min = 0, s = 0;
  hour = dateTime.getHours() < 10 ? "0" + dateTime.getHours() : dateTime.getHours();
  min = dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes() : dateTime.getMinutes();
  s = dateTime.getSeconds() < 10 ? "0" + dateTime.getSeconds() : dateTime.getSeconds();
  format = format.replace("hh", hour);
  format = format.replace("mm", min);
  format = format.replace("ss", s);
  format = format.replace("ms", dateTime.getMilliseconds())
  return format;
};

export default date;

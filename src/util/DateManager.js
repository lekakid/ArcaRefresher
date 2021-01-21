export function getTimeStr(datetime) {
  const date = new Date(datetime);
  let hh = date.getHours();
  let mm = date.getMinutes();

  if (hh.toString().length === 1) {
    hh = `0${hh}`;
  }
  if (mm.toString().length === 1) {
    mm = `0${mm}`;
  }

  return `${hh}:${mm}`;
}

export function getDateStr(datetime) {
  const date = new Date(datetime);

  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();

  if (month.toString().length === 1) {
    month = `0${month}`;
  }
  if (day.toString().length === 1) {
    day = `0${day}`;
  }
  if (hh.toString().length === 1) {
    hh = `0${hh}`;
  }
  if (mm.toString().length === 1) {
    mm = `0${mm}`;
  }
  if (ss.toString().length === 1) {
    ss = `0${ss}`;
  }

  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
}

export function in24(datetime) {
  const target = new Date(datetime);
  const criteria = new Date();
  criteria.setHours(criteria.getHours() - 24);

  if (target > criteria) return true;

  return false;
}

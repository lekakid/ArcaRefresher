export function getDateStr(datetime, format) {
  const date = new Date(datetime);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');

  return format
    .replace('year', year)
    .replace('month', month)
    .replace('day', day)
    .replace('hh', hh)
    .replace('mm', mm)
    .replace('ss', ss);
}

export function in24(datetime) {
  const target = new Date(datetime);
  const criteria = new Date();
  criteria.setHours(criteria.getHours() - 24);

  if (target > criteria) return true;

  return false;
}

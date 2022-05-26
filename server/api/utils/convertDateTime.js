export function convertDateTime(valDate, typeDate) {
  if(valDate){
      let date_val = new Date(valDate);
      if(typeDate === 0){
        date_val.setHours(0,0,0,0)
      }else{
        date_val.setHours(23,59,59,999)
      }
      valDate = date_val.toISOString()
    }
    return valDate
}

export function dateFormatterYMD(stringDate) {
  if (stringDate) {
    let dateFormat = new Date(stringDate);
    return `${dateFormat.getFullYear()}${('0' + (dateFormat.getMonth() + 1)).slice(-2)}${('0' + dateFormat.getDate()).slice(-2)}`;
  } else {
    return ''
  }
}

export function formatYMDFromDate(momentDate) {
  let dateFormat = new Date(momentDate);
  return `${dateFormat.getFullYear()}${('0' + (dateFormat.getMonth() + 1)).slice(-2)}${('0' + dateFormat.getDate()).slice(-2)}`;
}

export function dateFormatterFromDate(totalSeconds) {
  let str = ''
  let hours = Math.floor(totalSeconds / 3600);

  if(hours > 0) str += hours + ' giờ '
  totalSeconds %= 3600;

  let minutes = Math.floor(totalSeconds / 60);
  if(minutes > 0) str += minutes + ' phút '

  let seconds = totalSeconds % 60;
  str += seconds + ' giây'
  return str
}

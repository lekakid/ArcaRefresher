export function getTimeStr(datetime) {
    var date = new Date(datetime);
    var hh = date.getHours();
    var mm = date.getMinutes();

    if (("" + hh).length == 1) {
        hh = "0" + hh;
    }
    if (("" + mm).length == 1) {
        mm = "0" + mm;
    }

    return `${hh}:${mm}`;
}

export function getDateStr(datetime) {
    var date = new Date(datetime);

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();

    if (("" + month).length == 1) {
        month = "0" + month;
    }
    if (("" + day).length == 1) {
        day = "0" + day;
    }
    if (("" + hh).length == 1) {
        hh = "0" + hh;
    }
    if (("" + mm).length == 1) {
        mm = "0" + mm;
    }
    if (("" + ss).length == 1) {
        ss = "0" + ss;
    }

    return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
}

export function in24(datetime) {
    const target = new Date(datetime);
    const criteria = new Date();
    criteria.setHours(criteria.getHours() - 24);
    
    if(target > criteria)
        return true;

    return false;
}
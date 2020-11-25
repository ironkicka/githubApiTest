const date = new Date()
//console.log(date)
//const iso = date.toISOString()
//console.log(iso)
//console.log(date.toLocaleString())
const jstTime = date.toLocaleString()

const toISO8601String = (dateString)=>{
    const strArr = dateString.split(' ')
    const result = strArr[0]+'T'+strArr[1]+'+09:00'
    return result
}
const getAWeekAgoISO8601StringJST = ()=>{
    const date = new Date()
    date.setDate(date.getDate()-7)
    const aWeekAgo = date.toLocaleString()
    const result = toISO8601String(aWeekAgo)
    console.log(result)
}

getAWeekAgoISO8601StringJST()

const getOneDayAgoISO8601StringJST = ()=>{
    const date = new Date()
    date.setDate(date.getDate()-1)
    const yyyy = date.getFullYear();
    const mm = toDoubleDigits(date.getMonth() + 1);
    const dd = toDoubleDigits(date.getDate());
    const hh = toDoubleDigits(date.getHours());
    const mi = toDoubleDigits(date.getMinutes());
    const result = yyyy + '-' + mm　+ '-' + dd + 'T' + hh + ':' + mi + ':00+09:00'
    console.log(typeof result)
    return result;
}
const toDoubleDigits = (num) => {
    num += "";
    if (num.length === 1) {
        num = "0" + num;
    }
    return num;
};

console.log(getOneDayAgoISO8601StringJST())

//目指す形
// "2020-11-10T00:00:00+09:00"
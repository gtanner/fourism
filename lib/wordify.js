//http://andrew-hoyer.com/experiments/numbers/
var names = [{"0":"zero","1":"one","2":"two","3":"three","4":"four","5":"five","6":"six","7":"seven","8":"eight","9":"nine" },{"0":"ten","1":"eleven","2":"twelve","3":"thirteen","4":"fourteen","5":"fifteen","6":"sixteen","7":"seventeen","8":"eighteen","9":"nineteen"},{"2":"twenty","3":"thirty","4":"forty","5":"fifty","6":"sixty","7":"seventy","8":"eighty","9":"ninety"},["","thousand","million","billion","trillion","quadrillion","quintillion","sextillion","septillion","octillion","nonillion","decillion","undecillion","duodecillion","tredecillion","quattuordecillion", "quindecillion","sexdecillion","septdecillion","octdecillion","novemdecillion","vigintillion"]];
var to_words = function(s, n) {
    var ns = s.slice(0,3);
    return (ns.length < 1) ? "" :to_words(s.slice(3,s.length),n+1)+((ns.length>1)?((ns.length==3&&ns[2]!="0")?names[0][ns[2]]+" hundred "+((ns[1]=="1")?names[1][ns[0]]+" ":(ns[1]!="0")?names[2][ns[1]]+" "+((ns[0]!="0")?names[0][ns[0]]+" ":""):(ns[0]!="0"?names[0][ns[0]]+" ":"")):((ns[1]=="1")?names[1][ns[0]]+" ":(ns[1]!="0")?names[2][ns[1]]+" "+((ns[0]!="0")?names[0][ns[0]]+" ":""):(ns[0]!="0"?names[0][ns[0]]+" ":""))) + (((ns.length==3&&(ns[0]!="0"||ns[1]!="0"||ns[2]!="0"))||(ns.length==2&&(ns[0]!="0"||ns[1]!="0"))||(ns.length==1&&ns[0]!="0"))? names[3][n]+" ":""):((ns.length==1&&ns[0]!="0")?names[0][ns[0]]+" ":"") + (((ns.length==3&&(ns[0]!="0"||ns[1]!="0"||ns[2]!="0"))||(ns.length==2&&(ns[0]!="0"||ns[1]!="0"))||(ns.length==1&&ns[0]!="0"))?names[3][n]+" ":""));
}, input;

module.exports = function (number) {
  return to_words(number.toString().split('').reverse(), 0).trim();
};

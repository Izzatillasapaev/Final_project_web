
// alert("sa");
var chat_id="-314904489";
var token="774940657:AAEibH2MnZqE60hY--bX8HOzSuDqYsNBkC8";
function send(txt) {
    var request = new XMLHttpRequest();
// txt="sdfsdf"+"%0A"+"sadasda";
    request.open('GET', "https://api.telegram.org/bot"+token+"/sendMessage?chat_id="+chat_id+"&parse_mode=html&text="+txt+"", true);
    request.send(null);

}
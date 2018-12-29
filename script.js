class Card {
    constructor(photoDirectory, name, description, price25cm, price30cm, price35cm, index) {
        this.photoDirectory = photoDirectory;
        this.name = name;
        this.description = description;
        this.price35cm = price35cm;
        this.price30cm = price30cm;
        this.price25cm = price25cm;
        this.checked = 0;
        this.comment = "";
        this.comment_id = 'commentModalLong' + index;
        this.comment_on = "";
        if (this.price35cm !== 0) {
            this.price = this.price35cm;
            this.checked = 3;
        }
        else if (this.price30cm !== 0) {
            this.price = this.price30cm;
            this.checked = 2;
        }
        else {
            this.price = this.price25cm;
            this.checked = 1;
        }
        this.index = index;
        this.counter = 1;
    }

    get getPhotodirectory() {
        return this.photoDirectory;
    }

    get getName() {
        return this.name;
    }

    get getDescription() {
        return this.description;
    }

    get getAble25cm() {
        return this.price25cm === 0;
    }

    get getAble30cm() {
        return this.price30cm === 0;
    }

    get getAble35cm() {
        return this.price35cm === 0;
    }

    get getPrice() {
        return this.price * this.counter;
    }

    getChecked(x) {
        return x === this.checked;


    }

    get getIndex() {
        return this.index;
    }

    getCard() {
        return this;
    }

    incCounter() {
        this.counter++;
    }

    decCounter() {
        if (this.counter > 1)
            this.counter--;
    }

    changePrice(x) {
        if (x === 1) {
            this.price = this.price25cm;
            this.checked = 1;
        }
        if (x === 2) {
            this.price = this.price30cm;
            this.checked = 2;
        }
        if (x === 3) {
            this.price = this.price35cm;
            this.checked = 3;
        }

    }

    promtOnClickComment() {

        this.comment = this.comment_on;
        // alert(this.comment);

    }
}

class Order {
    constructor(name, size, amount, comment, price) {
        this.name = name;
        this.size = size;
        this.amount = amount;
        this.comment = comment;
        this.price = price;
        this.order_per_one = this.price / this.amount;
    }

    toString() {
        return "Название: " + this.name + "%0A  Размер: " + this.size + "%0A  Количество: " +
            this.amount + "%0A  Комментарии: " + this.comment + "%0A  Цена: " + this.getPrice + "%0A";
    }

    get getOrder() {
        return this;
    }

    get getPrice() {
        return this.price * this.amount;
    }
}
//get data from excel

let url = "data/pizza.xlsx";

// set up async GET request
let req = new XMLHttpRequest();
req.open("GET", url, true);
req.responseType = "arraybuffer";

let cards_arr = [];
req.onload = function (e) {
    let data = new Uint8Array(req.response);
    let workbook = XLSX.read(data, {type: "array"});

    let x = 2;
    let first_sheet_name = workbook.SheetNames[0];
    while (true) {
        //Photo
        let address_of_cell = 'A' + x;

        //Get worksheet
        let ws = workbook.Sheets[first_sheet_name];

        // Find desired cell
        let desired_cell = ws[address_of_cell];

        // Get the value
        let desired_value = (desired_cell ? desired_cell.v : undefined);
        if (desired_value === undefined) {
            // alert("stoped at "+x);
            break;
        }

        let card = new Card(ws["A" + x].v, ws["B" + x].v, ws["C" + x].v, ws["D" + x].v, ws["E" + x].v, ws["F" + x].v, x);
        cards_arr.push(card);


        x++;
    }
//alert(desired_value);
};

req.send();


let orders = [];

var v1 = new Vue({
    el: "#vue_card",
    data: {
        cards:
        cards_arr
    },
    methods: {
        addPizzaOrder: function (new_card, counter, comment, price) {

            let size = "";
            if (new_card.checked === 1)
                size = '25cm';
            if (new_card.checked === 2)
                size = '30cm';
            if (new_card.checked === 3)
                size = '35cm';

            let order = new Order(new_card.name, size, counter, comment, price);

            orders.push(order);

        }
    }
});


new Vue({
    el: "#basket-list",
    data: {
        order_list:
        orders,
        total_price: 0
    },
    methods: {
        sendOrder: function () {
            if (document.getElementById("usr1").value === "" || document.getElementById("usr2").value === "") {
                alert("Заполните все поля");
                return;
            }
            let msg = "";
            msg += "Новый заказ%0A";
            for (let i = 0; i < this.order_list.length; i++) {
                msg += this.order_list[i].toString();
            }
            if (this.getTotalPrice() !== 0) {
                msg += "%0AОбщая цена " + this.getTotalPrice() + "%0A%0A";
                msg += "Адрес доставки: " + document.getElementById("usr1").value + "%0A";
                msg += "Номер телефона: " + document.getElementById("usr2").value + "%0A";
                send(msg);
                for (let j = 0; j < v1.cards.length; j++) {
                    v1.cards[j].comment = "";
                    v1.cards[j].counter = 1;
                }
                alert("Ваш заказ принят. Ожидайте доставку");
            }
            orders = [];
            this.order_list = orders;
            document.getElementById("usr1").value = "";
            document.getElementById("usr2").value = "";

        },
        getTotalPrice: function () {
            var total_sum = 0;
            for (var i = 0; i < this.order_list.length; i++) {
                total_sum += parseInt(this.order_list[i].getPrice);
                //  alert(orders[0].price)
            }
            return total_sum;
        },
        removeOrder: function (ord) {
            remove(this.order_list, ord);
            // alert('done')
        }
    }

});

function remove(array, element) {
    return array.filter(el => el !== element);
}
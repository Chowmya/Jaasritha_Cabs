// ==========================================
// JAASRITHA CABS BILLING SYSTEM
// ==========================================

// ---------- BILL NUMBER ----------

let billNo = parseInt(localStorage.getItem("billNo")) || 1;

const billNoBox = document.getElementById("billNo");

billNoBox.value = billNo.toString().padStart(3, "0");

// User can edit bill number
billNoBox.addEventListener("change", () => {

    let value = parseInt(billNoBox.value);

    if (!isNaN(value) && value > 0) {

        billNo = value;

        localStorage.setItem("billNo", billNo);

        billNoBox.value = billNo.toString().padStart(3, "0");

    }

});

// ==========================================
// CALCULATION FIELDS
// ==========================================

const fields = [

["dayRent","amtDayRent"],

["fuelCharges","amtFuel"],

["driverBatta","amtDriver"],

["tollgate","amtToll"],

["nightHalt","amtNight"],

["extraTiming","amtExtra"],

["permit","amtPermit"]

];

// ==========================================
// SAFE CALCULATOR
// ==========================================

function calculateExpression(text){

    if(text.trim()=="")
        return 0;

    text = text.replace(/×/g,"*");

    text = text.replace(/x/gi,"*");

    // Allow only numbers and operators
    if(!/^[0-9+\-*/(). ]+$/.test(text))
        return 0;

    try{

        let value = Function('"use strict";return ('+text+')')();

        if(isNaN(value))
            return 0;

        return value;

    }catch{

        return 0;

    }

}

// ==========================================
// UPDATE AMOUNTS
// ==========================================

function updateAmounts(){

    let total = 0;

    fields.forEach(function(item){

        let expression = document.getElementById(item[0]).value;

        let value = calculateExpression(expression);

        document.getElementById(item[1]).innerText =
            value ? value.toLocaleString("en-IN") : "";

        total += value;

    });

    document.getElementById("grandTotal").innerText =
        total.toLocaleString("en-IN");

    document.getElementById("amountWords").value =
        numberToWords(total);

}

fields.forEach(function(item){

    document
    .getElementById(item[0])
    .addEventListener("input",updateAmounts);

});

// ==========================================
// NUMBER TO WORDS (INDIAN)
// ==========================================

function numberToWords(num){

    if(num===0)
        return "";

    const ones=[
        "",
        "One","Two","Three","Four","Five",
        "Six","Seven","Eight","Nine",
        "Ten","Eleven","Twelve","Thirteen","Fourteen",
        "Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"
    ];

    const tens=[
        "",
        "",
        "Twenty","Thirty","Forty",
        "Fifty","Sixty","Seventy",
        "Eighty","Ninety"
    ];

    function convert(n){

        let str="";

        if(n>=100){

            str+=ones[Math.floor(n/100)]+" Hundred ";

            n%=100;

        }

        if(n>=20){

            str+=tens[Math.floor(n/10)]+" ";

            n%=10;

        }

        if(n>0){

            str+=ones[n]+" ";

        }

        return str;

    }

    let result="";

    let crore=Math.floor(num/10000000);

    num%=10000000;

    let lakh=Math.floor(num/100000);

    num%=100000;

    let thousand=Math.floor(num/1000);

    num%=1000;

    let hundred=num;

    if(crore)
        result+=convert(crore)+"Crore ";

    if(lakh)
        result+=convert(lakh)+"Lakh ";

    if(thousand)
        result+=convert(thousand)+"Thousand ";

    if(hundred)
        result+=convert(hundred);

    return "Rupees " + result.trim() + " Only";

}

// ==========================================
// NEW BILL
// ==========================================

function newBill(){

    billNo++;

    localStorage.setItem("billNo",billNo);

    billNoBox.value=billNo.toString().padStart(3,"0");

    document.querySelectorAll("input").forEach(function(input){

        if(
            input.id!="billNo" &&
            input.id!="billDate"
        ){

            input.value="";

        }

    });

    document.querySelectorAll(".amount").forEach(function(cell){

        if(cell.id!="grandTotal")
            cell.innerHTML="";

    });

    document.getElementById("grandTotal").innerHTML="";

    document.getElementById("amountWords").value="";

    const places=document.getElementById("placesVisited");

    if(places)
        places.value="";

    document.getElementById("customer1").focus();

}

// ==========================================
// PRINT
// ==========================================

function printBill(){

    window.print();

}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
    .then(function() {
        console.log("Service Worker Registered");
    });
}
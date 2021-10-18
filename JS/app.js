$(document).ready(function () {
    //set data to input
    $(".calc-btn").click(function () {
        if (!$(this).hasClass("not")) {
            if ($("#screen").val() == 0 && !$("#screen").val().includes("."))
                $("#screen").val($(this).text());
            else
                $("#screen").val($("#screen").val() + $(this).text());
        }
    });
    //set operator to input
    $('.operator').click(function () {
        $("#screen").val($("#screen").val() + $(this).text());
    });
    // return back
    $('#back').click(function () {
        let value = $("#screen").val();
        if (!(parseInt(parseFloat(value)) === 0 && value.length === 1))
            $("#screen").val(value.slice(0, value.length - 1));
        if (value.length === 1)
            $("#screen").val("0");
    });
    // set input all clear
    $("#allClear").click(function () {
        $("#screen").val("0");
        $("#result").val("");
    });
    // change Sign number
    $("#changeSign").click(function () {
        let myScreen = $("#screen").val();
        if (hasOperator(myScreen)) {
            for (let i = 0; i < myScreen.length; i++) {
                if (isOneOperator(myScreen[myScreen.length - i], "x", "÷")) {
                    try {
                        handleCaculator(myScreen, myScreen.length - i + 1, "+/-")
                    } catch (e) {
                        evalCatch(e);
                    }
                    break;
                } else if (isOneOperator(myScreen[myScreen.length - i], "+", "-")) {
                    try {
                        handleCaculator(myScreen, myScreen.length - i, "+/-", true);
                    } catch (e) {
                        evalCatch(e)
                    }
                    break;
                } else if (myScreen[0] === "-" && sumOperator(myScreen) === 1) {
                    try {
                        $("#screen").val(changeSign(myScreen));
                    } catch (e) {
                        evalCatch(e)
                    }
                    break;
                }
            }
        } else {
            $("#screen").val(changeSign(myScreen));
        }
    });
    //Get percent of number
    $("#changePercent").click(function () {
        let myScreen = $("#screen").val();
        if (hasOperator(myScreen)) {
            for (let i = 0; i < myScreen.length; i++) {
                if (sumOperator(myScreen) === 1 && isOperator(myScreen[0])) {
                    $('#screen').val(changePercent(myScreen));
                    break;
                } else if (sumOperator(myScreen) >= 1 && isOperator(myScreen[myScreen.length - i])) {
                    try {
                        handleCaculator(myScreen, myScreen.length - i + 1, "%");
                    } catch (e) {
                        evalCatch(e);
                    }
                    break;
                }
            }
        } else {
            $('#screen').val(changePercent(myScreen));
        }
    });
    //Kết quả
    $("#equal").click(function () {
        let result, exp;
        var newExp1, newExp2;
        try {
            exp = $("#screen").val();
            if (exp.includes('÷') || exp.includes('x')) {
                newExp1 = exp.replace(/x/gi, '*');
                newExp2 = newExp1.replace(/÷/gi, '/');
            } else {
                newExp2 = exp;
            }
            result = (eval(newExp2));
            $("#result").val(result);
            $("#screen").val(exp);
        } catch (e) {
            evalCatch(e);
        }
    });
});

hasOperator = function (myScreen) {
    return myScreen.includes("-") || myScreen.includes("+") ||
        myScreen.includes("x") || myScreen.includes("÷");
};
isOperator = function (value) {
    return value === ("-") || value === ("+") || value === ("x") || value === ("÷")
}
sumOperator = function (value) {
    let num = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === ("-") || value[i] === ("+") || value[i] === ("x") || value[i] === ("÷")) {
            num += 1;
        }
    }
    return num;
};
isOneOperator = function (value, ope1, ope2) {
    return value === (ope1) || value === (ope2)
};
areNotOperator = function (value, ope1, ope2, ope3) {
    return value !== (ope1) && value !== (ope2) && value !== (ope3);
};
///Hàm in ra lỗi khi người dùng nhập 
function evalCatch(e) {
    if (e instanceof SyntaxError) {
        alert("Error! Nhập không hợp lệ.");
        return $("#screen").val("0") && $("#result").val("");
    }
    if (e instanceof TypeError) {
        alert("Error! Nhập không hợp lệ.");
        return $("#screen").val("0") && $("#result").val("");
    }
};
changeSign = function (myScreen) {
    return eval(myScreen + "*(-1)");
};
changePercent = function (myScreen) {
    return eval(myScreen + "/100");
};
function handleCaculator(myScreen, location, catchHandle, isPlusOrMinus = false) {
    let subString;
    subString = myScreen.substring(location, myScreen.length)
    if (catchHandle === "%") {
        subString = changePercent(subString);
    } else if (catchHandle === "+/-") {
        subString = changeSign(subString);
        if (isPlusOrMinus) {
            if (subString > 0 && (areNotOperator(myScreen[location - 1], "x", "÷", "+"))) {
                subString = "+" + subString;
            }
        }
    }
    return $("#screen").val(myScreen.slice(0, location) + subString);
}
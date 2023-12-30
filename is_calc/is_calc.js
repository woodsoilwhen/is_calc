function checkNum(str) {
    for (var i = 0; i < str.length; i++) {
        var ch = str.substring(i, i + 1)
        if (ch != "." && ch != "+" && ch != "-" && ch != "e" && ch != "E" && (ch < "0" || ch > "9")) {
            return false;
        }
    }
    return true;
}


function calc(value, id) {//入口函数、响应输入框的文字更改
    if (checkNum(value)) {
        if (!value) { //当输入框字符全删除后、清空输出框
            document.getElementById("电流").value = "";
            document.getElementById("电流div").className = "未输入";
            document.getElementById("线径").value = "";
            document.getElementById("线径div").className = "未输入";
            document.getElementById("单相功率").value = "";
            document.getElementById("单相功率div").className = "未输入";
            document.getElementById("三相功率").value = "";
            document.getElementById("三相功率div").className = "未输入";
            return;
        }
        switch (id) {
            case "线径":
                var I = I_calc(value, { a: 11.84, m: 0.628, b: 0, n: 0 })
                document.getElementById("线径div").className = "已输入";
                document.getElementById("电流div").className = "显示框";
                document.getElementById("单相功率div").className = "显示框";
                document.getElementById("三相功率div").className = "显示框";
                document.getElementById("电流").value = I;
                document.getElementById("单相功率").value = 220 * I / 1000;
                document.getElementById("三相功率").value = 1.732 * 380 * I / 1000;
                break;
            case "电流":
                var S = S_calc(value, { a: 11.84, m: 0.628, b: 0, n: 0 })
                document.getElementById("电流div").className = "已输入";
                document.getElementById("线径div").className = "显示框";
                document.getElementById("单相功率div").className = "显示框";
                document.getElementById("三相功率div").className = "显示框";
                document.getElementById("线径").value = S;
                document.getElementById("单相功率").value = 220 * value / 1000;
                document.getElementById("三相功率").value = 1.732 * 380 * value / 1000;
                break;
            case "单相功率":
                var I = value * 1000 / 220
                var S = S_calc(I, { a: 11.84, m: 0.628, b: 0, n: 0 })
                document.getElementById("单相功率div").className = "已输入";
                document.getElementById("线径div").className = "显示框";
                document.getElementById("电流div").className = "显示框";
                document.getElementById("三相功率div").className = "显示框";
                document.getElementById("线径").value = S;
                document.getElementById("电流").value = I;
                document.getElementById("三相功率").value = 1.732 * 380 * I / 1000;
                break;
            case "三相功率":
                var I = value * 1000 / 1.732 / 380
                var S = S_calc(I, { a: 11.84, m: 0.628, b: 0, n: 0 })
                document.getElementById("电流div").className = "已输入";
                document.getElementById("线径div").className = "显示框";
                document.getElementById("单相功率div").className = "显示框";
                document.getElementById("三相功率div").className = "显示框";
                document.getElementById("线径").value = S;
                document.getElementById("电流").value = I;
                document.getElementById("单相功率").value = 220 * I / 1000;
                break;
        }
    }
    else {
        alert("请输入有效的数字");
        return;
    }
}

function 载流量计算公式(截面积, 参数) { //I=a*s^m-b*s^n
    var 第一项 = 参数.a * Math.pow(截面积, 参数.m);
    if (参数.b == 0) {
        return 第一项;
    }
    else {
        var 第二项 = 参数.b * Math.pow(截面积, 参数.n);
        return 第一项 - 第二项;
    }
}
function 载流量计算公式一阶导数(截面积, 参数) { //I`=a*m*s^(m-1)-b*n*s^(n-1)
    var 第一项 = 参数.a * 参数.m * Math.pow(截面积, (参数.m - 1));
    if (参数.b == 0) {
        return 第一项;
    }
    else {
        var 第二项 = 参数.b * 参数.n * Math.pow(截面积, (参数.n - 1))
        return 第一项 - 第二项;
    }
}
function 最小截面积计算(电流, 参数) {
    if (参数.b == 0) { // s = (I/a)^(1/m)
        return Math.pow((电流 / 参数.a), (1 / 参数.m));
    }
    else { //使用牛拉法计算
        var 线径 = 1;
        do {
            线径0 = 线径;
            线径 = 线径0 - (载流量计算公式(线径, 参数) - 电流) / 载流量计算公式一阶导数(线径, 参数)
        } while (Math.abs(线径 - 线径0) > 0.1)
        return s;
    }
}

function I_calc(截面积, 参数) { //给定截面积计算载流量
    var i = 载流量计算公式(截面积, 参数);
    if (i < 20) {
        return (2 * i).toFixed() / 2; //对于载流量不超过20A时就近0.5A取整
    } else {
        return i.toFixed(); //大于20A时1A取整
    }
}

function S_calc(电流, 参数) { //给定电流计算最小导线截面积
    var 最小截面积 = 最小截面积计算(电流, 参数);
    var 可选线径 = [0.5, 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300]
    var 线径0 = 可选线径[0];
    for (线径 of 可选线径) {
        if (线径 >= 最小截面积) {
            if (I_calc(线径0, 参数) >= 电流) {
                return 线径0;
            }
            if (I_calc(线径, 参数) >= 电流) {
                return 线径;
            }
            else {
                continue
            }
        }
    }
    return Math.ceil(最小截面积);
}



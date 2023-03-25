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
        if(!value){ //当输入框字符全删除后、清空输出框
            document.getElementById("功率").value = "";
            document.getElementById("功率div").className="未输入";
            document.getElementById("电阻").value = "";
            document.getElementById("电阻div").className="未输入";
            return;
        }
        switch (id) {
            case "电阻":
                var P = P_calc(value)
                document.getElementById("电阻div").className = "已输入";
                document.getElementById("功率div").className = "显示框";
                document.getElementById("功率").value = P;
                break;
            case "功率":
                var R = R_calc(value)
                document.getElementById("功率div").className = "已输入";
                document.getElementById("电阻div").className = "显示框";
                document.getElementById("电阻").value = R;
                break;
        }
    }
    else {
        alert("请输入有效的数字");
        return;
    }
}
function R_calc(功率) { //给定功率计算电阻
    return 290.4/功率;
}

function P_calc(电阻) { //给定电阻计算功率
    return 290.4/电阻;
}


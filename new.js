function checkNum(str) {
    for (let i = 0; i < str.length; i++) {
        let ch = str.substring(i, i + 1)
        if (ch != "." && ch != "+" && ch != "-" && ch != "e" && ch != "E" && (ch < "0" || ch > "9")) {
            return false;
        }
    }
    return true;
}

function 参数(输入框ID, 默认值) {
    let rtn = Object();
    rtn.输入框 = document.getElementById(输入框ID);
    rtn.默认值 = 默认值;

    rtn.存储值 = window.localStorage.getItem(输入框ID) || rtn.默认值;
    rtn.输入框.value = rtn.存储值;
    rtn.当前值 = rtn.输入框.value;

    rtn.恢复默认 = () => { rtn.输入框.value = rtn.默认值; return rtn.默认值; };
    rtn.刷新 = () => { rtn.当前值 = rtn.输入框.value; return rtn.当前值; };
    rtn.保存 = () => { rtn.存储值 = rtn.刷新(); window.localStorage.setItem(输入框ID, rtn.存储值) }
    return rtn;
}

function 保存按钮判断(更多设置参数,按钮ID){
    let 按钮 = document.getElementById(按钮ID)
    for (参数 in 更多设置参数){
        if(参数.当前值 != 参数.存储值){
            
            return true
        }
    }
    return false
}

let 更多设置参数 = Array();

更多设置参数["电压"] = 参数("电压",380);
更多设置参数["误差"] = 参数("误差",10);

console.log("11")
function 恢复默认() {
    电压
}

async function 更多设置键入(value, id) {
    switch (id) {
        case 电压:
            if (value != 电压) {

            }
            break
        case 误差:

            break
    }
}
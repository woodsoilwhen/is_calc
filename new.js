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

    rtn.恢复默认 = () => { rtn.输入框.value = rtn.默认值; rtn.当前值 = rtn.输入框.value; return rtn.默认值; };
    rtn.刷新 = () => { rtn.当前值 = rtn.输入框.value; return rtn.当前值; };
    rtn.保存 = () => { rtn.存储值 = rtn.刷新(); window.localStorage.setItem(输入框ID, rtn.存储值) }
    return rtn;
}

function 保存按钮判断(更多设置参数, 按钮ID) {
    let 按钮 = document.getElementById(按钮ID)
    for (参数 in 更多设置参数) {
        if (更多设置参数[参数].当前值 != 更多设置参数[参数].存储值) {
            按钮.disabled = false
            return false
        }
    }
    按钮.disabled = true
    return true
}

function 恢复默认按钮判断(更多设置参数, 按钮ID) {
    let 按钮 = document.getElementById(按钮ID)
    for (参数 in 更多设置参数) {
        if (更多设置参数[参数].当前值 != 更多设置参数[参数].默认值) {
            按钮.disabled = false
            return false
        }
    }
    按钮.disabled = true
    return true
}

let 更多设置参数 = Object();

更多设置参数.电压 = 参数("电压", 380);
更多设置参数.误差 = 参数("误差", 10);
更多设置参数.保留小数位数 = 参数("保留小数位数", 2);
保存按钮判断(更多设置参数, '保存按钮')
恢复默认按钮判断(更多设置参数, '恢复默认按钮')
console.log("11")
function 恢复默认() {
    电压
}

function 更多设置键入(value, id) {
    switch (id) {
        case "电压":
            更多设置参数["电压"].刷新()
            保存按钮判断(更多设置参数, "保存按钮")
            恢复默认按钮判断(更多设置参数, '恢复默认按钮')
            break
        case "误差":
            更多设置参数["误差"].刷新()
            保存按钮判断(更多设置参数, "保存按钮")
            恢复默认按钮判断(更多设置参数, '恢复默认按钮')
            break
        case "保留小数位数":
            更多设置参数["保留小数位数"].刷新()
            保存按钮判断(更多设置参数, "保存按钮")
            恢复默认按钮判断(更多设置参数, '恢复默认按钮')
            break
    }
}
function 保存() {
    for (参数 in 更多设置参数) {
        更多设置参数[参数].保存()
    }
    保存按钮判断(更多设置参数, '保存按钮')
}
function 恢复默认() {
    for (参数 in 更多设置参数) {
        更多设置参数[参数].恢复默认()
    }
    恢复默认按钮判断(更多设置参数, '恢复默认按钮')
}

class 参数原型 {
    constructor(输入框ID, 默认值, 存储值) {
        this.输入框 = document.getElementById(输入框ID)
        this.默认值 = 默认值
        this.存储值 = 存储值
    }
}

class 设置列表 {
    constructor(参数列表, 存储键) {
        this.参数列表 = 参数列表
        this.存储列表 = JSON.parse(window.localStorage.getItem(存储键))
        if (this.存储列表 == null) {
            let JSON_参数列表=JSON.stringify(this.参数列表)
            this.存储列表 = JSON.parse(JSON_参数列表)
            window.localStorage.setItem(存储键,JSON_参数列表)
        }

        for (参数 in this.参数列表) {
            this[参数] = new 参数原型(参数, this.参数列表[参数], this.存储列表[参数])
        }
    }

    刷新存储列表(){
        
    }

    恢复默认(){
    }
    撤销修改(){
    }
    保存(){
        
    }

}
let 更多设置 = new 设置列表({ "电压": 380, "误差": 10, "保留小数位数": 2 }, "更多设置")
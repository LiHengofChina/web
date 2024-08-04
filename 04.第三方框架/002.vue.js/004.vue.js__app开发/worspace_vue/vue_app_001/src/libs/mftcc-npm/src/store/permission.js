import store from '../store'

// 用来控制按钮的显示
export function hasBtnPermission(permission) {
    if(permission === true || permission === undefined || permission === ''){
        return true;
    }
    const myBtns = store.getters.buttons;
    let btnFlag = false;
    for(let i in myBtns){
        if(myBtns[i] === permission){
            btnFlag = true;
        }
    }
    return btnFlag;
}
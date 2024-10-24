class Num {
    constructor() {
        this.InputCustomNum = document.getElementById('InputCustomNum');
        this.InputNum = document.getElementById('InputNum');
        this.CustomNum = "0";
        this.digitCnt = 0;
        this.addEvent();
        this.NumArr = [];
        this.status = {keyCnt : 0, wordCnt : 0};
    }

    addEvent(){
        this.InputCustomNum.addEventListener('change',()=>{this.InputCustomNumEvent()});
        this.InputNum.addEventListener('input',(e)=>{this.InputNumCheck(e.target.value)});
    }

    setup(){
        for(let i=0;i<20;i++){
            this.addNumber();
        }
        display.NumArea(this.NumArr);
    }

    addNumber(){
        const ran = this.randomNumber();
        this.NumArr.push(ran);
        this.NumArr.push(' ');
    }

    InputCustomNumEvent(){
        this.customNumber();
        this.setup();
        timer.start();
        display.time(true);//インターバル起動
    }

    customNumber(){
        this.CustomNum = String(this.InputCustomNum.value);
        this.digitCnt = this.CustomNum.length;
    }

    randomNumber(){
        let number = "";
        for(let i=0;i<this.digitCnt;i++){
            number += Math.floor(Math.random() * 10);
        };
        return number;
    }

    InputNumCheck(n){
        if(!this.isCustomNumMatch){
            this.status.keyCnt++;
            this.isMatch = (n == this.NumArr[0]) ? true : false;
            
            if(this.isMatch){
                if(this.NumArr[0] == this.CustomNum){
                    //Custom数字が一致した時
                    timer.stop();
                    this.NumArr = [];
                    this.isCustomNumMatch = true;
                }
                else if(n != ' '){
                    this.status.wordCnt++;
                    this.addNumber();//新しい数字を追加
                }
                this.NumArr.shift();
                display.NumArea(this.NumArr);
                this.InputNum.value = '';
            }
            display.status(this.status);
        }
    }
}



class Display {
    constructor() {
        this.words_td = document.querySelector('.words_td');
        this.keys_td = document.querySelector('.keys_td');
        this.currentTime_td = document.querySelector('.currentTime_td');
        this.displayNumArea = document.getElementById('displayNumArea');
    }

    NumArea(NumArr){
        const typeText = NumArr.join('').replaceAll(' ','&nbsp;');
        this.displayNumArea.innerHTML = typeText;
    }

    status(statusObj){
        this.keys_td.textContent = statusObj.keyCnt;
        this.words_td.textContent = statusObj.wordCnt;
    }

    time(s){
        if(s){
            this.interval = setInterval(()=>{
                this.currentTime_td.textContent = timer.getTime('00:00');
            },100);
        }else{
            clearInterval(this.interval);
        }
    }
}


class Timer{
    constructor(){
        this.currentTime = 0;
        this.startTime = 0;
        this.is_running = false;
        this.interimTime = 0;
    }

    floor(format){
        const x = 10 ** format;
        return Math.floor(this.currentTime / x) * x;
    }

    getTime(format){
        if(format === 'normal'){
            return this.currentTime;
        } else if(Number.isInteger(format)){
            return this.floor(format);
        } else if(format === '00:00'){
            const n = this.floor(3) / 1000;
            const mm = Math.floor(n / 60);
            const ss = Math.floor(n % 60);
            return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
        } else if(format === '00:00:00'){
            const n = this.floor(2)/1000;
            const mm = Math.floor(n / 60);
            const ss = Math.floor(n % 60);
            const xx = Math.floor((n % 60 - ss) * 10);
            return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}:${String(xx).padStart(1, '0')}`;
        }
        return null;
    }

    getCurrentTime(){
        this.TimeInterval = setInterval(()=>{
            this.currentTime = (new Date().getTime() - this.startTime) + this.interimTime;
        },10);
    }

    start(){
        if(this.is_running === false){
            this.is_running = true;
            this.startTime = new Date().getTime();
            this.getCurrentTime();
        }
    }

    stop(){
        if(this.is_running){
            this.is_running = false;
            this.interimTime = this.getTime('normal');
            clearInterval(this.TimeInterval);
        }
    }

    reset(){
        this.interimTime = 0;
        this.currentTime = 0;
        if(this.is_running){
            clearInterval(this.TimeInterval);
            this.is_running = false;
        }
    }
}

const num = new Num();
const display = new Display();
const timer = new Timer();
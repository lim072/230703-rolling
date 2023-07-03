const frame = document.querySelector('#visual');
const panels = frame.querySelectorAll(".panel li");
const btns = frame.querySelectorAll(".btns li");
const btnPlay = frame.querySelector(".fa-play");
const btnStop = frame.querySelector(".fa-stop");
const bar = frame.querySelector(".bar");

const interval = 5000;
const len = panels.length - 1;
let num = 0; //전역변수에서 사용될 인덱스
let timer = null;

//초기 자동실행을 위해서
startRolling();
btns.forEach((el, index) => {
    el.addEventListener("click", () => {
        activation(index);
        stopRolling();
    })
})

// btnPlay.addEventListener("click", startRolling);
//play버튼이 활성화 되어있을때는 return으로 클릭을 막고 
//그렇지 않을때는 startRolling을 진행함
btnPlay.addEventListener("click", (e) => {
    if (e.target.classList.contains("on")) {
        return;
    } else {
        startRolling()
    }
});
/*
콜백함수 자리에 함수 이름 자체만 사용되어있음
버튼을 클릭했을때 함수를 호출해서 동작이 되게함
*/

/*
btnPlay.addEventListener("click", startRolling())

콜백함수 자리에 함수를 호출한 결과값이 적혀있는것 
버튼을 클릭했을때 함수의 결과값을 이벤트 리스너에 전달하고자 한다는 
일번적으로 쓰지 않습니다.
*/

btnStop.addEventListener("click", stopRolling);


function startRolling() {
    //진행바를 보이게 함
    bar.style.display = "block";

    setTimeout(progress, 0);
    //비동기 실행을 위해서, setTimeout을 사용하되, 0초내로

    //활성화 함수 호출로 롤링이 시작
    activation(num);

    //지정한 시간에 맞춰서 rolling함수를 호출해야합니다
    timer = setInterval(rolling, interval)

    btnPlay.classList.add('on');
    btnStop.classList.remove('on');

}
function stopRolling() {
    //진행바를 보이지 않게함
    bar.style.display = "none";


    //setInterval을 클리어하는 코딩
    clearInterval(timer)

    btnPlay.classList.remove('on');
    btnStop.classList.add('on');
}

//버튼과 패널을 활성화 시키는 기능
function activation(index) {
    //모든 panels와 btns의 on을 지우고
    for (let el of panels) el.classList.remove("on")
    for (let el of btns) el.classList.remove("on")
    //해당순번에 on을 붙임
    panels[index].classList.add("on");
    btns[index].classList.add("on");
    num = index;
    //인수로 전달받은 순번을 전역 변수로 순번 갱신해줘야한다
    //왜냐하면 activation함수는 이곳뿐아니라 rolling에서도 호출되며
    //rolling에서 변경되기 때문에 싱크를 맞춰야 합니다. 
    //패널이 활성화 될때 bar의 너비를 초기화하는 코드
    bar.style.width = "0%";
}


//롤링을 종합적으로 진행하게하는 기능, 자동롤링기능의 핵심
function rolling() {
    if (num < len) {
        num++;
    } else {
        num = 0;
    }
    activation(num);
    progress();
}




//bar로 진행상황을 보여주는 기능
function progress() {
    const init = parseInt(bar.style.width) || 0; //parseInt 정수값으로 바꿔줌 Int는 정수
    const targetValue = 100;
    const unit = '%';
    const startTime = performance.now(); //처음 로드가 되는 시간과 함수가 실행하는 시간의 값

    function animate(time) {
        const realTime = time - startTime;
        const prog = realTime / interval;
        const currentValus = init + ((targetValue - init) * prog);

        bar.style.width = `${currentValus}${unit}`

        if (prog < 1) {
            requestAnimationFrame(animate);

        } else {
            bar.style.width = "0%";
            if (typeof callback === "function") callback();
        };
    }
    requestAnimationFrame(animate);

}
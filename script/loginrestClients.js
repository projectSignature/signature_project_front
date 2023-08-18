
let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先
let user
let password
let errormessage
let menbername = sessionStorage.getItem("name")
let language = sessionStorage.getItem("language")

language=1

/////////////////////////////////////テキスト翻訳///////////////////////////////////////
let txt0 = ["打刻","Bater ponto"]
let txt1 = ["収支管理","Controle financeiro"]
let txt2 = ["メニュー","Menu"]
let txt3 = ["財布管理","Carteira"]
let txt4 = ["レジ","Caixa"]

document.getElementById("txt0").innerText = txt0[language]
document.getElementById("txt1").innerText = txt1[language]
document.getElementById("txt2").innerText = txt2[language]
document.getElementById("txt3").innerText = txt3[language]
document.getElementById("txt4").innerText = txt4[language]

//////////////////////////////////////////////////////////////////////////////////////


console.log(menbername)
console.log(language)
document.getElementById('name-span').innerText = menbername

console.log('in')
 function kubun1(data){
  console.log(data)
}

function swallErrorOpen(data) {
  Swal.fire({
    icon: 'warning',
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: 'back',
    width: 500,
    html: `<span>${data}</span>`,
    customClass: "sweet-alert",
  }).then((result) => {

  });
}

//time_regist_swall()
function time_regist_swall(){
   let row = `
   <div id="time-regist-point-day"></div>
   <div id="time-regist-point-time"></div>
   <div class="button-input-regist-div">
    <div class="button-input-regist" style="background-color:#D0FF43" onclick="swallErrorOpen('準備中、すまん')">出勤</div>
    <div class="button-input-regist" style="background-color:#9057FF" onclick="swallErrorOpen('準備中、すまん')">退勤</div>
   </div>
   <style>
   .swal2-popup {
       width: 90% !important;
       height: 600px !important;
   }
   @media only screen and (max-width: 800px) {
     .swal2-popup {
       height: 480px !important;
     }
   </style>`
   swallopen(row)
}

function pagechange(data){
  window.location = `./${data}.html`;
}

function swallopen(row) {
console.log(row)
  Swal.fire({
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: 'back',
    width: 500,
    html: row
  }).then((result) => {
    if (result.isConfirmed) {
    }else{
      clearInterval()
    }
  });
  timeandday()
  //registSwall()
}

function registSwall(){
  let date =new Date();
  var d1 = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2)
  document.getElementById('time-regist-point-day').innerText = d1
}

function timeandday(){
  // ゼロ埋めして2桁の数値にする
            const zero = n => (n < 10 ) ? "0" + n.toString() : n.toString();

            // 日付の文字列化
            const youbi = ["日","月","火","水","木","金","土"];
            const getDateString = date =>
                `${ date.getFullYear() }年 ${ zero(date.getMonth() + 1) }月  ${ zero(date.getDate()) }日 ${ youbi[date.getDay()] }曜日`;

            // 時間の文字列化
            const getHourString = date =>
                `${ zero(date.getHours()) }: ${ zero(date.getMinutes()) }: ${ zero(date.getSeconds()) }`;

            // DOMの構築を待つ
            //window.addEventListener('DOMContentLoaded',()=> {
                const dateDiv = document.getElementById("time-regist-point-day");
                const clockDiv = document.getElementById("time-regist-point-time");
                let nowDate = null;
                setInterval( ()=>{
                    const now = new Date();
                    if( nowDate !== now.getDate() ) {
                        nowDate = now.getDate();
                        dateDiv.innerText = getDateString(now);
                    }
                    clockDiv.innerText = getHourString(now);
                },1000);
            //});
}

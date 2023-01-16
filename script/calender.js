//document.getElementById("img2").addEventListener("click", swallopen1)
//document.getElementById("img").addEventListener("click", swallopen2)
document.querySelector('#gym-name').innerHTML = sessionStorage.getItem("gym");

let gymid = 4
let monArray = []
let tueArray = []
let wedArray = []
let thiArray = []
let friArray = []
let satArray = []
let sunArray = []
const weekdays = ["calender-mond","calender-tue","calender-wed","calender-thir","calender-fri","calender-sat","calender-sun"]
const language = ["PT","EN","JP"]
const stext1 = ["sim","yes","はい"]
const stext2 = ["não","no","いいえ"]
const stext3 = ["Horário inicial","Start time","開始時間"]
const stext4 = ["Horário final","Final time","終了時間"]
const stext5 = ["Descrição 1","Description 1","説明1"]
const stext6 = ["Descrição 2","Description 2","説明2"]
const stext7 = ["Cor","color","カラー"]
const stext8 = ["Graduar","Graduate","昇格"]
const stext9 = ["Dia","Day","曜日"]
const stext10 = ["Linha","Line","行番号"]
const stext11 = ["Confirmar","Confirm","変更する"]
const stext12 = ["Voltar","Back","戻る"]
const stext13 = ["Calendário atual","Current calender","現在のカレンダー"]
const stext14=["Alteração foi feita com sucesso","Change was successfully made","変更が完了しました"]
const stext15=["Pronto","Success","完了"]
const stext16=["Alterar calendário","Update calender","カレンダーの変更"]
var my_language = 0
document.getElementById('calendar-title').innerHTML = stext13[my_language]
proccesing_swal()
getDados();
const mediaQuery = window.matchMedia('(max-width: 1200px)')
mediaQuery.addListener(handleTabletChange)
handleTabletChange(mediaQuery)
function handleTabletChange(e) {
  if (e.matches) {
    document.getElementById("span-mon").innerHTML = " Mon"
    document.getElementById("span-tue").innerHTML = " Tue"
    document.getElementById("span-wed").innerHTML = " Wed"
    document.getElementById("span-thu").innerHTML = " Thu"
    document.getElementById("span-fri").innerHTML = " Fri"
    document.getElementById("span-sat").innerHTML = " Sat"
    document.getElementById("span-sun").innerHTML = " Sun"

  }else{
    document.getElementById("span-mon").innerHTML = "Monday"
    document.getElementById("span-tue").innerHTML = "Tuesday"
    document.getElementById("span-wed").innerHTML = "Wednesday"
    document.getElementById("span-thu").innerHTML = "Thursday"
    document.getElementById("span-fri").innerHTML = "Friday"
    document.getElementById("span-sat").innerHTML = "Saturday"
    document.getElementById("span-sun").innerHTML = "Sunday"
  }
}

//mediaQuery.addListener(handleTabletChange)
//handleTabletChange(mediaQuery)

//função de load e reload de dados.

function getDados() {
    fetch('https://squid-app-ug7x6.ondigitalocean.app/calenderteste')
        .then((x) => x.json())
        .then((res) => {
            for(let i=0;i<res.length;i++){
              if(gymid==res[i].GYM_ID){
                calender_div_rows(res[i])
              }
            }
            create_calender_row()
        });
};
//曜日別にArrayを作成
function calender_div_rows(data){
  if(data.DAY=="monday"){
    monArray.push(data)
  }else if(data.DAY=="tuesday"){
    tueArray.push(data)
  }else if(data.DAY=="wednesday"){
    wedArray.push(data)
  }else if(data.DAY=="thursday"){
    thiArray.push(data)
  }else if(data.DAY=="friday"){
    friArray.push(data)
  }else if(data.DAY=="saturday"){
    satArray.push(data)
  }else if(data.DAY=="sunday"){
    sunArray.push(data)
  }
}

function create_calender_row(){
  monArray.sort(function(me, you) {
  return me['LINE_NO'] - you['LINE_NO'];});
  tueArray.sort(function(me, you) {
  return me['LINE_NO'] - you['LINE_NO'];});
  wedArray.sort(function(me, you) {
  return me['LINE_NO'] - you['LINE_NO'];});
  thiArray.sort(function(me, you) {
  return me['LINE_NO'] - you['LINE_NO'];});
  friArray.sort(function(me, you) {
  return me['LINE_NO'] - you['LINE_NO'];});
  satArray.sort(function(me, you) {
  return me['LINE_NO'] - you['LINE_NO'];});
  sunArray.sort(function(me, you) {
  return me['LINE_NO'] - you['LINE_NO'];});
for(let i=0;i<=6;i++){
  if(i==0){
    calender_row_create_inner(monArray,"calender-mond","monday")
  }else if(i==1){
    calender_row_create_inner(tueArray,"calender-tue","tuesday")
  }else if(i==2){
    calender_row_create_inner(wedArray,"calender-wed","wednesday")
  }else if(i==3){
    calender_row_create_inner(thiArray,"calender-thir","thursday")
  }else if(i==4){
    calender_row_create_inner(friArray,"calender-fri","friday")
  }else if(i==5){
    calender_row_create_inner(satArray,"calender-sat","saturday")
  }else if(i==6){
    calender_row_create_inner(sunArray,"calender-sun","sunday")
  }
}
}
function calender_row_create_inner(data,weekday,myday){
  for(let i=0;i<data.length;i++){
    if(data[i].START_TIME!=""){
       if(data[i].COLOR=="black" || data[i].COLOR=="red"||data[i].COLOR=="purple"){
         color = "white"
       }else{
         color = "#222222"
       }
       console.log(color)
      let row = `<div class="calender-div-block-height"
                      onclick="editClient('${myday}_${i}_${data[i].START_TIME}_${data[i].FINISH_TIME}_${data[i].DESCRITION_1}_${data[i].DESCRITION_2}_${data[i].COLOR}_${data[i].GRADUATION_FLUG}')">
                  <div class="style-div-title-calender"  style="background-color:${data[i].COLOR}; color:${color}">
                   <p>${data[i].START_TIME}~${data[i].FINISH_TIME}</p>
                  </div>
                  <div  class="calender-discrition">
                   <div class="disctrion-a"><a>${data[i].DESCRITION_1}</a></div>
                   <div class="disctrion-a"><a>${data[i].DESCRITION_2}</a></div>
                  </div>
                 </div>`
      document.getElementById(weekday).innerHTML += row
    }else{
      let row = `<div class="calender-div-block-height"
                      onclick="editClient('${myday}_${i}_${data[i].START_TIME}_${data[i].FINISH_TIME}_${data[i].DESCRITION_1}_${data[i].DESCRITION_2}_${data[i].COLOR}_${data[i].GRADUATION_FLUG}')">
                   <div class="style-div-title-calender"">
                   <p></p>
                  </div>
                  <div  class="calender-discrition">
                    <div><a></a></div>
                    <div><a></a></div>
                  </div>
                 </div>`
      document.getElementById(weekday).innerHTML += row
    }
  }
}


function swallopen2() {
    Swal.fire({
        title: 'Enviar calendário ',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        width: 500,
        customClass: "sweet-alert-acess",
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                title: "Enviando...",
                didOpen: () => { Swal.showLoading() }
            });

            fetch('https://squid-app-ug7x6.ondigitalocean.app/pdf/calender')
                .then((x) => x.json())
                .then((res) => {
                    if (res) {
                        Swal.fire({
                            icon: "success",
                            title: 'concluido!',
                            didOpen: () => { Swal.hideLoading() }
                        });
                    };
                }).catch((err) => {
                    Swal.fire({
                        icon: "error",
                        title: 'Não concluído!',
                    });
                    console.log(err)
                })
        };
    });
};
function editClient(data) {
  console.log(data.split("_")[7])
  if(data.split("_")[7]==0){
    graduationFlug = stext2[my_language]
  }else{
    graduationFlug = stext1[my_language]
  }
    Swal.fire({
        html: `
        <div id='swall-title-div'>
            <h1 id='swal-title'>${stext16[my_language]}</h1>
            <div class="container">
                <input id="toggle1" type="checkbox" >
                <label for="toggle1">Deletar</label>
            </div>
        </div>

        <div id='swal-maindiv'>
          <div id='swall-select' class='swall-div-class'>
              <h2 class='swall-sub-title'>${stext9[my_language]}</h2>
              <select id='days' class='input'>
                  <option value="${data.split("_")[0]}">${data.split("_")[0]}</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
              </select>
          </div>
          <div id='swall-select' class='swall-div-class'>
              <h2 class='swall-sub-title'>${stext10[my_language]}</h2>
              <select id='line' class='input'>
                  <option value="${(data.split("_")[1]-0)+1}" selected>${(data.split("_")[1]-0)+1}</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
              </select>
          </div>
          <div id='swall-select' class='swall-div-class'>
              <h2 class='swall-sub-title'>${stext3[my_language]}</h2>
              <input type='time' id='swall-input-time1' class='input'  value="${data.split("_")[2]}" />
          </div>
          <div id='swall-select' class='swall-div-class'>
              <h2 class='swall-sub-title'>${stext4[my_language]}</h2>
              <input type='time' id='swall-input-time2' class='input' value="${data.split("_")[3]}" />
          </div>
          <div id='swall-select' class='swall-div-class'>
              <h2 class='swall-sub-title'>${stext5[my_language]}</h2>
              <textarea id='input1' class='input'>${data.split("_")[4]}</textarea>
          </div>
          <div id='swall-select' class='swall-div-class'>
              <h2 class='swall-sub-title'>${stext6[my_language]}</h2>
              <textarea id='input2' class='input' value="">${data.split("_")[5]}</textarea>
          </div>
          <div id='swall-select' class='swall-div-class'>
              <h2 class='swall-sub-title'>${stext7[my_language]}</h2>
              <select id="color" class='input'>
                  <option value="${data.split("_")[6]}" selected>${data.split("_")[6]}</option>
                  <option value="blue">blue</option>
                  <option value="green">green</option>
                  <option value="red">red</option>
                  <option value="yellow">yellow</option>
                  <option value="gray">gray</option>
                  <option value="pink">pink</option>
                  <option value="black">black</option>
                  <option value="white">white</option>
                  <option value="purple">purple</option>
              </select>
          </div>
          <div id='swall-select' class='swall-div-class'>
              <h2 class='swall-sub-title'>${stext8[my_language]}</h2>
              <select id="kimono-selected" class='input'>
              <option value="${data.split("_")[7]}" selectd="selected">${graduationFlug}</option>
                  <option value="1">${stext1[my_language]}</option>
                  <option value="0">${stext2[my_language]}</option>
              </select>
          </div>
        </div>
      <style>
          * {
              font-family: sans-serif;
          }

          #swal-maindiv {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: center;
          }
          #swal-maindiv div {
              width: 49%;
          }
          .input {
              width: 60%;
              height: 5vh;
              border-radius: 10px;
              border: 1px solid gray;
              text-align: center;
              transition: 0.5s;
              outline: none;
              cursor: pointer;
              font-size: 1.5vw;
          }
          .input:focus {
              width: 65%;
              height: 7vh;
          }
          .input:hover {
              background-color: rgb(243, 242, 242);
              box-shadow: 1px 1px 4px 0px black;
          }
          input[type="file"] {
              display: none;
          }
          label {
              padding: 10px 10px;
              width: 49%;
              border-radius: 10px;
              background-color: #333;
              color: #FFF;
              text-transform: uppercase;
              text-align: center;
              display: block;
              margin-top: 15px;
              margin-left: 100px;
              cursor: pointer;
          }
          .swall-deleyte-buttom{
            display:flex;
          }
          .container{

            width:40%;
            height:50%;
            display:flex;
            justify-content: flex-start;
          }
          #swall-title-div{
            display:flex;
          }
          #swal-title{
              width:60%;
          }

          @media only screen and (max-width: 600px) {
              #swal-maindiv {
                  flex-direction: column;
              }

              #swal-maindiv div {
                  width: 100%;
              }

              .input {
                  font-size: 1em;
                  width: 80%;
              }
              #swall-title-div{
                display:block;
              }
              #swall-title-div h1{
                width:100%;
                font-size:6vw;
              }
          }
      </style>
     </div>`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: stext11[my_language],
        cancelButtonText: stext12[my_language],
        width: 900,
        allowOutsideClick : false
    }).then(result => {
        if (result.isConfirmed) {
              if(document.getElementById("toggle1").checked){
                const objSwal = {
                    day: document.querySelector('#days').value,
                    line: document.querySelector('#line').value,
                    start: "",
                    end: "",
                    desc1: "",
                    desc2: "",
                    cor: "white",
                    img: 0
                }
                       update(objSwal)
              }else{
                const objSwal = {
                    day: document.querySelector('#days').value,
                    line: document.querySelector('#line').value,
                    start: document.querySelector('#swall-input-time1').value,
                    end: document.querySelector('#swall-input-time2').value,
                    desc1: document.querySelector('#input1').value,
                    desc2: document.querySelector('#input2').value,
                    cor: document.querySelector('#color').value,
                    flug: document.querySelector('#kimono-selected').value

                }
                    update(objSwal)
              }

          }else{
            swal.close()
          }
        })
};




async function update(obj) {
    const up = {
        GYM: gymid,
        DAY: obj.day,
        START: obj.start,
        FINISH: obj.end,
        LINE: obj.line,
        DESC1: obj.desc1,
        DESC2: obj.desc2,
        IMG: 0,
        flug: obj.flug,
        COLOR: obj.cor,
    };

    fetch('https://squid-app-ug7x6.ondigitalocean.app/calender', {
        method: 'PUT',
        body: JSON.stringify(up),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then((x) => x.json())
        .then((response) => {
          monArray = []
          tueArray = []
          wedArray = []
          thiArray = []
          friArray = []
          satArray = []
          sunArray = []
          for(let i=0;i<7;i++){
            document.getElementById(weekdays[i]).innerHTML = ''
          }
            getDados();
            swall_success()
        });

};

//メッセージ関係---------------------------------＞
function proccesing_swal(){
  Swal.fire({
    icon:"info",
    title: 'Processing'
  , html: 'Wait'
  , allowOutsideClick : false
  , showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  , onBeforeOpen: () => {
      Swal.showLoading();
    }
  });
}
function swall_success(){
 Swal.fire({
 title: stext14[my_language]
, html : stext15[my_language]
, icon : 'success'
, timer : '1500'
});
   }

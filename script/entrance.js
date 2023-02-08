

windowLoadGt()
async function windowLoadGt(){
  var token = sessionStorage.getItem("token");//token
  let gymid = sessionStorage.getItem("GYM_ID")
  console.log(token)
  console.log(gymid)
  //gymid=4
  if (token==null||token="") {
    window.location = `https://squid-app-ug7x6.ondigitalocean.app/signature-project-front`
  }else{
    const swal =  Swal.fire({
            icon:"info",
            title: 'Processing',
            html: 'Wait',
            allowOutsideClick : false,
            showConfirmButton: false,
            timerProgressBar: true,
            onBeforeOpen: () => {
            Swal.showLoading();
        }
      })

     document.querySelector('#gym-name').innerHTML = sessionStorage.getItem("gym");//gymname
    const res =  await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/calender/gymentrance?id=${gymid}`)
    await classesHandler_today(res)
    await sessionStorage.removeItem("token")
    swal.close()
  }

}

async function makerequest(url){
  const request = await fetch(url)  //esperar aqui
 return request.json()
}

//カレンダーのcardを作成
let clientes = []
function classesHandler_today(classes) {
  clientes = classes
  for(let index=0;index<classes.length;index++){
     if (classes[index].DESCRITION_1 != '') {
       row=`
       <div class="content-finish" id="card${index}" onclick="entrance_regist(${index})">
           <span class="contentText-finished" name="desc1" id="discrition${index}" >${classes[index].DESCRITION_1}</span>
           <span class="contentText-finished" name="desc2" id="subdiscrition${index}" >${classes[index].DESCRITION_2}</span>
           <span class="contentTimeText-coming-next" disabled="disable" id="starttime${index}" >Start at ${classes[index].START_TIME}</span>
           <span class="contentText-finished-time"   id="finishtime${index}">finished at ${classes[index].FINISH_TIME}</span>
           </div>
           `
           cards.innerHTML += row
     }
  }
}
//ページ更新
document.getElementById("refresh").addEventListener('click',()=>{
  window.location.reload()
})
//スライド移動
assignEventsInButtons()
function assignEventsInButtons() {
  document.getElementById('next').addEventListener('click', nextSlide)
  document.getElementById('previous').addEventListener('click', previousSlide)
}
function nextSlide() {
  cards.scrollLeft += 1300
}
function previousSlide() {
  cards.scrollLeft -= 1300
}

function input_regist(data) {
  input_length_count()
  document.getElementById('keys_entrance').value += data
}
function input_clear() {
  document.getElementById('keys_entrance').value = ""
}
function input_back() {
  swal.close()
}

function input_length_count() {
  var str = document.getElementById('keys_entrance').value
  if (str.length == 4) {
    errormessage = 'パスワードは4桁で入力してください'
    swallerror(errormessage)
  }

}

function swallerror(errormessage) {
  Swal.fire({
    title: 'エラー',
    icon: 'warning',
    showCancelButton: false,
    showConfirmButton: true,
    ConfirmButtonText: '戻る',
    width: 300,
    html: `<span>${errormessage}</span>`,
    customClass: "sweet-alert",
  }).then((result) => {
    if (result.isConfirmed) {
      addClient_again(swall_add_existentes)
    }
  });
}

//tratamento do registro de aula
function entrance_regist(number) {
  Swal.fire({
    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonText: 'OK',
    customClass: 'customizable',
    html: `
      <div id="title">Digiti sua senha</div>
      <div id="pass-div"><input type="password" id="keys_entrance" hiden/></div>
      <div id="main-div">
       <div id="first-row" class="swall-row">
         <div id="en1" class="number-div" onclick="input_regist(1)">1</div>
         <div id="en2" class="number-div" onclick="input_regist(2)">2</div>
         <div id="en3" class="number-div" onclick="input_regist(3)">3</div>
       </div>
       <div id="second-row" class="swall-row">
         <div id="en4" class="number-div" onclick="input_regist(4)">4</div>
         <div id="en5" class="number-div" onclick="input_regist(5)">5</div>
         <div id="en6" class="number-div" onclick="input_regist(6)">6</div>
       </div>
       <div id="third-row" class="swall-row">
         <div id="en7" class="number-div" onclick="input_regist(7)">7</div>
         <div id="en8" class="number-div" onclick="input_regist(8)">8</div>
         <div id="en9" class="number-div" onclick="input_regist(9)">9</div>
       </div>
       <div id="fourth-row" class="swall-row">
         <div id="en0" class="number-div" onclick="input_regist(0)">0</div>
         <div id="clear" class="number-div" onclick="input_clear()">Clear</div>
         <div id="en11" class="number-div" onclick="input_back()">←</div>
       </div>
      </div>
          <style>
          #pass-div{
            height:80px;
          }
          #main-div{
            width:95%;
            height:400px;
            overflow:hidden;
          }
          #title{
            font-size:5vh;
            padding-left:3%;
          }
        .swall-row{
            display:flex;
            height:22%;
            margin-top:3px;
          }
          .number-div{
            border: 1px solid gray;
            margin-right:1%;
            width:30%;
            height:95%;
            font-size:6vh;
            text-align: center;
          }
          #keys_entrance{
            height:90%;
            width:90%;
            border-radius: 3%;
            font-size:3vw;
          }
          #en1{
      margin-left:8%;
          }
          #en4{
      margin-left:8%;
          }
          #en7{
      margin-left:8%;
          }
          #en0{
      margin-left:8%;
          }
          .customizable button {
            margin-top:0px  !important;
            font-size: 5vh  !important;
            width: 250px !important;
            height: 100px !important;
          }

          #fourth-row{
            margin-bottom:0px;
          }

@media only screen and (max-width: 1200px) {
  #clear{
    font-size:4vh;
  }

}

@media only screen and (max-width: 700px) {
  #title{
    font-size:3vh;
  }
  #clear{
    font-size:3vh;
  }

  .customizable button {
    font-size: 3vh  !important;
    width: 150px !important;
    height: 800px !important;
  }

}
          </style>`
    ,
    customClass: 'customizable',
  }).then((result) => {
    if (result.isConfirmed) {
      var password = document.querySelector('#keys_entrance').value;
      fetch('https://squid-app-ug7x6.ondigitalocean.app/pass', {
        method: 'POST',
        body: JSON.stringify({ pass: password }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      })
        .then((x) => x.json())
        .then((res) => {
          if (res.length==1) {
            Swal.fire({
              title: 'Registrando!',
              didOpen: () => { Swal.showLoading() }
            })
            localStorage.setItem('id', res[0].id);
            localStorage.setItem('GYM_ID', res[0].gymid);
            addEntrance(number);
            entrance_count(res[0].id);
          }else if(res.length>1){
            localStorage.setItem('GYM_ID', res[0].gymid);
            selectmember(res,number)
          } else {
            Swal.fire({
              icon: "error",
              title: 'password invalid!',
              didOpen: () => { Swal.hideLoading() }
            });
          }
        });

    };
  });
};
function selectmember(res,number){
  swal.close()
  let namerow =[]
  for(let i=0;i<res.length;i++){
    namerow +=`
    <div><input class="nameinput" value="${res[i].nm_member}" onclick="addentrancMult('${res[i].id}_${number}')"/><div>
    `
  }
  Swal.fire({
    icon: "info",
    title: 'Select name',
    showConfirmButton:false,

    html:`${namerow}
    <style>
    input{
        background-color: #00BFFF;
        color:white;
          cursor: pointer;
      width:70% !important;
      height:70px !important;
      font-size:4vw;
      margin-top:10px;
      border-radius:50px;
      text-align: center;
    }
    </style>`
  });
}

function addentrancMult(data){
  Swal.fire({
    title: 'Registrando!',
    didOpen: () => { Swal.showLoading() }
  })
  localStorage.setItem('id', data.split("_")[1]);
  addEntrance(data.split("_")[1]);
  entrance_count(data.split("_")[0]);
}

function entrance_count(data){
  fetch("https://squid-app-ug7x6.ondigitalocean.app/graduationlist", {
    method: "POST",
    body: JSON.stringify({ opt1: "", opt2: "" }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((x) => x.json())
    .then((res) => {
      clients1 = res;
      for (let index = 0; index < clients1.length; index++) {
        if(clients1[index].nm_member_id==data){
          let obj = {
            id: clients1[index].nm_member_id,
            lesson_after: (clients1[index].lesson_after -0) + 1
          };
          const attr = {
            method: "POST",
            body: JSON.stringify(obj),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          };
          fetch("https://squid-app-ug7x6.ondigitalocean.app/graduationafter", attr)
            .then((x) => x.json())
            .then((response) => {
              fetch(`https://squid-app-ug7x6.ondigitalocean.app/lesson_after/${obj.id}`)//verificar o email
            });
        }
      }
    ;
    });
}
//const date = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
const date = new Date()
const japanweekeday = date.getDay()
var d1 = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + '.' + date.getMilliseconds();

function addEntrance(number) {
  var starttime = clientes[number].START_TIME
  var finishtime = clientes[number].FINISH_TIME
  const date = new Date()
  const japanweekeday = date.getDay()
  var d1 = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + '.' + date.getMilliseconds();
  var obj = {
    LESSON_NAME: document.getElementById(`discrition${number}`).innerHTML + "_" + document.getElementById(`subdiscrition${number}`).innerHTML,
    LESSON_HOUR: starttime +"~"+finishtime,
    MEMBER_ID: localStorage.getItem('id'),
    GYM_ID: localStorage.getItem('GYM_ID'),
    LESSON_DATE: d1,
    LESSON_DAY:japanweekeday
  }
  console.log(obj)
  fetch('https://squid-app-ug7x6.ondigitalocean.app/registerentrance', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then((x) => x.json())
    .then((res) => {
      Swal.fire({
        icon: "success",
        title: 'concluido!',
        timer: '1000',
      }).then((result) => {
      });
    })
};

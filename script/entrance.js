const cards = document.getElementById('cards');
var imgTeste = "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
var dadoCalender;
var cards_count = 0;
document.querySelector('#gym-name').innerHTML = sessionStorage.getItem("gym");

//カレンダーのデータ取得
fetch('https://squid-app-ug7x6.ondigitalocean.app/calender/entrance')
  .then((x) => x.json())
  .then((res) => {
    // console.log(res)
    classesHandler(res);
    dadoCalender = res;
  })

//スライド移動
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

function classesHandler(classes) {
  console.log(classes)
  for (let index = 0; index < classes.length; index++) {
    const currentClass = classes[index];
    if (currentClass.DESCRITION_1 != '') {
        console.log(currentClass)
      let cardOfClass = mountCard(currentClass, index)
      cardOfClass = cardOfClass + `<span class="nextClass ${(index >= classes.length - 1) ? "last" : ""}">&#8594;</span>`

      cards.innerHTML += cardOfClass;
    };
  };
};

function mountCard(data, index) {
  //const timeOfClass = new Date(data.START_TIME)
  const currentTime = new Date()
  const year = currentTime.getFullYear()
  const month = currentTime.getMonth()+1
  const day = currentTime.getDate()
  var status = ""
   const timeToFinish = new Date(`${year}/${month}/${day} ${data.FINISH_TIME}`)
   const timeOfClass = new Date(`${year}/${month}/${day} ${data.START_TIME}`)
   const test = new Date('2022/11/27 15:40')
   if(currentTime>timeOfClass && currentTime<timeToFinish){
     status = "On going" //最中
     console.log("in")
   }
if(currentTime>timeToFinish && status != "On going"){
  let cardStruct = `
  <div class="card ${(currentTime.getHours() == timeOfClass.getHours()) ? 'now' : ""}">
      <span class="title">Finished</span>
      <div class="content-finish" id="card${index}" onclick="entrance_regist()">
          <span class="contentText-finished">${data.DESCRITION_1}</span>
          <span class="contentText-finished">${data.DESCRITION_2}</span>
          <span class="contentText-finished-time">finished at ${data.FINISH_TIME}</span>
          </div>
  </div>`
  //cardStruct = cardStruct.replace(/{{image}}/g, ` <img src="${imgTeste}" />`);

  return cardStruct;
}else if(cards_count==0  && status != "On going"){
    let cardStruct = `
    <div class="card ${(currentTime.getHours() == timeOfClass.getHours()) ? 'now' : ""}">
        <span class="title">
            ${(timeOfClass.getDate() < currentTime.getDate() || timeOfClass.getHours() < currentTime.getHours()) ? "Finished" : "Coming next"}
        </span>
        <div class="content-coming-next" id="card${index}" onclick="entrance_regist()">
            <span class="contentText-coming-next">${data.DESCRITION_1}</span>
            <span class="contentText-coming-next">${data.DESCRITION_2}</span>
            <span class="contentTimeText-coming-next">Start at ${data.START_TIME}</span>
            <span class="contentTimeText-coming-next">Finish at ${data.FINISH_TIME}</span>
            </div>
    </div>`
    cards_count = cards_count +1
    return cardStruct;
}else if(status=="On going"){
  let cardStruct = `
  <div class="card ${(currentTime.getHours() == timeOfClass.getHours()) ? 'now' : ""}">
      <span class="title">
          ${(timeOfClass.getDate() < currentTime.getDate() || timeOfClass.getHours() < currentTime.getHours()) ? "Finished" : "On going"}
      </span>
      <div class="content-ongoing" id="card${index}" onclick="entrance_regist()">
          <span class="contentText-ongoing">${data.DESCRITION_1}</span>
          <span class="contentText-ongoing">${data.DESCRITION_2}</span>
          <span class="contentTimeText-ongoing">Start at ${data.START_TIME}</span>
          <span class="contentTimeText-ongoing">Finish at ${data.FINISH_TIME}</span>
          </div>
  </div>`
  cards_count = 0
  return cardStruct;
}else{
  let cardStruct = `
  <div class="card ${(currentTime.getHours() == timeOfClass.getHours()) ? 'now' : ""}">
      <span class="title">
          ${ (timeOfClass.getDate() < currentTime.getDate() || timeOfClass.getHours() < currentTime.getHours()) ? "Finished" : "Coming"}
      </span>
      <div class="content-finish" id="card${index}" onclick="entrance_regist()">
      <span class="contentText-finished">${data.DESCRITION_1}</span>
      <span class="contentText-finished">${data.DESCRITION_2}</span>
      <span class="contentText-finished-time">Start at ${data.START_TIME}</span>
      <span class="contentText-finished-time">Finish at ${data.FINISH_TIME}</span>
          </div>
  </div>`
//  cardStruct = cardStruct.replace(/{{image}}/g, ` <img src="${imgTeste}" />`);
//{{image}}←div の中に入れる
  return cardStruct;
}
};

function getFormattedTime(time) {
  return `${(time.getHours() > 10) ? time.getHours() : '0' + time.getHours()}:${(time.getMinutes() > 10) ? time.getMinutes() : '0' + time.getMinutes()}`
}

assignEventsInButtons()
//classesHandler()

function input_regist1() {
  input_length_count()
  document.getElementById('keys_entrance').value += 1
}
function input_regist2() {
  input_length_count()
  document.getElementById('keys_entrance').value += 2
}
function input_regist3() {
  input_length_count()
  document.getElementById('keys_entrance').value += 3
}
function input_regist4() {
  input_length_count()
  document.getElementById('keys_entrance').value += 4
}
function input_regist5() {
  input_length_count()
  document.getElementById('keys_entrance').value += 5
}
function input_regist6() {
  input_length_count()
  document.getElementById('keys_entrance').value += 6
}
function input_regist7() {
  input_length_count()
  document.getElementById('keys_entrance').value += 7
}
function input_regist8() {
  input_length_count()
  document.getElementById('keys_entrance').value += 8
}
function input_regist9() {
  input_length_count()
  document.getElementById('keys_entrance').value += 9
}
function input_regist0() {
  input_length_count()
  document.getElementById('keys_entrance').value += 0
}
function input_clear() {
  document.getElementById('keys_entrance').value = ""
}
function input_back() {
  swal.close()
}

function input_length_count() {
  var str = document.getElementById('keys_entrance').value
  console.log(str.length)
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


function entrance_regist() {
  Swal.fire({
    showCancelButton: false,
    showConfirmButton: true,
    ConfirmButtonText: '戻る',
    width: 400,
    html: `
      <div id="title">Digiti sua senha</div>
      <input type="password" id="keys_entrance" hiden/>
      <div id="main-div">
       <div id="first-row" class="swall-row">
         <div id="en1" class="number-div" onclick="input_regist1()">1</div>
         <div id="en2" class="number-div" onclick="input_regist2()">2</div>
         <div id="en3" class="number-div" onclick="input_regist3()">3</div>
       </div>
       <div id="second-row" class="swall-row">
         <div id="en4" class="number-div" onclick="input_regist4()">4</div>
         <div id="en5" class="number-div" onclick="input_regist5()">5</div>
         <div id="en6" class="number-div" onclick="input_regist6()">6</div>
       </div>
       <div id="third-row" class="swall-row">
         <div id="en7" class="number-div" onclick="input_regist7()">7</div>
         <div id="en8" class="number-div" onclick="input_regist8()">8</div>
         <div id="en9" class="number-div" onclick="input_regist9()">9</div>
       </div>
       <div id="fourth-row" class="swall-row">
         <div id="en0" class="number-div" onclick="input_regist0()">0</div>
         <div id="clear" class="number-div" onclick="input_clear()">Clear</div>
         <div id="en11" class="number-div" onclick="input_back()">←</div>
       </di>
      </div>
          <style>

          #main-div{
            width:95%;
          }
          #title{
            font-size:5vh;
            padding-left:3%;
          }
        .swall-row{
            display:flex;
          }
          .number-div{
            border: 1px solid gray;
            margin-right:30px;
            width:30%;
            height:6vh;
            font-size:4vh;
            text-align: center;
            padding-top:20px;
            margin-top:1%;

          }
          #keys_entrance{
            height:10vh;
              width:90%;
            border-radius: 10px;
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

          </style>`
    ,
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

          Swal.fire({
            title: 'Registrando!',
            didOpen: () => { Swal.showLoading() }
          })

          if (res[0]) {
            localStorage.setItem('id', res[0].id);
            localStorage.setItem('GYM_ID', res[0].id);
            Swal.fire({
              icon: "success",
              title: 'concluido!',
              didOpen: () => { Swal.hideLoading() }
            }).then((result) => {
              if (result.isConfirmed) {
                addClient_again()
              };
            });
          } else {
            Swal.fire({
              icon: "error",
              title: 'Algo errado!',
              didOpen: () => { Swal.hideLoading() }
            });
          }
        });

    };
  });
};

getTarget()

function getTarget() {
  const cardClicked = document.querySelector('#cards');
  cardClicked.addEventListener('click', (e) => {

    switch (e.target.id) {
      case 'card0':
        localStorage.setItem('decricoes', [seletorTarget(2), seletorTarget(3)]);
        break;
      case 'card1':
        localStorage.setItem('decricoes', [seletorTarget(6), seletorTarget(7)]);
        break;
      case 'card2':
        localStorage.setItem('decricoes', [seletorTarget(10), seletorTarget(11)]);
        break;
      case 'card3':
        localStorage.setItem('decricoes', [seletorTarget(14), seletorTarget(15)]);
        break;
      case 'card4':
        localStorage.setItem('decricoes', [seletorTarget(18), seletorTarget(19)]);
        break;
      case 'card5':
        localStorage.setItem('decricoes', [seletorTarget(22), seletorTarget(23)]);
        break;
      default:
        console.log("error...")
    }

  });
};

function seletorTarget(v) {
  return document.querySelectorAll('span')[v].innerHTML
};

function addClient_again() {
  var obj = {
    LESSON_NAME: localStorage.getItem('decricoes').split(',')[0],
    LESSON_HOUR: localStorage.getItem('decricoes').split(',')[1],
    MEMBER_ID: localStorage.getItem('id'),
    GYM_ID: localStorage.getItem('GYM_ID'),
  }

  fetch('https://squid-app-ug7x6.ondigitalocean.app/registerentrance', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then((x) => x.json())
    .then((res) => {
      console.log(res)
    })
};

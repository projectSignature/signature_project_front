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

  //const japanStandardTime = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
  //const japantime = new Date(japanStandardTime)
  //console.log(japantime.getDay())

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
const mountedClasses = []
var entrancearry = []
function classesHandler(classes) {
  entrancearry = classes
  for (let index = 0; index < classes.length; index++) {
    const currentClass = classes[index];
    if (currentClass.DESCRITION_1 != '') {
      let cardOfClass = mountCard(currentClass, index)
      if(classes[index+1].DESCRITION_1 != ''&&index !=classes.length){
        cardOfClass = cardOfClass + `<span class="nextClass ${(index >= classes.length - 1) ? "last" : ""}">&#8594;</span>`
      }
          mountedClasses.push(cardOfClass)
    };
  };
  const next = mountedClasses.filter(classMount => classMount.includes('content-coming-next'))
  const now = mountedClasses.filter(classMount => classMount.includes('now'))
  const finished = mountedClasses.filter(classMount => classMount.includes('finished'))
  const order = [...now, ...next, ...finished]
  for(let i=0; i<order.length; i++){
    cards.innerHTML += order[i]
  }
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
   }
if(currentTime>timeToFinish && status != "On going"){
  let cardStruct = `
  <div class="card ${(currentTime.getHours() == timeOfClass.getHours()) ? 'now' : ""}">
      <span class="title">Finished</span>
      <div class="content-finish" id="card${index}" onclick="entrance_regist(${index})">
          <span class="contentText-finished" name="desc1" id="discrition${index}" >${data.DESCRITION_1}</span>
          <span class="contentText-finished" name="desc2" id="subdiscrition${index}" >${data.DESCRITION_2}</span>
          <span class="contentTimeText-coming-next" disabled="disable" id="starttime${index}" >Start at ${data.START_TIME}</span>
          <span class="contentText-finished-time"   id="finishtime${index}">finished at ${data.FINISH_TIME}</span>
          </div>
  </div>`
  //cardStruct = cardStruct.replace(/{{image}}/g, ` <img src="${imgTeste}" />`);
//  localStorage.setItem('startTime', data.FINISH_TIME);
  return cardStruct;
}else if(cards_count==0  && status != "On going"){
    let cardStruct = `
    <div class="card ${(currentTime.getHours() == timeOfClass.getHours()) ? 'now' : ""}">
        <span class="title">
            ${(timeOfClass.getDate() < currentTime.getDate() || timeOfClass.getHours() < currentTime.getHours()) ? "Finished" : "Coming next"}
        </span>
        <div class="content-coming-next" id="card${index}" onclick="entrance_regist(${index})">
            <span class="contentText-coming-next" name="desc1"  id="discrition${index}">${data.DESCRITION_1}</span>
            <span class="contentText-coming-next" name="desc2"  id="subdiscrition${index}">${data.DESCRITION_2}</span>
            <span class="contentTimeText-coming-next"   id="starttime${index}" >Start at ${data.START_TIME}</span>
            <span class="contentTimeText-coming-next"  id="finishtime${index}">Finish at ${data.FINISH_TIME}</span>
            </div>
    </div>`
    cards_count = cards_count +1
  //   localStorage.setItem('startTime', [data.START_TIME, data.FINISH_TIME]);
    return cardStruct;
}else if(status=="On going"){
  let cardStruct = `
  <div class="card ${(currentTime.getHours() == timeOfClass.getHours()) ? 'now' : ""}">
      <span class="title">
          ${(timeOfClass.getDate() < currentTime.getDate() || timeOfClass.getHours() < currentTime.getHours()) ? "Finished" : "On going"}
      </span>
      <div class="content-ongoing" id="card${index}" onclick="entrance_regist(${index})">
          <span class="contentText-ongoing" name="desc1" id="discrition${index}" >${data.DESCRITION_1}</span>
          <span class="contentText-ongoing" name="desc2" id="subdiscrition${index}" >${data.DESCRITION_2}</span>
          <span class="contentTimeText-ongoing"  id="starttime${index}" >Start at ${data.START_TIME}</span>
          <span class="contentTimeText-ongoing"  id="finishtime${index}">Finish at ${data.FINISH_TIME}</span>
          </div>
  </div>`
//  localStorage.setItem('startTime', [data.START_TIME, data.FINISH_TIME]);
  cards_count = 0
  return cardStruct;
}else{
  let cardStruct = `
  <div class="card ${(currentTime.getHours() == timeOfClass.getHours()) ? 'now' : ""}">
      <span class="title">
          ${ (timeOfClass.getDate() < currentTime.getDate() || timeOfClass.getHours() < currentTime.getHours()) ? "Finished" : "Coming"}
      </span>
      <div class="content-finish" id="card${index}" onclick="entrance_regist(${index})">
      <span class="contentText-finished" name="desc1" id="discrition${index}" >${data.DESCRITION_1}</span>
      <span class="contentText-finished" name="desc2" id="subdiscrition${index}" >${data.DESCRITION_2}</span>
      <span class="contentText-finished-time"  id="starttime${index}" >Start at ${data.START_TIME}</span>
      <span class="contentText-finished-time"  id="finishtime${index}" >Finish at ${data.FINISH_TIME}</span>
          </div>
  </div>`

///  localStorage.setItem('startTime', [data.START_TIME, data.FINISH_TIME]);

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
    ConfirmButtonText: '戻る',
    width: 400,
    html: `
      <div id="title">Digiti sua senha</div>
      <input type="password" id="keys_entrance" hiden/>
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
            localStorage.setItem('GYM_ID', res[0].GYM_ID);
            addClient_again(number)
            if(entrancearry[number].GRADUATION_FLUG==1){
              entrance_count(res[0].id)
            }else{

            }
            //Swal.fire({
            //  icon: "success",
            //  title: 'concluido!',
            //  didOpen: () => { Swal.hideLoading() }
          //  }).then((result) => {
            //  if (result.isConfirmed) {
              //  addClient_again()
              //};
            //});
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
            });
        }
      }
    ;
    });
}

function addClient_again(number) {
  var starttime = document.getElementById(`starttime${number}`).innerHTML.substr(10,5)
  var finishtime = document.getElementById(`finishtime${number}`).innerHTML.substr(10,5)
  var obj = {
    LESSON_NAME: document.getElementById(`discrition${number}`).innerHTML + "_" + document.getElementById(`subdiscrition${number}`).innerHTML,
    LESSON_HOUR: starttime +"~"+finishtime,
    MEMBER_ID: localStorage.getItem('id'),
    GYM_ID: localStorage.getItem('GYM_ID')
  }
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

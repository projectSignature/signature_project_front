const cards = document.getElementById('cards');
var imgTeste = "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
const classes = [
  {
    time: new Date('10/10/2022'),
    className: "Steps",
    timeToFinish: new Date(),
    imageSrc: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
  },
  {
    time: new Date("09/10/2022"),
    className: "Steps",
    timeToFinish: new Date(),
    imageSrc: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
  },
  {
    time: new Date("10/09/2022"),
    className: "Steps",
    timeToFinish: new Date(),
    imageSrc: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
  },
  {
    time: new Date("09/10/2022"),
    className: "Steps",
    timeToFinish: new Date(),
    imageSrc: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
  },
  {
    time: new Date(),
    className: "Steps",
    timeToFinish: new Date(),
    imageSrc: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
  },
  {
    time: new Date("14/10/2022"),
    className: "Steps",
    timeToFinish: new Date(),
    imageSrc: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
  },
  {
    time: new Date("15/10/2022"),
    className: "Steps",
    timeToFinish: new Date(),
    imageSrc: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
  },
  {
    time: new Date("16/10/2022"),
    className: "Steps",
    timeToFinish: new Date(),
    imageSrc: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
  },
  {
    time: new Date("17/10/2022"),
    className: "Steps",
    timeToFinish: new Date(),
    imageSrc: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
  },
  {
    time: new Date("18/10/2022"),
    className: "Steps",
    timeToFinish: new Date(),
    imageSrc: null
  }
]

var dadoCalender;

fetch('https://squid-app-ug7x6.ondigitalocean.app/calender/entrance')
  .then((x) => x.json())
  .then((res) => {
    // console.log(res)
    classesHandler(res);
    dadoCalender = res;

  })

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
  for (let index = 0; index < classes.length; index++) {
    const currentClass = classes[index]
    let cardOfClass = mountCard(currentClass, index)
    cardOfClass = cardOfClass + `<span class="nextClass ${(index >= classes.length - 1) ? "last" : ""}">&#8594;</span>`
    cards.innerHTML += cardOfClass
  }
}

function mountCard(data, index) {
  const timeOfClass = new Date(data.time)
  const currentTime = new Date()
  const timeToFinish = new Date()
  let cardStruct = `
    <div class="card ${(currentTime.getHours() == timeOfClass.getHours()) ? 'now' : ""}">
        <span class="title">
            ${(currentTime.getHours() == timeOfClass.getHours() && currentTime.getDate() == timeOfClass.getDate()) ? 'Now' : (timeOfClass.getDate() < currentTime.getDate() || timeOfClass.getHours() < currentTime.getHours()) ? "Before" : "After"}
        </span>
        <div class="content" id="card${index}" onclick="entrance_regist()">
            <span class="contentText">${data.DESCRITION_1}</span>
            <span class="contentTimeText">Finish at ${getFormattedTime(timeToFinish)}</span>
            {{image}}
            </div>
    </div>`
  cardStruct = cardStruct.replace(/{{image}}/g, ` <img src="${imgTeste}" />`)
  /*   if (data.imageSrc) {
      cardStruct = cardStruct.replace(/{{image}}/g, ` <img src="${imgTeste}" />`)
    } else {
      cardStruct = cardStruct.replace(/{{image}}/g, ``)
    } */
  return cardStruct
}

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
          if (res[0]) {
            localStorage.setItem('id', res[0].id)
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
    MEMBER_ID: localStorage.getItem('id')
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
}


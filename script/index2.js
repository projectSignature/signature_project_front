document.getElementById("img2").addEventListener("click", swallopen1)
document.getElementById("img").addEventListener("click", swallopen2)

const mediaQuery = window.matchMedia('(max-width: 1200px)')
function handleTabletChange(e) {

  if (e.matches) {
    document.getElementById("monday").innerHTML = "Mon"
    document.getElementById("tuesday").innerHTML = "Tue"
    document.getElementById("wednesday").innerHTML = "Wed"
    document.getElementById("thursdauy").innerHTML = "Thu"
    document.getElementById("friday").innerHTML = "Fri"
    document.getElementById("suturday").innerHTML = "Sut"
    document.getElementById("sunday").innerHTML = "Sun"

  }else{
    document.getElementById("monday").innerHTML = "Monday"
    document.getElementById("tuesday").innerHTML = "Tuesday"
    document.getElementById("wednesday").innerHTML = "Wednesday"
    document.getElementById("thursdauy").innerHTML = "Thurday"
    document.getElementById("friday").innerHTML = "Friday"
    document.getElementById("suturday").innerHTML = "Suturday"
    document.getElementById("sunday").innerHTML = "Sunday"
  }
}

mediaQuery.addListener(handleTabletChange)

handleTabletChange(mediaQuery)


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
                title: "testando",
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

function swallopen1() {
    Swal.fire({
        html: `
        <div id='swall-title-div'>
            <h1 id='swal-title'>Alterar calendário</h1>
        </div>
        <div id='swal-maindiv'>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Dia</h2>
          <select id='days' class='input'>
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
          <h2 class='swall-sub-title'>Linha</h2>
          <select id='line' class='input'>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
          </select>
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Horário inicial</h2>
          <input type='time' id='swall-input-time1' class='input' />
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Horário final</h2>
          <input type='time' id='swall-input-time2' class='input' />
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Descrição 1</h2>
          <textarea id='input1' class='input'></textarea>
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Descrição 2</h2>
          <textarea id='input2' class='input'></textarea>
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Cor</h2>
          <select id="color" class='input'>
              <option value="blue">azul</option>
              <option value="green">verde</option>
              <option value="red">vermelho</option>
              <option value="yellow">amarelo</option>
              <option value="gray">cinza</option>
              <option value="pink">rosa</option>
              <option value="black">preto</option>
              <option value="white">branco</option>
              <option value="purple">roxo</option>
              <option value="branco">branco</option>
          </select>
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Kimono</h2>
          <select id="kimono-selected" class='input'>
              <option value="monday1">monday1</option>
              <option value="monday2">monday2</option>
          </select>

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
          }
      </style>
     </div>`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        width: 900,
    })
        .then(() => {
            const objSwal = {
                day: document.querySelector('#days').value,
                line: document.querySelector('#line').value,
                start: document.querySelector('#swall-input-time1').value,
                end: document.querySelector('#swall-input-time2').value,
                desc1: document.querySelector('#input1').value,
                desc2: document.querySelector('#input2').value,
                cor: document.querySelector('#color').value,
                img: document.querySelector('#kimono-selected').value
            }
            update(objSwal) //chama função de update 
        })
};

//INICIO DOS TESTES NO CALENDARIO
const line1 = document.querySelectorAll('.master-image');
const line2 = document.querySelectorAll('[name="desc1"]');
const line3 = document.querySelectorAll('[name="desc2"]');
const line4 = document.querySelectorAll('h4');
const line5 = document.querySelectorAll('h1');

//função de load e reload de dados.
function getDados() {
    fetch('https://squid-app-ug7x6.ondigitalocean.app/calenderteste')
        .then((x) => x.json())
        .then((res) => {
            cols(res);
        });
};

getDados();

async function cols(data) {

    function cards(initialValue, finishValue) {

        for (let i = initialValue; i < finishValue; i++) {
            //horario e cor da barra superior----->
            line4[i].innerHTML = `${data[i].START_TIME}~${data[i].FINISH_TIME}`;
            line4[i].style.backgroundColor = data[i].COLOR;

            //cor da fonte------->
            switch (data[i].COLOR) {
                case 'blue':
                    line4[i].style.color = '#fff';
                    break;
                case 'green':
                    line4[i].style.color = '#fff';
                    break;
                case 'red':
                    line4[i].style.color = '#000';
                    break;
                case 'yellow':
                    line4[i].style.color = '#000';
                    break;
                case 'gray':
                    line4[i].style.color = '#000';
                    break;
                case 'pink':
                    line4[i].style.color = '#fff';
                    break;
                case 'black':
                    line4[i].style.color = '#fff';
                    break;
                case 'white':
                    line4[i].style.color = '#000';
                    break;
                case 'purple':
                    line4[i].style.color = '#fff';
                    break;
            }

            //descrição 01 e 02
            line2[i].innerHTML = data[i].DESCRITION_1;
            line3[i].innerHTML = data[i].DESCRITION_2;

            //kimonos
            for (let i = initialValue; i < finishValue; i++) {
                line1[i].src = `../image/${data[i].IMAGE}.png`;
            };

        }
    };

    cards(0, 7); //chamada 01
    cards(7, 14); //chamada 02
    cards(14, 21); //chamada 03
    cards(21, 28); //chamada 04
    cards(28, 35); //chamada 05
    cards(35, 42); //chamada 06  

};


async function update(obj) {
    const up = {
        GYM: 1,
        DAY: obj.day,
        START: obj.start,
        FINISH: obj.end,
        LINE: obj.line,
        DESC1: obj.desc1,
        DESC2: obj.desc2,
        IMAGE: obj.img,
        COLOR: obj.cor,
    };

    fetch('https://squid-app-ug7x6.ondigitalocean.app/calender', {
        method: 'PUT',
        body: JSON.stringify(up),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then((x) => x.json())
        .then((response) => {
            getDados();
        });

};

document.querySelector('#gym-name').innerHTML = sessionStorage.getItem("gym");

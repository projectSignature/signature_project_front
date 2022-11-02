

document.getElementById("img2").addEventListener("click", swallopen1)
document.getElementById("img").addEventListener("click", swallopen2)

function swallopen2(){
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
      icon: "success",
      title: 'concluido',
    }
    )
  }
});
}


function swallopen1(){
  Swal.fire({
  html: `
  <div id='swall-title-div'>
      <h1 id='swal-title'>Alterar calendário</h1>
  </div>
  <div id='swal-maindiv'>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Dia</h2>
          <select id='days' class='input'>
              <option valoue="Monday">Monday</option>
              <option valoue="Tuesday">Tuesday</option>
              <option valoue="Wednesday">Wednesday</option>
              <option valoue="Thursday">Thursday</option>
              <option valoue="Friday">Friday</option>
              <option valoue="Saturday">Saturday</option>
              <option valoue="Sunday">Sunday</option>
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
        console.log(objSwal.start)
    });
};

//INICIO DOS TESTES NO CALENDARIO
const line1 = document.querySelectorAll('#second-row')[0];
const line2 = document.querySelectorAll('#second-row')[1];
const line3 = document.querySelectorAll('.master-image');
const line4 = document.querySelectorAll('h4');
const line5 = document.querySelectorAll('h1');
const line6 = document.querySelectorAll('.sechedule')[0];


//função de load e reload de dados.
function getDados() {
    fetch('https://squid-app-ug7x6.ondigitalocean.app/calenderteste')
        .then((x) => x.json())
        .then((res) => {
            console.log(res);
            cols(res);
        });
};

getDados();

async function cols(data) {
    var arr0 = [
        [0, 7, 14, 21, 28, 35], //define os indices para buscar as horas 
        [1, 8, 15, 22, 29, 36],
        [2, 9, 16, 23, 30, 37],
        [3, 10, 17, 24, 31, 38],
        [4, 11, 18, 25, 32, 39],
        [5, 12, 19, 26, 33, 40],
        [6, 13, 20, 27, 34, 41]
    ];

    var arr1 = [
        [0, 1, 14, 15, 28, 29, 42, 43, 56, 57, 70, 71], //define os indices para buscar as decrições
        [2, 3, 16, 17, 30, 31, 44, 45, 58, 59, 72, 73],
        [4, 5, 18, 19, 32, 33, 46, 47, 60, 61, 74, 75],
        [6, 7, 20, 21, 34, 35, 48, 49, 62, 63, 76, 77],
        [8, 9, 22, 23, 36, 37, 50, 51, 64, 65, 78, 79],
        [10, 11, 24, 25, 38, 39, 52, 53, 66, 67, 80, 81],
        [12, 13, 26, 27, 40, 41, 54, 55, 68, 69, 82, 83],
    ];

    var arr2 = [
        [0, 1, 2, 3, 4, 5], //define os indices para buscar os dados no banco 
        [6, 7, 8, 9, 10, 11],
        [12, 13, 14, 15, 16, 17],
        [18, 19, 20, 21, 22, 23],
        [24, 25, 26, 27, 28, 29],
        [30, 31, 32, 33, 34, 35],
        [36, 37, 38, 39, 40, 41]
    ];

    var arr3 = [
        [0, 7, 14, 21, 28, 35], //define os indices para buscar as imagens do kimono 
        [1, 8, 15, 22, 29, 36],
        [2, 9, 16, 23, 30, 37],
        [3, 10, 17, 24, 31, 38],
        [4, 11, 18, 25, 32, 39],
        [5, 12, 19, 26, 33, 40],
        [6, 13, 20, 27, 34, 41]
    ];



    function cards(hours, descs, index, indexIMG) {
        //horarios
        line4[hours[0]].innerHTML = `aa${data[index[0]].START_TIME}~${data[index[0]].FINISH_TIME}`;
        line4[hours[1]].innerHTML = `${data[index[1]].START_TIME}~${data[index[1]].FINISH_TIME}`;
        line4[hours[2]].innerHTML = `${data[index[2]].START_TIME}~${data[index[2]].FINISH_TIME}`;
        line4[hours[3]].innerHTML = `${data[index[3]].START_TIME}~${data[index[3]].FINISH_TIME}`;
        line4[hours[4]].innerHTML = `${data[index[4]].START_TIME}~${data[index[4]].FINISH_TIME}`;
        line4[hours[5]].innerHTML = `${data[index[5]].START_TIME}~${data[index[5]].FINISH_TIME}`;

        //cor do h4
        line4[hours[0]].style.backgroundColor = data[index[0]].COLOR;
        line4[hours[1]].style.backgroundColor = data[index[1]].COLOR;
        line4[hours[2]].style.backgroundColor = data[index[2]].COLOR;
        line4[hours[3]].style.backgroundColor = data[index[3]].COLOR;
        line4[hours[4]].style.backgroundColor = data[index[4]].COLOR;
        line4[hours[5]].style.backgroundColor = data[index[5]].COLOR;

        for (let i = 0; i < 6; i++) {
            line3[hours[i]].src = `../image/${data[index[i]].IMAGE}.png`;
        }


        //descrições
        line5[descs[0]].innerHTML = data[index[0]].DESCRITION_1;
        line5[descs[1]].innerHTML = data[index[0]].DESCRITION_2;
        line5[descs[2]].innerHTML = data[index[1]].DESCRITION_1;
        line5[descs[3]].innerHTML = data[index[1]].DESCRITION_2;
        line5[descs[4]].innerHTML = data[index[2]].DESCRITION_1;
        line5[descs[5]].innerHTML = data[index[2]].DESCRITION_2;
        line5[descs[6]].innerHTML = data[index[3]].DESCRITION_1;
        line5[descs[7]].innerHTML = data[index[3]].DESCRITION_2;
        line5[descs[8]].innerHTML = data[index[4]].DESCRITION_1;
        line5[descs[9]].innerHTML = data[index[4]].DESCRITION_2;
        line5[descs[10]].innerHTML = data[index[5]].DESCRITION_1;
        line5[descs[11]].innerHTML = data[index[5]].DESCRITION_2;
    };

    cards(arr0[0], arr1[0], arr2[0]); //chamada 01
    cards(arr0[1], arr1[1], arr2[1]); //chamada 02
    cards(arr0[2], arr1[2], arr2[2]); //chamada 03
    cards(arr0[3], arr1[3], arr2[3]); //chamada 04
    cards(arr0[4], arr1[4], arr2[4]); //chamada 05
    cards(arr0[5], arr1[5], arr2[5]); //chamada 06  
    cards(arr0[6], arr1[6], arr2[6]); //chamada 06  

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


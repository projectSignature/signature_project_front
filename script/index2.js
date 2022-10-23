

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
              <option value="azul">azul</option>
              <option value="verde">verde</option>
              <option value="vermelho">vermelho</option>
              <option value="amarelo">amarelo</option>
              <option value="cinza">cinza</option>
              <option value="rosa">rosa</option>
              <option value="preto">preto</option>
              <option value="branco">branco</option>
              <option value="roxo">roxo</option>
              <option value="branco">branco</option>
          </select>
      </div>
      <div id='swall-select' class='swall-div-class'>
          <h2 class='swall-sub-title'>Imagem</h2>
          <label for="arquivo">Selecionar imagem</label>
          <input type="file" src="" class='input' alt="" placeholder="">

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
  });
}


let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先
let user
let password
let errormessage
let menbername = sessionStorage.getItem("name")
let language = sessionStorage.getItem("language")
let workerid =sessionStorage.getItem("id")


/////////////////////////////////////テキスト翻訳///////////////////////////////////////
let txt0 = ["Bater ponto","打刻"]
let txt1 = ["Controle financeiro","収支管理"]
let txt2 = ["Menu","メニュー"]
let txt3 = ["Carteira","財布管理"]
let txt4 = ["Caixa","レジ"]
let txt5 = ["Entrar","出勤"]
let txt6 = ["Sair","退勤"]
let txt7 = ["Você já registrou a entrada de hoje,deseja alterar?","本日の入場で打刻データあります、更新しますか？"]
let txt8 = ["Você não registrou a entrada de hoje, deseja registrar somente a saida?","本日の入場打刻データがありません、退勤のみ登録を行います。"]
let txt9 = ["Erro no registro","登録に失敗しました"]
let text48 = ["Registrado","完了"]
let text17 = ["salvando",'登録中']
let text18= ["Aguarde",'しばらくお待ちください']

document.getElementById("txt0").innerText = txt0[language]
document.getElementById("txt1").innerText = txt1[language]
document.getElementById("txt2").innerText = txt2[language]
document.getElementById("txt3").innerText = txt3[language]
document.getElementById("txt4").innerText = txt4[language]

//////////////////////////////////////////////////////////////////////////////////////

document.getElementById('name-span').innerText = menbername
if(menbername==""){
  pagechange('loginadminrst')
}

 function kubun1(data){
}

async function openstores(){
  let opens = await makerequest(`${accessmainserver}/restmanegerTimeGet`)
    let row = `
      <div>
       <div class="divs-mains-opens"> Status do restaurante
         <select id="opens-select">
          ${await getopens(opens[0].work_status)}
         </select>
       </div>
       <div class="divs-mains-opens">Tempo de espera
        <input id="picktimes" type="number" value="${opens[0].pickup_time}"/>
      </div>
     </div>`
     await swallopenClose(row)
}

function getopens(d){
  if(d==0){
    return `<option value='0' selected>aberto</opton>
            <option value='1'>fechado</opton>`
  }else{
    return `<option value='0'>aberto</opton>
            <option value='1' selected>fechado</opton>`
  }
}

function swallopenClose(data) {
  Swal.fire({
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: 'Voltar',
    confirmButtonText:'Salvar',
    width: 500,
    html: `${data}
          <style>
           .divs-mains-opens{
             width:100%;
             margin-top:15px
           }
           .divs-mains-opens input, .divs-mains-opens select{
             width:50%;
             height:3rem;
             text-align:center
           }
           </style>`

  }).then(async (result) => {
    if(result.isConfirmed) {
      let d0 = document.getElementById('picktimes').value
      let d1 = document.getElementById('opens-select').value

      let url =`https://squid-app-ug7x6.ondigitalocean.app/openclosescahnge`
      body = {
        d0:d0,
        d1:d1
      }
      const reqInsert = await makerequestStatus(url,body)
        if(reqInsert.status==200){
            successsmal()
        }else{
            swallError(txt9[language])
        }

    }
  });
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
   <div id="time-regist-point-day" class="day-divs"></div>
   <div id="time-regist-point-time" class="times-divs"></div>
   <div class="button-input-regist-div">
    <div class="button-input-regist" style="background-color:#D0FF43" onclick="registTime(1)">${txt5[language]}</div>
    <div class="button-input-regist" style="background-color:#9057FF" onclick="registTime(2)">${txt6[language]}</div>
   </div>
   <style>
   .swal2-popup {
       width: 90% !important;
       height: 600px !important;
   }
   .day-divs{
     font-size:2vh !important
   }
   .times-divs{
     font-size:4.5vh !important
   }
   .button-input-regist{
     font-size: 4vh !important
   }
   @media only screen and (max-width: 800px) {
     .swal2-popup {
       height: 450px !important;
     }
   </style>`
   swallopen(row)
}

function pagechange(data){
  window.location = `./${data}.html`;
}

function swallopen(row) {
  Swal.fire({
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: 'back',
    width: 500,
    html: row
  }).then((result) => {
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
            const youbi = ["dom","seg","ter","qua","qui","sex","sáb"];
            const getDateString = date =>
                `${ date.getFullYear() }/${ zero(date.getMonth() + 1) }/${ zero(date.getDate()) } ${ youbi[date.getDay()] }`;
            // 時間の文字列化
            const getHourString = date =>
                `${ zero(date.getHours()) }:${ zero(date.getMinutes()) }:${ zero(date.getSeconds())}`;
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

async function registTime(d){
  var today = new Date();
  let yyyy = today.getFullYear();
  let mm = ("0"+(today.getMonth()+1)).slice(-2);
  let dd = ("00" + today.getDate()).slice(-2);
  let hh = ("00"+ today.getHours()).slice(-2);
  let mmm = ("00"+ today.getMinutes()).slice(-2);
  let sss = ("00"+today.getSeconds()).slice(-2)
  let setdt = `${yyyy}-${mm}-${dd}`
  let upsetdt = `${yyyy}-${mm}-${dd} ${hh}:${mmm}:${sss}`
  const swal =  Swal.fire({
          icon:"info",
          title: text17[language],
          html: text18[language],
          allowOutsideClick : false,
          showConfirmButton: false,
          timerProgressBar: true,
          onBeforeOpen: () => {
          Swal.showLoading();
      }
    })
   const dakokudt = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/dakokusget?id=${workerid}&&dt=${setdt}`)
  if(d==1){
    //  const getdakokus =  await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/dakokusget?id=${workerid}`)　
        if(dakokudt.length==1){
          swallError2(txt7[language],dakokudt[0].id,upsetdt)
        }else{
          let url =`https://squid-app-ug7x6.ondigitalocean.app/dakokuistdata`
          body = {
            d1:workerid,
            d2:upsetdt,
            d3:setdt
          }
          const reqInsert = await makerequestStatus(url,body)
            if(reqInsert.status==200){
                successsmal()
            }else{
                swallError(txt9[language])
            }
        }
  }else{
    if(dakokudt.length==0){
       swallErrorNOentrance(txt8[language],workerid,upsetdt,setdt)
    }else{
      let url =`https://squid-app-ug7x6.ondigitalocean.app/updatefinaldakoku`
      body = {
        d1:dakokudt[0].id,
        d2:upsetdt
      }
      const reqInsert = await makerequestStatus(url,body)
        if(reqInsert.status==200){
            await successsmal()

        }else{
            swallError(txt9[language])
        }
    }
  }
  await swal.close()
                  //  = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/menuGet?id=${restid}`)//&&menuid=${data}
}

async function successsmal(){
  const Toast = await Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  await Toast.fire({
    icon: 'success',
    title: text48[language],
  });
await Toast.close()
}


function swallErrorNOentrance(message,wid,updt,wdt){
  const swal =  Swal.fire({
          html: message,
          icon:'error',
          allowOutsideClick : false,
          showConfirmButton: true,
          timerProgressBar: true,
        }).then(async(result) => {
            if(result.isConfirmed) {
              let url =`https://squid-app-ug7x6.ondigitalocean.app/dakokuistfinaldata`
              body = {
                d1:wid,
                d2:updt,
                d3:wdt
              }
              const reqInsert = await makerequestStatus(url,body)
              if(reqInsert.status==200){
                successsmal()
              }else{
                swallError(txt9[language])
              }
            }
          })
}

function swallError2(message,id,updt){
  const swal =  Swal.fire({
          html: message,
          icon:'error',
          allowOutsideClick : false,
          showConfirmButton: true,
          timerProgressBar: true,
        }).then(async(result) => {
            if(result.isConfirmed) {
              let url =`https://squid-app-ug7x6.ondigitalocean.app/dakokuupdt`
              body = {
                d1:id,
                d2:updt
              }
              const reqInsert = await makerequestStatus(url,body)
              if(reqInsert.status==200){
                successsmal()
              }else{
                swallError(txt9[language])
              }
            }
          })
}

async function makerequestStatus(url,data){
  const request = await fetch(url, {//pegar todos dados do table de pagamentos //n]
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })

  return request
}

function swallError(message){
  const swal =  Swal.fire({
          html: message,
          icon:'error',
          allowOutsideClick : false,
          showConfirmButton: true,
        }).then(async(result) => {
            if(result.isConfirmed) {
              swal.close()
            }
          })
}

async function makerequest(url){
  const request = await fetch(url)
 return request.json()
}

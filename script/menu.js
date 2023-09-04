
let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先
let user
let password
let errormessage
let proccessKubun = 0
let paykubun = 0
let payStatus = 0
let restid=sessionStorage.getItem("restid")
let workerid=sessionStorage.getItem("id")
let menbername = sessionStorage.getItem("name")
let chArr = []
restid =0
let menulist = ""
//if(restid==null||workerid==null||menbername==null){
//  pagechange('loginadminrst')
//}
//let menbername = "Paulo Shigaki"
document.getElementById('name-span').innerText = menbername
var today = new Date();
let yyyy = today.getFullYear();
let mm = ("0"+(today.getMonth()+1)).slice(-2);
let dd = ("00" + today.getDate()).slice(-2);
menucrete()
async function menucrete(){
  let row = ``
  document.getElementById('insertMenuHtml').innerHTML=""
   menulist = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/menuGet?id=${restid}`)//&&menuid=${data}
    for(let i=0;i<menulist.length;i++){
      let arr = {id:menulist[i].id,
                 status:menulist[i].status}
                 chArr.push(arr)
      row += `<div class="mainDiv">
              <div class="menuimgDiv"><img src="../image/menu${menulist[i].menu_id}-${menulist[i].menu_child_id}.png" width="30" class="setting-right-button"/></div>
              <div class="discricionDiv">
               <div class="title-menu">${menulist[i].menu_name_0}</div>
               <div class="priceandEdit">
                 <div>
                   <img id="img${i}" class="image-cursor"  src="../image/${await getflug(menulist[i].status)}.png"  alt="" width="25" onclick="alterStatus('img${i}','${menulist[i].id}',${i})"/>
                 </div>
                 <div>￥${menulist[i].menu_value}
                 </div>
                 <div>
                   <img class="image-cursor"  src="../image/list.jpg" onClick="recipeshows(${menulist[i].id})" alt="" width="35"/>
                 </div>
                 <div>
                   <img class="image-cursor"  src="../image/ic8.png" onClick="custoshow('${menulist[i].menu_id}-${menulist[i].menu_child_id}')" alt="" width="35"/>
                 </div>
                 <img class="image-cursor"  src="../image/edit.svg" onClick="editMenu(${menulist[i].id})" alt="" width="25"/>
                 <div>
                 </div>

              </div>
              </div>
             </div>
             <style>
             .swal2-popup {
                 width: 80% !important;
                 height: 600px !important
             }

             </style>`
    }
    document.getElementById('insertMenuHtml').innerHTML += row

  }


async function recipeshows(d){
  console.log(d)
  let row=""
  menulist = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/menuGet?id=${restid}`)//&&menuid=${data}
   for(let i=0;i<menulist.length;i++){
     if(menulist[i].id==d){
       let count = ( menulist[i].zairyo.match( /,/g ) || [] ).length
       row += `<div class="title-recipe">
                 ${menulist[i].menu_name_0}
               </div>`
       for(let ii=0;ii<count;ii++){
         row += `
                 <div class="divsinputs-recip">
                   <span class="recipt-value-first">${menulist[i].zairyo.split(",")[ii]}</span>
                   <span class="recipt-value">${menulist[i].zairyoqt.split(",")[ii]}</span>
                   <span class="recipt-value">${menulist[i].zairyotp.split(",")[ii]}</span>
                  </div>`
       }
     }
   }
   Swal.fire({
     showCancelButton: false,
     showConfirmButton: true,
     allowOutsideClick:false,
     cancelButtonText: 'back',
     html: `<div>
             ${row}
            </div>
     <style>
     .swal2-popup {
         width: 100% !important;
         height: 400px !important
     }
     .divsinputs-recip{
       display:flex
     }
     .divsinputs-recip span{
       border-bottom:0.5px solid gray
     }
     .title-recipe{
       width:100%;
       text-align: center;
       background-color:	#222222;
       color:white;
       font-weight: bold;
     }
     .recipt-value{
       width:25%
     }
     .recipt-value-first{
       width:50%
     }
     </style>`,
   })
}

async function custoshow(d){
    Swal.fire({
      showCancelButton: false,
      showConfirmButton: false,
      cancelButtonText: 'back',
      width: 500,
      html: `<div>
      　　<img class="image-cursor"  src="../image/menupd${d}.png" alt=""/>
      </div>
      <style>
      .swal2-popup {
          width: 100% !important;
          height: 800px !important
      }
      </style>`,
    }).then((result) => {

    });

}

async function getbbqkubun(d){
  let row = ""
  if(d==1){
    row = `<option value="1" selected>sim</option>
           <option value="2">não</option>`
  }else{
    row = `<option value="1">sim</option>
           <option value="2" selected>não</option>`
  }
  return row
}

function getflug(d){
  if(d==0){
    return 'nopaid'
  }else{
    return 'paid'
  }


}

async function alterStatus(contID,id,d){
  let img = document.getElementById(contID);
  let src = img.getAttribute('src');
  let nStatus
  if(src=="../image/nopaid.png"){
    img.src="../image/paid.png"
    nStatus = 1
  }else{
    img.src="../image/nopaid.png"
    nStatus =0

  }
  chArr[d].status = nStatus


}

async function bbqstatus(d){
  let url = `https://squid-app-ug7x6.ondigitalocean.app/updateBBQmenus`
  body = {
    d1:d
  }
const reqInsert = await makerequestStatus(url,body)

if(reqInsert.status==200){
  swallSuccess()
  menucrete()
}else{
  swallErrorOpen("Ops, houve erro")
}
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

async function swallSuccess(){
  const Toast = await Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

Toast.fire({
  icon: 'success',
    title: 'Feito'
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

function swallOpen(data) {
  Swal.fire({
    showCancelButton: true,
    showConfirmButton: true,
    allowOutsideClick : false,
    html: `<div>${data}</div>`,
    timer:2000
  })
}


  //APIアクセスファンクション
  async function makerequest(url){
    const request = await fetch(url)  //esperar aqui
  //  await console.log(request.json())
    return request.json()
  }

async function editMenu(d){
  console.log(d)
  let row=``
  for(let i=0;i<menulist.length;i++){
    if(menulist[i].id==d){

       row = `
       <div class="editmenu-div">descrição PT
       </div>
       <div class="inputs-divs">
        <input id="menu-edit1" type="text" name="attend" value="${menulist[i].menu_name_0}" class="menu-disc">
       </div>
       <div class="editmenu-div">descrição EN
       </div>
       <div class="inputs-divs">
            <input id="menu-edit2" type="text" name="attend" value="${menulist[i].menu_name_1}">
       </div>
       <div class="editmenu-div">descrição JP
       </div>
       <div class="inputs-divs">
           <input id="menu-edit3" type="text" name="attend" value="${menulist[i].menu_name_2}">
       </div class="editmenu-div">
       <div class="editmenu-div">Valor
       </div>
       <div class="inputs-divs">
        <input id="menu-edit4" type="text" name="attend" value="${menulist[i].menu_value}">
       </div>
       <div class="editmenu-div">Nome de controle
       </div>
       <div class="inputs-divs">
        <input id="menu-edit5" type="text" name="attend" value="${menulist[i].control_name}">
       </div>
       <div class="editmenu-div">Menu churrasco
       </div>
       <div  class="inputs-divs">
        <select id="menu-edit6" >
         ${await getbbqkubun(menulist[i].bbq_kubun)}
        </select>
       </div>
       <style>
       .swal2-popup {
           width: 100% !important;
           height: 600px !important
       }
       .menu-disc{
         height:8rem
       }
       </style>`
      break
    }
  }
  Swal.fire({
  showCancelButton: true,
  showConfirmButton: true,
  showDenyButton: true,
  confirmButtonText: 'salvar',
  cancelButtonText:'cancelar',
  denyButtonText:'deletar',
  allowOutsideClick : false,
  width: 300,
  html:row,
  preConfirm: (login) => {
    if(isNaN(document.getElementById('menu-edit4').value)){
      Swal.showValidationMessage(`Coloque somente número no campo do valor`)
    }
  }
  }).then((result) => {
   if (result.isConfirmed) {
     body = {
       d0:document.getElementById('menu-edit1').value,
       d1:document.getElementById('menu-edit2').value,
       d2:document.getElementById('menu-edit3').value,
       d3:document.getElementById('menu-edit4').value,
       d4:document.getElementById('menu-edit5').value,
       d5:document.getElementById('menu-edit6').value,
       d6:d
     }
     changemenus(body)
     console.log(body)
   }else if(result.isDenied){
     deletesmenus(d)
   }else{
     swal.close()
   }
 })
}

async function deletesmenus(d){
  const swal =  Swal.fire({
          icon:"info",
          title: 'Deseja deletar o menu?',
          allowOutsideClick : false,
          showConfirmButton: true,
          timerProgressBar: true
    }).then((result) => {
     if (result.isConfirmed) {
         deleteconfirm(d)
     }
   })
}

async function deleteconfirm(d){
  console.log(d)
  const swal =  Swal.fire({
          icon:"info",
          title: 'Deletando',
          html: 'Aguarde',
          allowOutsideClick : false,
          showConfirmButton: false,
          timerProgressBar: true,
          onBeforeOpen: () => {
          Swal.showLoading();
      }
    })
    let body = {
      id:d
    }
  let url = `https://squid-app-ug7x6.ondigitalocean.app/deletesmenus`
  const reqInsert = await makerequestStatus(url,body)

if(reqInsert.status==200){
  swallSuccess()
  menucrete()
}else{
  swallErrorOpen("Ops, houve erro")
}
await swal.close()

}






async function changemenus(d){
  const swal =  Swal.fire({
          icon:"info",
          title: 'Registrando',
          html: 'Aguarde',
          allowOutsideClick : false,
          showConfirmButton: false,
          timerProgressBar: true,
          onBeforeOpen: () => {
          Swal.showLoading();
      }
    })
  let url = `https://squid-app-ug7x6.ondigitalocean.app/editsmenus`
  const reqInsert = await makerequestStatus(url,d)

if(reqInsert.status==200){
  swallSuccess()
  menucrete()
}else{
  swallErrorOpen("Ops, houve erro")
}
await swal.close()

}

async function cahgeAllstatus(){
  const swal =  Swal.fire({
          icon:"info",
          title: 'Registrando',
          html: 'Aguarde',
          allowOutsideClick : false,
          showConfirmButton: false,
          timerProgressBar: true,
          onBeforeOpen: () => {
          Swal.showLoading();
      }
    })
  let url = `https://squid-app-ug7x6.ondigitalocean.app/updateAllmenus`
const reqInsert = await makerequestStatus(url,chArr)

if(reqInsert.status==200){
  swallSuccess()
  menucrete()
}else{
  swallErrorOpen("Ops, houve erro")
}

await swal.close()


}

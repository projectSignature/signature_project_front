
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
console.log(restid)
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
    await console.log(menulist)
    for(let i=0;i<menulist.length;i++){
      row += `<div class="mainDiv">
              <div class="menuimgDiv"><img src="../image/menu${menulist[i].menu_id}-${menulist[i].menu_child_id}.jpg" width="30" class="setting-right-button"/></div>
              <div class="discricionDiv">
               <div class="title-menu">${menulist[i].menu_name_0}</div>
               <div class="priceandEdit">
               <div>
                <img id="img${i}" class="image-cursor"  src="../image/${await getflug(menulist[i].status)}.png"  alt="" width="25" onclick="alterStatus('img${i}','${menulist[i].status}')"/>
               </div>
                 <div>￥${menulist[i].menu_value}
                 </div>
                 <div>
                  <img class="image-cursor"  src="../image/edit.svg" onClick="editMenu(${menulist[i].id})" alt="" width="25"/>
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
    await console.log(row)
    document.getElementById('insertMenuHtml').innerHTML += row
  }

function getflug(d){
  if(d==0){
    return 'nopaid'
  }else{
    return 'paid'
  }


}

async function alterStatus(id,flug){
  var img = document.getElementById(id);
  var src = img.getAttribute('src');
  if(src=="../image/nopaid.png"){
    img.src="../image/paid.png"
  }else{
    img.src="../image/nopaid.png"

  }

}

async function bbqstatus(d){
  let url = `https://squid-app-ug7x6.ondigitalocean.app/updateBBQmenus`
  body = {
    d1:d
  }
const reqInsert = await makerequestStatus(url,body)
console.log(reqInsert.status)
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
      console.log(menulist[i])
       row = `
       <div>
         <label>
             discrição PT<input type="text" name="attend" value="${menulist[i].menu_name_0}" class="menu-disc">
          </label>
       <div>
       <div>
         <label>
             discrição EN<input type="text" name="attend" value="${menulist[i].menu_name_1}">
          </label>
       <div>
       <div>
         <label>
             discrição EN<input type="text" name="attend" value="${menulist[i].menu_name_2}">
          </label>
       <div>
       <div>
         <label>
             Valor ￥<input type="text" name="attend" value="${menulist[i].menu_value}">
          </label>
       <div>
       <div>
         <label>
             Nome de controle<input type="text" name="attend" value="${menulist[i].menu_value}">
          </label>
       <div>
       <style>
       .menu-disc{
         height:8rem
       }</style>`
      break
    }
  }
  Swal.fire({
  showCancelButton: false,
  showConfirmButton: true,
  ConfirmButtonText: 'Cancelar',
  allowOutsideClick : false,
  width: 300,
  html:row,

  }).then((result) => {
   if (result.isConfirmed) {
swal.close()
   }
 })
}

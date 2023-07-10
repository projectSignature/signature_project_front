
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
   menulist = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/menuGet?id=${restid}`)//&&menuid=${data}
    await console.log(menulist)
    for(let i=0;i<menulist.length;i++){
      row += `<div class="mainDiv">
              <div class="menuimgDiv"><img src="../img/menu${menulist[i].menu_id}-${menulist[i].menu_child_id}.jpg" width="30" class="setting-right-button"/></div>
              <div class="discricionDiv">
               <div class="title-menu">${menulist[i].menu_name_0}</div>
               <div class="priceandEdit">
               <div>
                <img class="image-cursor"  src="../img/${await getflug(menulist[i].status)}.png"  alt="" width="25" onclick="alterStatus('${menulist[i].id}','${menulist[i].status}')"/>
               </div>
                 <div>￥${menulist[i].menu_value}
                 </div>
                 <div>
                  <img class="image-cursor"  src="../img/edit.svg" onClick="editMenu(${menulist[i].id})" alt="" width="25"/>
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
  console.log(id)
  console.log(flug)
  let changeStatus
  if(flug==0){
    changeStatus =1
  }else{
    changeStatus =0
  }
  let url = `https://squid-app-ug7x6.ondigitalocean.app/updateRestMenus`
  body = {
    d1:changeStatus,
    d2:id
  }

  await console.log(body)
  const reqInsert = await makerequestStatus(url,body)
 if(reqInsert.status==200){
   window.location.reload()
 }else{
   swallErrorOpen("Ops, houve erro")
 }
  await console.log(reqInsert.status)
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
             discrição PT<input type="text" name="attend" value="${menulist[i].menu_name_0}">
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
             Valor ￥<input type="text" name="attend" value="${menulist[i].menu_value}">
          </label>
       <div>`
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


const inputs = document.querySelectorAll('input');
var errormessage = ""
var errormessage1 = ""
var errormessage2 = ""
var errormessage3 = ""
var errormessage4 = ""
var errormessage5 = ""
var errormessage6 = ""
var errormessage7 = ""
var errormessage8 = ""
var errormessage9 = ""
var errormessage10 = ""
var errormessage11 = ""
var errormessage12 = ""
var gymname = sessionStorage.getItem("gym");
var gymid = sessionStorage.getItem("GYM_ID");
const plans_div = document.getElementById('plans-div2');
let plans_rows
let plans_kubun
let familyflug = false //ファミリープラン選択用のフラグ
let familyconfirmflug = false //ファミリープラン選択用のフラグ
var answer
var today = new Date();  //今日
var selectlanguage
let plan = ""
let valor = ""
language = 0
//gymid = 4
//gymname ="Kussano dojo"

document.getElementById("birthday_year").addEventListener("change", birthday_date_get)
document.getElementById("birthday_month").addEventListener("change", birthday_date_get)
document.getElementById("birthday_day").addEventListener("change", birthday_date_get)

//document.getElementById("cheap").addEventListener("click", familyplan)
let stxt1 = ["Seja bem-vindo　\n",]
let stxt2 = ["Seja bem-vindo\nInsira seus dados pessoais"]
let stxt3 = ["Nome completo:"]
let stext4 = ["Por favor, digite um nome"]
let stext5 = ["Data de nascimento"]
let stext6 = ["Por favor, digite a data de nascimento"]
let stext7 = ["Sexo"]
let stext8 = ["Homem"]
let stext9 = ["Mulher"]
let stext10 = ["Por favor, Escolha o sexo"]
let stext11 = ["Enderço"]
let stext12 = ["Por favor, digite o seu endereço"]
let stext13 = ["Número de telefone"]
let stext14 = ["Por favor, digite o seu número de telefone"]
let stext15 = ["E-mail"]
let stext16 = ["Por favor, digite o seu email"]
let stext17 = ["Idioma"]
let stext18 = ["Por favor, selecione o idioma"]
let stext19 = ["Escolha um plano"]
let stext20 = ["Verifique as politicas da academia e assine no campo a baixo"]
let stext21 = ["politicas da academia"]
let stext22 = ["Escolher"]
let stext23 = ["Apagar"]
let stext24 = ["Confirmar"]
let stext25 = ["Registrar os dados do famliar"]
let stext26 = ["Concordo","Agree","同意する"]
let stext27 = ["Escolher","Select","選択"]
let stext28 = ["Concluido","Completed","完了"]
let stext29 = ["Seja bem vindo para o nosso dojo","Welcome to our dojo","登録が完了しました、道場へようこそ"]
let stext30 = ["Registrando","Processing","登録中"]
let stext31 = ["Aguarde","wait","そのままお待ちください"]
let stext32 = ["Confirme","Confirmation","We will register in the system"]
let stext33 = ["Iremos registrar no sistema","We will register in the system","システムに登録します"]
let stext34 =["Digite a data de nascimento e selecione o sexo primeiro","Enter date of birth and select gender first","生年月日と性別を先に入力してください"]
let stext35 = ["Termo de resonsabilidade e condições para matrícula","Resonsability term and conditions for registration","入会にあたっての注意事項及び同意書"]
var past={
 pt:{
   buttons:{
   },
   Text:{
     Text1:"Seja bem-vindo　\n",
     Text2:"Seja bem-vindo\nInsira seus dados pessoais",
     Text3:"Nome completo:",
     Text4:"Por favor, digite um nome",
     Text5:"Data de nascimento",
     Text6:"Por favor, digite a data de nascimento",
     Text7:"Sexo",
     Text8:"Homem",
     Text9:"Mulher",
     Text10:"Por favor, Escolha o sexo",
     Text11:"Enderço",
     Text12:"Por favor, digite o seu endereço",
     Text13:"Número de telefone",
     Text14:"Por favor, digite o seu número de telefone",
     Text15:"E-mail",
     Text16:"Por favor, digite o seu email",
     Text17:"Idioma",
     Text18:"Por favor, selecione o idioma",
     Text19:"Escolha um plano",
     Text20:"Verifique as politicas da academia e assine no campo a baixo",
     Text21:"politicas da academia",
     Text23:"Apagar",
     Text22:"Escolher",
     Text24:"Confirmar",
		 Text25:"Registrar os dados do famliar"
   },
 },
 jp:{
   buttons:{
   },
   Text:{
     Text1:"ようこそ",
     Text2:"ようこそ\n下記にて個人情報をご入力ください。",
     Text3:"フルネーム:",
     Text4:"名前を入力してください。",
     Text5:"生年月日",
     Text6:"生年月日を入力してください。",
     Text7:"性別",
     Text8:"男性",
     Text9:"女性",
     Text10:"性別を選択してください。",
     Text11:"住所",
     Text12:"住所を入力してください。",
     Text13:"電話番号",
     Text14:"電話番号を入力してください。",
     Text15:"メールアドレス",
     Text16:"メールアドレスを入力してください",
     Text17:"言語",
     Text18:"言語を選択してください",
     Text19:"プランを選択してください。",
     Text20:"利用規約を確認し、署名をお願いします。",
     Text21:"利用規約に同意します",
     Text22:"選択",
     Text23:"クリア",
     Text24:"確定",
		 Text25:"家族の情報の入力をお願いします"
   },
 },
 en:{
  buttons:{
  },
  Text:{
    Text1:"Welcome",
    Text2:"Welcome\nPlease enter your personal details below.",
    Text3:"Full name",
    Text4:"Name is required",
    Text5:"Date of birth",
    Text6:"Date of birth is required.",
    Text7:"Gender",
    Text8:"Male",
    Text9:"Female",
    Text10:"Gender is required",
    Text11:"Address",
    Text12:"Adress is requiered",
    Text13:"Phone number",
    Text14:"Phone number",
    Text15:"Email",
    Text16:"Email is required",
    Text17:"Language",
    Text18:"Language is required",
    Text19:"Choose a membership",
    Text20:"Please read the terms and conditions and sign.",
    Text21:"I agree to the terms and conditions",
    Text22:"Select",
    Text23:"Clear",
    Text24:"Confirm",
		Text25:"Please enter your family details below."
  },
},
}

language_change()
let familyarray = []

window.onload = function open_page() {
error_massege_portugues()
estado_select_en()
image_get(gymname)
}

function image_get(){
  document.getElementById("image").src =  `/signature-project-front/image/${gymname}_add.png`
}


document.getElementById("man-checkbox").addEventListener('click', () => {
plans_div.innerHTML=""
})
document.getElementById("women-checkbox").addEventListener('click', () => {
plans_div.innerHTML=""
})




//tratamento da seleção de idioma
var idioma = '';
  inputs[13].addEventListener('click', () => {
    idioma = "Portugues";
  document.getElementById("language1").style.backgroundColor = '#2C7CFF';
  document.getElementById("language1").style.color = 'white';
  document.getElementById("language2").style.color = '#666666';
  document.getElementById("language3").style.color = '#666666';
  document.getElementById("language1").style.fontWeight = "bold";
  document.getElementById("language2").style.backgroundColor = '#d3d3d3';
  document.getElementById("language3").style.backgroundColor = '#d3d3d3';
  });
  inputs[14].addEventListener('click', () => {
    idioma = "日本語";
    document.getElementById("language2").style.backgroundColor = '#2C7CFF';
    document.getElementById("language2").style.color = 'white';
    document.getElementById("language1").style.color = '#666666';
    document.getElementById("language3").style.color = '#666666';
    document.getElementById("language2").style.fontWeight = "bold";
    document.getElementById("language1").style.backgroundColor = '#d3d3d3';
    document.getElementById("language3").style.backgroundColor = '#d3d3d3';
  });
  inputs[15].addEventListener('click', () => {
    idioma = "Inglês";
    document.getElementById("language3").style.backgroundColor = '#2C7CFF';
    document.getElementById("language3").style.color = 'white';
    document.getElementById("language2").style.color = '#666666';
    document.getElementById("language1").style.color = '#666666';
    document.getElementById("language3").style.fontWeight = "bold";
    document.getElementById("language1").style.backgroundColor = '#d3d3d3';
    document.getElementById("language2").style.backgroundColor = '#d3d3d3';
  });


function error_massege_portugues(){
   errormessage1 = "Verifique o campo do mês"
   errormessage2 = "Verifique o campo do dia"
   errormessage3 = "Selecione o idioma"
   errormessage4 = "Selecione um plano"
   errormessage5 = "Selecione o sexo"
   errormessage6 = "Verifique a políticas da academia"
   errormessage7 = "O ano da data de nascimento deve ser 4 dígitos"
   errormessage8 = "O mês da data de nascimento deve deve ser 2 dígitos"
   errormessage9 = "O dia deve ser 2 dígitos"
   errormessage10 = "Assine por favor"
   errormessage11 = "A data insirida é invalida"
   errormessage12 = "O dia deve ser 2 dígitos"
}

function error_massege_ingles(){
   errormessage1 = "Check your birth month"
   errormessage2 = "Check your birth day"
   errormessage3 = "Please select a language"
   errormessage4 = "Select plan"
   errormessage5 = "Selct gender"
   errormessage6 = "Check academy policies"
   errormessage7 = "Please enter your date(year) of birth in 4 digits"
   errormessage8 = "Please enter your date(month) of birth in 2 digits"
   errormessage9 = "Please enter your date(day) of birth in 2 digits"
   errormessage10 = "Please sign"
   errormessage11 = "Check　date"
   errormessage12 = "Please enter date in 2 digits"
}
function error_massege_japanese(){
   errormessage1 = "年月日の月を選択してください"
   errormessage2 = "生年月日の非を選択してください"
   errormessage3 = "言語を選択してください"
   errormessage4 = "プランを選択してください"
   errormessage5 = "性別を選択してください"
   errormessage6 = "利用規約に同意する必要があります"
   errormessage7 = "生年月日の年は４桁で入力してください"
   errormessage8 = "生年月日の月は2桁で入力してください"
   errormessage9 = "生年月日の日は2桁で入力してください"
   errormessage10 = "署名をしてください"
   errormessage11 = "入力の日付を確認ください"
   errormessage12 = "2桁で入力してください"
}


 async function saveData() {
  try{
	const activedate = await `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
    let gen = () => {       //tratamento da seleção de gênero
      if(document.getElementById("man-checkbox").checked) {
        return 'man'
      }
      else if(document.getElementById("man-checkbox").checked) {
        return 'women'
      }
    }
  var obj =
  {
    "nm_member": inputs[0].value,
    "birthday_year": inputs[1].value,
    "birthday_month": inputs[2].value,
    "birthday_day": inputs[3].value,
    "birthday_age": inputs[4].value,
    "genero": gen(),
    "adress_input": inputs[7].value,
    "phone01": inputs[8].value,
    "phone02": inputs[9].value,
    "phone03": inputs[10].value,
    "email": inputs[11].value + '@' + inputs[12].value,
    "lang01": idioma,
    "plans": plan,
    "signature": signaturePad.toDataURL("image/png"),
    "gymname": gymname, //,//sessionStorage.getItem("gym"),,
    "gymid" : gymid,
    "active_date" : activedate,
    "inactive_date": 0
  }

  const saveAnswer1 = await save1(obj)
   if(saveAnswer1==1){
  const payment = await fetch(`https://squid-app-ug7x6.ondigitalocean.app/payment/${obj.nm_member}/${gymid}/${obj.plans}/${valor}`);
  const	pdfcreate = await ejspdf();
          if(familyarray.length!=0){
            for(let i = 0;i<familyarray.length;i++){
                 name=familyarray[i].split("_")[0]
                 birthday=familyarray[i].split("_")[1]
                 gender=familyarray[i].split("_")[2]
                 age=familyarray[i].split("_")[3]
            const family = await fetch(`https://squid-app-ug7x6.ondigitalocean.app/parents/${name}/${birthday}/${gender}/${age}/${gymid}`)
            	}
            }
    return 2
}
}catch (error) {
  return 1
}
}

function ejspdf() {
  fetch('https://squid-app-ug7x6.ondigitalocean.app/pdf')
  .then((x) => x.json())
  .then((response) => {
  })
}

async function save1(obj){
await  fetch('https://squid-app-ug7x6.ondigitalocean.app/member',
    {method: 'POST',
     body: JSON.stringify(obj),
    headers: {"Content-type": "application/json; charset=UTF-8"}})
    .then((x)=> x.json())
    .then((response) => {
  })
  return 1
}

function generatePDF() {
/*   const element = document.getElementById("body");
  const element2 = document.getElementById('principal');
  element.style.width = '770px';
  element2.style.width = '770px';

  let opt = {
    margin: 0,
    filename: 'CTR.PDF',
    image: { type: 'jpeg', quality: 0.98 },
    htmlcanvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save(); */
}


const canvas = document.querySelector("canvas");
const btnClear = document.querySelector("#cancel-button");
const signaturePad = new SignaturePad(canvas);
signaturePad.minWidth = 1;
signaturePad.maxWidth = 1;
signaturePad.penColor = "#000";

function resizeCanvas() {
  const ratio =  Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
  signaturePad.clear(); // otherwise isEmpty() might return incorrect value
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

btnClear.addEventListener('click', function (event) {
  signaturePad.clear();
});

document.getElementById("confirm-button").addEventListener("click", confirm_check)
async function confirm_check(){
	if(familyflug){
     parentsdataCreate()
	}else{
  let name_error = document.getElementById("nameerror");
  let birthday_year_error = document.getElementById("birthday-error");
  let adress_error = document.getElementById("adress-error");
  let phone_error = document.getElementById("phone-error");
  let email_error = document.getElementById("email-error");
  let name_input = document.getElementById("name-input").value;
  let birthday_year = document.getElementById("birthday_year").value;
  let birthday_month = document.getElementById("birthday_month").value;
  let birthday_day = document.getElementById("birthday_day").value;
  let adress_input = document.getElementById("adress-input").value;
  let phone1 = document.getElementById("phone1").value;
  let phone2 = document.getElementById("phone2").value;
  let phone3 = document.getElementById("phone3").value;
  let email1 = document.getElementById("email1").value;
  let email2 = document.getElementById("email2").value;
  let kubun_check = 0;
  if(document.getElementById("politc-checkbox").checked) {
  }else{
    errormessage = errormessage6
    swallerror(errormessage)
    kubun_check = 1
  }
  if(signaturePad.isEmpty()){
    errormessage = errormessage10
    swallerror(errormessage)
    kubun_check = 1
  }
   if(idioma==""){
    errormessage = errormessage3
    swallerror(errormessage)
    kubun_check = 1
  }
	if(plan==""){
    errormessage = errormessage4
    swallerror(errormessage)
    kubun_check = 1
  }
  if(name_input==""){
    name_error.style.display ="block";
    location.href = "#fullnametitle";
    kubun_check = 1
  }else{
    name_error.style.display ="none";
  }
   if(birthday_year=="" || birthday_month=="" || birthday_day==""){
    birthday_year_error.style.display ="block";
    location.href = "#birthdaytitle";
    kubun_check = 1
  }else if(kubun_check ==1){
  }else{
      birthday_year_error.style.display ="none";
  }
  if(birthday_year=="" || birthday_month=="" || birthday_day==""){
    birthday_year_error.style.display ="block";
    location.href = "#birthdaytitle";
    kubun_check = 1
  }else if(kubun_check ==1){
  }else{
    birthday_year_error.style.display ="none";
  }
if(adress_input==""){
  adress_error.style.display ="block";
  location.href = "#adress";
  kubun_check = 1
}else if(kubun_check ==1){
  }else{
    adress_error.style.display ="none";
}
if(phone1=="" || phone2=="" || phone3==""){
  phone_error.style.display ="block";
  location.href = "#phonenumber";
  kubun_check = 1
}else if(kubun_check ==1){
  }else{
    phone_error.style.display ="none";
    kubun_check = 0
}
if(document.getElementById("man-checkbox").checked||document.getElementById("women-checkbox").checked) {
}else{
  errormessage = errormessage5
  swallerror(errormessage)
  kubun_check = 1
}
 if(email1=="" || email2==""){
  email_error.style.display ="block";
  location.href = "#email";
  kubun_check = 1
  }else if(kubun_check ==1){
  }else{
  email_error.style.display ="none";
  }
if(kubun_check==0){
    Swal.fire({
   title: stext32[language]
  , html: stext33[language]
  , type: 'warning'
  , showCancelButton: true
  , confirmButtonText: 'OK'
  , cancelButtonText: 'Cancel'
  , reverseButtons: true
  ,allowOutsideClick:false
}).then(async(result) =>{
    if(result.isConfirmed) {
  const swalConfirm =  Swal.fire({
       title: stext30[language]
     , html: stext31[language]
     , allowOutsideClick : false
     , showConfirmButton: false
     , onBeforeOpen: () => {
         Swal.showLoading();
       }
     });
      const saveAnswer = await saveData()
      await Swal.fire({
         title: stext28[language]
       , html : stext29[language]
       , type : 'success'
       ,timer:1500
       });
       if(saveAnswer==2){
         await location.reload()
       }

   };
  });
 }
}
}

function parentsdataCreate(){
	if(mylanguage=="pt"){
		text1 = "Registrar os dados do familiar"
		text2 = "Nome completo"
		text3 = "Data de nascimento"
		text4 = "Sexo"
		text5 = "Adicionar mais"
		text6 = "Salvar"
		text7 = `<option value="1">Masculino</option><option value="2">Feminino</option>`
	}else if(mylanguage=="en"){
		text1 = "Please enter your family details below"
		text2 = "Full name"
		text3 = "Birthday"
		text4 = "Gender"
		text5 = "Next regist"
		text6 = "Save"
		text7 = `<option value="1">Male</option><option value="2">Female</option>`
	}else{
		text1 = "家族として登録する人の情報を入力してください"
		text2 = "フルネーム"
		text3 = "生年月日"
		text4 = "性別"
		text5 = "次の人を登録"
		text6 = "完了"
		text7 = `<option value="1">男性</option><option value="2">女性</option>`
	}
	Swal.fire({//mylanguage
 	 title: `${text1}`,
	 showCancelButton: true,
	 showConfirmButton: true,
	 confirmButtonText: `${text5}`,
	 cancelButtonText: `${text6}`,
	 customClass: 'customizable'
  , html : `
	 <div>
	  <div class="div-block">
		 <div class="div-div"><span>${text2}</span></div>
		 <div class="div-div"><input id="familyname"/></div>
		</div>
		<hr class="underbar" />
		<div  class="div-block">
		 <div class="div-div"><span>${text3}</span></div>
     <div  class="div-div" id ="try">
				<input
					maxlength="4"
					id="f-birthday_year"
					class="birthday"
					placeholder="YYYY"
				/>
				<input
					maxlength="2"
					id="f-birthday_month"
					class="birthday"
					placeholder="MM"
				/>
				<input
					maxlength="2"
					id="f-birthday_day"
					class="birthday"
	        placeholder="DD"
				/>
		</div>
	 </div>
	 <hr class="underbar" />
	 <div class="div-block">
		<div class="div-div"><span>${text4}</span></div>
		<div class="div-div">
		  <select id="f-gender">
       ${text7}
			</select>
		</div>
	 </div>
	</div>

	 <style>
span{
	font-size:2vw;
}
input {
	width:80%;
	height:60px;
}
	 .div-block{
		 display:block;
     width:90%;
		 align-items: left;
		 margin-top:15px;
		 margin-left: 5%;
	 }
	 .swal2-popup {
	     width: 70% !important
	 }
	 .div-div{
		 display:flex;
		  width:90% !important;

	 }
	 .birthday {
		 width:25%;
    margin-left:3px;
	 }
	 select{
		 width:50%;
		 height:60px;
		 font-size:2.5vw;
	 }
	 .underbar{
	   width: 95%;
	 }
	 .customizable button {
		 margin-top:0px  !important;
		 font-size: 2.5vh  !important;
		 width: 250px !important;
		 height: 70px !important;
	 }

@media screen and (max-width: 500px) {
  span{
  	font-size:2.5vw;
  }
  .div-block{
    margin-top:4px;
  }
  select{
    width:80%;
    height:40px;
  }
  input {
  	width:100%;
  	height:40px;
    font-size:2.5vw;
  }
  .birthday {
    width:30%;
  }
  .underbar{
    margin-top: 5px;
}

}
	 </style>
	 `
  }).then((result) => {
		myname = document.getElementById("familyname").value
		mybirthday = document.getElementById("f-birthday_year").value + "-" + document.getElementById("f-birthday_month").value + "-" + document.getElementById("f-birthday_day").value
		mygender = document.getElementById("f-gender").value
		const birthday = {
		year: document.getElementById("f-birthday_year").value,
		month: document.getElementById("f-birthday_month").value,
		date: document.getElementById("f-birthday_day").value
		 };
	 let age = getAge(birthday)
		myfamily = `${myname}_${mybirthday}_${mygender}_${age}`
    if (result.isConfirmed) {
			 familyarray.push(myfamily)
			 parentsdataCreate()
		}else{
			familyconfirmflug = true
			familyarray.push(myfamily)
			familyflug = false
			confirm_check()
		}
	})

}



function birthday_date_get(){
  let birthday_year = document.getElementById("birthday_year").value;
  let birthday_month = document.getElementById("birthday_month").value;
  let birthday_day = document.getElementById("birthday_day").value;
if(birthday_month>13){
  errormessage = errormessage1
  swallerror(errormessage)
}else if(birthday_day>31){
  errormessage = errormessage2
  swallerror(errormessage)
}
  if(birthday_year != "" && birthday_month != "" && birthday_day != ""){
    if(birthday_year.length!=4){
   document.getElementById("birthday_age").value = ""
       errormessage =  errormessage7
       swallerror(errormessage)
   }else if(birthday_month.length!=2){
      document.getElementById("birthday_age").value = ""
      errormessage = errormessage8
      swallerror(errormessage)
   }else if(birthday_day.length!=2){
      document.getElementById("birthday_age").value = ""
      errormessage = errormessage12
      swallerror(errormessage)
    }else{
      plans_div.innerHTML = ""
    const birthday = {
    year: birthday_year,
    month: birthday_month,
    date: birthday_day
  };
     var strDate = birthday_year + "/" + birthday_month + "/" + birthday_day
     if(!strDate.match(/^\d{4}\/\d{2}\/\d{2}$/)){
         }
         var y = strDate.split("/")[0];
         var m = strDate.split("/")[1] - 1;
         var d = strDate.split("/")[2];
         var date = new Date(y,m,d);
         if(date.getFullYear() != y || date.getMonth() != m || date.getDate() != d){
           errormessage = errormessage11
             document.getElementById("birthday_age").value = ""
           swallerror(errormessage)
         }
          getAge(birthday)
     }
}else{
}
}

function getAge(birthday){
    var thisYearsBirthday = new Date(today.getFullYear(), birthday.month-1, birthday.date);//今年の誕生
    var age = today.getFullYear() - birthday.year;  //年齢
   if(today < thisYearsBirthday){        //今年まだ誕生日が来ていない
      age--;
    }
    document.getElementById("birthday_age").value = age
    return age;
}




function yearfunc(){
  document.getElementById("birthday_year").value=""
}
function monthfunc(){
  document.getElementById("birthday_month").value=""
}
function dayfunc(){
  document.getElementById("birthday_day").value=""
}
if(birthday_year==""){

}





document.getElementById("selectlanguage").addEventListener("change",language_change)

function language_change(){
   selectlanguage = document.getElementById( "selectlanguage" ).value
	// if(document.getElementById("birthday_age").value!=""){
		//  planget(plans_kubun)
//	 }
if (selectlanguage=="0"){
   portugues()
   error_massege_portugues()
   estado_select_en()
	 mylanguage = "pt"
   language = 0
} else if(selectlanguage=="1"){
 ingles()
 error_massege_ingles()
 estado_select_en()
 mylanguage = "en"
  language = 1
}else{
japones()
error_massege_japanese()
estado_select_jp()
mylanguage = "jp"
language = 2
}

function portugues() {
document.getElementById("welcomemessage").innerText=past.pt.Text.Text1;
document.getElementById("welcomemessage").innerText=past.pt.Text.Text2;
document.getElementById("fullnametitle").innerText=past.pt.Text.Text3;
document.getElementById("nameerror").innerText=past.pt.Text.Text4;
document.getElementById("birthdaytitle").innerText=past.pt.Text.Text5;
document.getElementById("birthday-error").innerText=past.pt.Text.Text6;
document.getElementById("gendertitle").innerText=past.pt.Text.Text7;
document.getElementById("gender-man").innerText=past.pt.Text.Text8;
document.getElementById("gender-women").innerText=past.pt.Text.Text9;
document.getElementById("gender-error").innerText=past.pt.Text.Text10;
document.getElementById("adress").innerText=past.pt.Text.Text11;
document.getElementById("adress-error").innerText=past.pt.Text.Text12;
document.getElementById("phonenumber").innerText=past.pt.Text.Text13;
document.getElementById("phone-error").innerText=past.pt.Text.Text14;
document.getElementById("email").innerText=past.pt.Text.Text15;
document.getElementById("email-error").innerText=past.pt.Text.Text16;
document.getElementById("language").innerText=past.pt.Text.Text17;
document.getElementById("languagen-error").innerText=past.pt.Text.Text18;
document.getElementById("planselect").innerText=past.pt.Text.Text19;
document.getElementById("politic-title").innerText=past.pt.Text.Text20;
document.getElementById("politiclink").innerText=past.pt.Text.Text21;
document.getElementById("cancel-button").value=past.pt.Text.Text23;
document.getElementById("confirm-button").value=past.pt.Text.Text24;
document.getElementById("plan-one-select").value = "Planos particular";
document.getElementById("plan-family-select").value = "Planos familiar";
}
function japones() {
  document.getElementById("welcomemessage").innerText=past.jp.Text.Text1;
  document.getElementById("welcomemessage").innerText=past.jp.Text.Text2;
  document.getElementById("fullnametitle").innerText=past.jp.Text.Text3;
  document.getElementById("nameerror").innerText=past.jp.Text.Text4;
  document.getElementById("birthdaytitle").innerText=past.jp.Text.Text5;
  document.getElementById("birthday-error").innerText=past.jp.Text.Text6;
  document.getElementById("gendertitle").innerText=past.jp.Text.Text7;
  document.getElementById("gender-man").innerText=past.jp.Text.Text8;
  document.getElementById("gender-women").innerText=past.jp.Text.Text9;
  document.getElementById("gender-error").innerText=past.jp.Text.Text10;
  document.getElementById("adress").innerText=past.jp.Text.Text11;
  document.getElementById("adress-error").innerText=past.jp.Text.Text12;
  document.getElementById("phonenumber").innerText=past.jp.Text.Text13;
  document.getElementById("phone-error").innerText=past.jp.Text.Text14;
  document.getElementById("email").innerText=past.jp.Text.Text15;
  document.getElementById("email-error").innerText=past.jp.Text.Text16;
  document.getElementById("language").innerText=past.jp.Text.Text17;
  document.getElementById("languagen-error").innerText=past.jp.Text.Text18;
  document.getElementById("planselect").innerText=past.jp.Text.Text19;
  document.getElementById("politic-title").innerText=past.jp.Text.Text20;
  document.getElementById("politiclink").innerText=past.jp.Text.Text21;
  document.getElementById("cancel-button").value=past.jp.Text.Text23;
  document.getElementById("confirm-button").value=past.jp.Text.Text24;
  document.getElementById("plan-one-select").value = "個人プラン";
  document.getElementById("plan-family-select").value = "ファミリープラン";
}
function ingles() {
  document.getElementById("welcomemessage").innerText=past.en.Text.Text1;
    document.getElementById("welcomemessage").innerText=past.en.Text.Text2;
    document.getElementById("fullnametitle").innerText=past.en.Text.Text3;
    document.getElementById("nameerror").innerText=past.en.Text.Text4;
    document.getElementById("birthdaytitle").innerText=past.en.Text.Text5;
    document.getElementById("birthday-error").innerText=past.en.Text.Text6;
    document.getElementById("gendertitle").innerText=past.en.Text.Text7;
    document.getElementById("gender-man").innerText=past.en.Text.Text8;
    document.getElementById("gender-women").innerText=past.en.Text.Text9;
    document.getElementById("gender-error").innerText=past.en.Text.Text10;
    document.getElementById("adress").innerText=past.en.Text.Text11;
    document.getElementById("adress-error").innerText=past.en.Text.Text12;
    document.getElementById("phonenumber").innerText=past.en.Text.Text13;
    document.getElementById("phone-error").innerText=past.en.Text.Text14;
    document.getElementById("email").innerText=past.en.Text.Text15;
    document.getElementById("email-error").innerText=past.en.Text.Text16;
    document.getElementById("language").innerText=past.en.Text.Text17;
    document.getElementById("languagen-error").innerText=past.en.Text.Text18;
    document.getElementById("planselect").innerText=past.en.Text.Text19;
    document.getElementById("politic-title").innerText=past.en.Text.Text20;
    document.getElementById("politiclink").innerText=past.en.Text.Text21;
    document.getElementById("cancel-button").value=past.en.Text.Text23;
    document.getElementById("confirm-button").value=past.en.Text.Text24;
    document.getElementById("plan-one-select").value = "Private plans";
    document.getElementById("plan-family-select").value = "Family plans";
}
}
function ken_select_remove(){
  sl = document.getElementById('kenselect');
	while(sl.lastChild)
	{
		sl.removeChild(sl.lastChild);
	}
}
function ken_select_option_add(arr){
  for(var i=0;i<arr.length;i++){
     let op = document.createElement("option");
     op.value = arr[i].val;  //value値
     op.text = arr[i].txt;   //テキスト値
     document.getElementById("kenselect").appendChild(op);
   }
}

function estado_select_jp(){
  ken_select_remove()
  var arr = [
  {val:"愛知県",  txt:"愛知県"},
  {val:"岐阜県",  txt:"岐阜県"},
  {val:"静岡県",  txt:"静岡県"},
  {val:"三重県",  txt:"三重県"},
  {val:"北海道",  txt:"北海道"},
  {val:"青森県",  txt:"青森県"},
  {val:"岩手県",  txt:"岩手県"},
  {val:"宮城県",  txt:"宮城県"},
  {val:"秋田県",  txt:"秋田県"},
  {val:"山形県",  txt:"山形県"},
  {val:"福島県",  txt:"福島県"},
  {val:"茨城県",  txt:"茨城県"},
  {val:"栃木県",  txt:"栃木県"},
  {val:"群馬県",  txt:"群馬県"},
  {val:"埼玉県",  txt:"埼玉県"},
  {val:"千葉県",  txt:"千葉県"},
  {val:"東京都",  txt:"東京都"},
  {val:"神奈川県",  txt:"神奈川県"},
  {val:"新潟県",  txt:"新潟県"},
  {val:"富山県",  txt:"富山県"},
  {val:"石川県",  txt:"石川県"},
  {val:"福井県",  txt:"福井県"},
  {val:"山梨県",  txt:"山梨県"},
  {val:"長野県",  txt:"長野県"},
  {val:"滋賀県",  txt:"滋賀県"},
  {val:"京都府",  txt:"京都府"},
  {val:"大阪府",  txt:"大阪府"},
  {val:"兵庫県",  txt:"兵庫県"},
  {val:"奈良県",  txt:"奈良県"},
  {val:"和歌山県",  txt:"和歌山県"},
  {val:"鳥取県",  txt:"鳥取県"},
  {val:"島根県",  txt:"島根県"},
  {val:"岡山県",  txt:"岡山県"},
  {val:"広島県",  txt:"広島県"},
  {val:"山口県",  txt:"山口県"},
  {val:"徳島県",  txt:"徳島県"},
  {val:"香川県",  txt:"香川県"},
  {val:"愛媛県",  txt:"愛媛県"},
  {val:"高知県",  txt:"高知県"},
  {val:"福岡県",  txt:"福岡県"},
  {val:"佐賀県",  txt:"佐賀県"},
  {val:"長崎県",  txt:"長崎県"},
  {val:"熊本県",  txt:"熊本県"},
  {val:"大分県",  txt:"大分県"},
  {val:"宮崎県",  txt:"宮崎県"},
  {val:"鹿児島県",  txt:"鹿児島県"},
  {val:"沖縄県",  txt:"沖縄県"},
];
ken_select_option_add(arr)
}

function input_clear(){
document.getElementById("name-input").value="";
document.getElementById("birthday_year").value="";
document.getElementById("birthday_month").value="";
document.getElementById("birthday_day").value="";
document.getElementById("adress-input").value="";
document.getElementById("phone1").value="";
document.getElementById("phone2").value="";
document.getElementById("phone3").value="";
document.getElementById("email1").value="";
document.getElementById("email2").value="";
document.getElementById("birthday_age").value="";
plans_div.innerHTML =""
signaturePad.clear();
}

function estado_select_en(){
  ken_select_remove()
  var arr = [
  {val:"Aichi",  txt:"Aichi ken"},
 {val:"Gifu",  txt:"GIfu ken"},
 {val:"Shizuoka",  txt:"Shizuoka ken"},
 {val:"Mie",  txt:"Mie ken"},
 {val:"Hokaido",  txt:"Hokaido ken"},
 {val:"Aomori",  txt:"Aomori ken"},
 {val:"Iwate",  txt:"Iwate ken"},
 {val:"Miyagi",  txt:"Miyagi ken"},
 {val:"Akita",  txt:"Akita ken"},
 {val:"Yamagata",  txt:"Yamagata ken"},
 {val:"Fukushima",  txt:"Fukushima ken"},
 {val:"Ibaraki",  txt:"Ibaraki ken"},
 {val:"Tojigi",  txt:"Tojigi ken"},
 {val:"Gunma",  txt:"Gunma ken"},
 {val:"Saitama",  txt:"Saitama ken"},
 {val:"Chiba",  txt:"Chiba ken"},
 {val:"Toukyo",  txt:"Toukyo to"},
 {val:"Kanagawa",  txt:"Kanagawa ken"},
 {val:"Niigata",  txt:"Niigata ken"},
 {val:"Toyama",  txt:"Toyama ken"},
 {val:"Ishikawa",  txt:"Ishikawa ken"},
 {val:"Fukui",  txt:"Fukui ken"},
 {val:"Yamanashi",  txt:"Yamanashi ken"},
 {val:"Nagano",  txt:"Nagano ken"},
 {val:"Shiga",  txt:"Shiga ken"},
 {val:"Kyouto",  txt:"Kyouto fu"},
 {val:"Osaka",  txt:"Osaka fu"},
 {val:"Hyougo",  txt:"Hyougo ken"},
 {val:"Nara",  txt:"Nara ken"},
 {val:"Wakayama",  txt:"Wakayama ken"},
 {val:"Totori",  txt:"Totori ken"},
 {val:"Shimane",  txt:"Shimane ken"},
 {val:"Okayama",  txt:"Okayama ken"},
 {val:"Hiroshima",  txt:"Hiroshima ken"},
 {val:"Yamaguchi",  txt:"Yamaguchi ken"},
 {val:"Tokushima",  txt:"Tokushima ken"},
 {val:"Kagawa",  txt:"Kagawa ken"},
 {val:"Ehime",  txt:"Ehime ken"},
 {val:"Kouchi",  txt:"Kouchi ken"},
 {val:"Fukuoka",  txt:"Fukuoka ken"},
 {val:"Saga",  txt:"Saga ken"},
 {val:"Nagasaki",  txt:"Nagasaki ken"},
 {val:"Kumamoto",  txt:"Kumamoto ken"},
 {val:"Oita",  txt:"Oita ken"},
 {val:"Miyazaki",  txt:"Miyazaki ken"},
 {val:"Kagoshima",  txt:"Kagoshima ken"},
 {val:"Okinawa",  txt:"Okinawa ken"}
];
ken_select_option_add(arr)
}

function swallerror(errormessage){
  Swal.fire({
  title: 'error',
  icon: 'warning',
  showCancelButton: false,
  showConfirmButton: true,
  ConfirmButtonText: '戻る',
  width: 300,
  html:`<span>${errormessage}</span>`,
  customClass: "sweet-alert",
  })
}

document.getElementById("politiclink").addEventListener("click", swallpolitic)
function swallpolitic(){
const swalpolitc =  Swal.fire({
  title: stext35[language],
  icon: 'warning',
  showCancelButton: true,
  showConfirmButton: true,
  confirmButtonText: stext26[language],
  allowOutsideClick:false,
  width: 710,
  html:`<div id="politc-span">
  <OBJECT class="politc-area" DATA="../politc/${gymid}_${language}.txt"TYPE="text/plain" WIDTH="100%" HEIGHT="100%"   style="font-size:5vh;">
</OBJECT>
</div>
`,
  customClass: "sweet-alert",
  ConfirmButtonText: '戻る',
}).then((result) =>{
       if(result.isConfirmed) {
         document.getElementById("politc-checkbox").checked = true

       }else{
         document.getElementById("politc-checkbox").checked = false

       }
  })
}




function swall_success(){
  Swal.fire({
      icon: "success",
   title: '完了',
    }
   )
}

//プランセレクト時の処理、ボタン色・div枠線、色の変更
function select_plan_click(data){
	plan=data.split("_")[2]
  valor = data.split("_")[3]
}


async function makerequest(url){
  const request = await fetch(url)  //esperar aqui
 return request.json()
}

//年齢、性別選択時のプランdivの生成
async function Gymplanget(data){
  answerAge = document.getElementById("birthday_age").value
  womenSelect = document.getElementById("women-checkbox")
  manSelect = document.getElementById("man-checkbox")
  let plansAnswer = []
if(answerAge==""){
}
if(womenSelect.checked==false){
}
if(manSelect.checked==false){
}
  if(answerAge=="" || womenSelect.checked==false && manSelect.checked==false){
     swallerror(stext34[language])
  }else{
    const swal =  Swal.fire({
            icon:"info",
            title: 'Processing',
            html: 'Wait',
            allowOutsideClick : false,
            showConfirmButton: false,
            timerProgressBar: true,
            onBeforeOpen: () => {
            Swal.showLoading();
        }
      })
    const plansArray = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/gymplanget?id=${gymid}`)
     plans_rows = 0
     if(data==1){
       familyflug = false
       for (let i=0;i<plansArray.length;i++){//年齢に対して制限のあるプラン
          if(plansArray[i].PLAN_KUBUN!=6){
            if((plansArray[i].AGE-0)>=(answerAge-0)){
               plansAnswer.push(plansArray[i])
               plans_rows ++
            }
         }else if(plansArray[i].PLAN_KUBUN==4){
           plansAnswer.push(plansArray[i])
           plans_rows ++
         }
       }
       if(plansAnswer.length==0){
         for(let i=0;i<plansArray.length;i++){
           if(manSelect.checked==true&&plansArray[i].PLAN_KUBUN==1){
             plansAnswer.push(plansArray[i])
              plans_rows ++
           }else if(womenSelect.checked==true&&plansArray[i].PLAN_KUBUN==2){
             plansAnswer.push(plansArray[i])
             plans_rows ++
           }
           if(plansArray[i].PLAN_KUBUN==4){
             plansAnswer.push(plansArray[i])
             plans_rows ++
           }
         }
       }
     }else{
       familyflug = true
       for(let i=0;i<plansArray.length;i++){
        if(plansArray[i].PLAN_KUBUN==3){
           plansAnswer.push(plansArray[i])
           plans_rows ++
        }
       }
     }
      await creaetDivPlan(plansAnswer)
      swal.close()
    }
}

function creaetDivPlan(res){
  	plans_div.innerHTML =""
    plan=""
  for(let i=0;i<res.length;i++){
    row = `
    <div class="plan_main_new_div" id="plan_div_${i}">
             <span class="plan_name_new">${res[i].PLANS_NAME}</span>
             <span id="'planvalue_${i}'" class="plandisc_value">￥${res[i].PLAN_VALOR}</span>
             <span class="plandisc">${res[i].PLAN_DISCRITION1}</span>
             <span class="plandisc">${res[i].PLAN_DISCRITION2}</span>
             <span class="plandisc" >${res[i].PLAN_DISCRITION3}</span>
             <span class="plandisc">${res[i].PLAN_DISCRITION4}</span>
             <span class="plandisc">${res[i].PLAN_DISCRITION5}</span>
             <input class="plan-new-select-button" type="button" id="'select_button_${i}'" value="${stext27[language]}" onclick="select_plan_click('plan_div_${res[i].CONTROL_NAME}_${res[i].PLAN_VALOR}')"/>
            </div>`
           	plans_div.innerHTML += row
  }
}

function genderCheck(data){
  if(data==1){
    document.getElementById('women-checkbox').checked = false
  }else{
    document.getElementById('man-checkbox').checked = false
  }
}


/* // Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible parameters)
signaturePad.toDataURL(); // save image as PNG
signaturePad.toDataURL("image/jpeg"); // save image as JPEG
signaturePad.toDataURL("image/jpeg", 0.5); // save image as JPEG with 0.5 image quality
signaturePad.toDataURL("image/svg+xml"); // save image as SVG

// Draws signature image from data URL (mostly uses https://mdn.io/drawImage under-the-hood)
// NOTE: This method does not populate internal data structure that represents drawn signature. Thus, after using #fromDataURL, #toData won't work properly.
signaturePad.fromDataURL("data:image/png;base64,iVBORw0K...");

// Draws signature image from data URL and alters it with the given options
signaturePad.fromDataURL("data:image/png;base64,iVBORw0K...", {
  ratio: 1,
  width: 400,
  height: 200,
  xOffset: 100,
  yOffset: 50,
});*/



/*
// Returns signature image as an array of point groups
const data = signaturePad.toData();

// Draws signature image from an array of point groups
signaturePad.fromData(data);

// Draws signature image from an array of point groups, without clearing your existing image (clear defaults to true if not provided)
signaturePad.fromData(data, { clear: false });

// Clears the canvas
signaturePad.clear();

// Returns true if canvas is empty, otherwise returns false
signaturePad.isEmpty();

// Unbinds all event handlers
signaturePad.off();

// Rebinds all event handlers
signaturePad.on();
 */

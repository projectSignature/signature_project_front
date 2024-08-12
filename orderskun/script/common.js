async function makerequest(url){
  const request = await fetch(url)  //esperar aqui
  return request.json()
}

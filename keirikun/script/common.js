const loadingIndicator = document.getElementById('loading-indicator');




async function swallSuccess(){
  const Toast = await Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    customClass: {
      popup: 'colored-toast'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  Toast.fire({
    icon: 'success',
    title: translations[userInfo.language]['done'],
    html: translations[userInfo.language]['successMessage'],
    iconHtml: '<i class="fas fa-check-circle"></i>',
    background: '#fff',
    color: '#000',
    iconColor: '#28a745'
  })
}

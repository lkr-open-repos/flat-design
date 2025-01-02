document.addEventListener('DOMContentLoaded', () => {
    const myBtn = document.querySelector('.my-btn');
    const myBox = document.getElementById('my-box');

    myBtn.addEventListener('click', ()=>{
       myBox.classList.toggle('show')
        if(myBox.classList.contains('show')){
           myBox.classList.remove('hidden');
           myBtn.textContent = 'Hide Box'
        }else{
           myBox.classList.add('hidden');
           myBtn.textContent = 'Click Me'
        }
    })
 });
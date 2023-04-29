let burger = document.getElementById('burger'),
    nav    = document.getElementById('main-nav'),
    slowmo = document.getElementById('slowmo');

if(burger){
    burger.addEventListener('click', function(e){
        this.classList.toggle('is-open');
        nav.classList.toggle('is-open');
    });
} else {
    console.log('No burger');
}

if(slowmo){
    slowmo.addEventListener('click', function(e){
        this.classList.toggle('is-slowmo');
    });
} else {
    console.log('No slowmo');
}
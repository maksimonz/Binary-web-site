'use strict';
window.addEventListener('DOMContentLoaded', () => {

    const getResource = async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        const res = await fetch(url, {method, body, headers})

        if(!res.ok){
            throw new Error (`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };

    //---LOAD CONTENT API----//
    const portfolioContent = document.querySelector('.portfolio__img-content');
    let baseQuantity = 0;
    let picsQuantity = 6;

    const getContent = (baseQuantity, picsQuantity) => {
        getResource('http://localhost:3000/portfolio-img')
        .then(data => data.slice(baseQuantity, picsQuantity))
        .then(data => data.forEach(({name, src}) => {
            let div = document.createElement('div');
            let img = document.createElement('img');
            div.classList.add('img-item');
            img.classList.add('slide-pic');
            div.id = name;
            img.src = src;
            img.alt = name;

            portfolioContent.appendChild(div);

            div.appendChild(img);

            if(data.length < 6) {
                portfolioBtn.remove();
            }
            
            div.addEventListener('click', (e) => {
                imgSlide.classList.remove('hide');
                imgSlide.classList.add('show');
                document.body.style.overflow = 'hidden';
                let img = document.createElement('img');
                img.classList.add('slide-pic');
                img.src = e.target.src;
                portfolioPic.appendChild(img);
            })
        }))
        .catch(e => {
            console.log(e.message);
        })
    }

    getContent(baseQuantity, picsQuantity);

    //---HEADER BUTTON----//

    const headerBlock = document.querySelector('.header');
    const headerBtn = document.querySelector('#btn-header');
    const headerNavs = document.querySelectorAll('.header-nav');

    headerBtn.addEventListener('click', () => {
        headerBlock.classList.add('screen-up');
    })

    document.addEventListener('scroll', () => {
        headerBlock.classList.remove('screen-up');
    })

    function removeActiveClass () {
        headerNavs.forEach((item) => {
            item.classList.remove('active');
        });
    };

    headerNavs.forEach((nav) => {
        nav.addEventListener('click', (e) => {
            e.preventDefault();
            removeActiveClass()
            e.target.classList.add('active');
  
            const portfolioContent = document.querySelectorAll('.portfolio__img-content .img-item');
            portfolioContent.forEach(item => {
                item.classList.remove('hide')
                item.classList.add('show')
                if(e.target.id === 'all') {
                    item.classList.remove('hide')
                    item.classList.add('show')
                } else if(item.id === e.target.id) {
                    console.log(1);
                    item.classList.add('show');
                } else {
                    console.log(0);
                    item.classList.add('hide');
                }

            })
        })
    })

     //---PORTFOLIO----//

     const imgSlide = document.querySelector('.img-slide');
     const slideClose = document.querySelector('.fa-xmark');
     const portfolioPic = document.querySelector('.img-slide__picture');

     const portfolioBtn = document.querySelector('.portfolio__btn-more-info > button');
     
    slideClose.addEventListener('click', () => {
        imgSlide.classList.remove('show');
        imgSlide.classList.add('hide');
        document.body.style.overflow = '';
        portfolioPic.removeChild(portfolioPic.firstElementChild);
    })

    imgSlide.addEventListener('click', (e) => {
        if(e.target === imgSlide) {
            imgSlide.classList.remove('show');
            imgSlide.classList.add('hide');
            document.body.style.overflow = '';
            portfolioPic.removeChild(portfolioPic.firstElementChild);
        }
    })

    portfolioBtn.addEventListener('click', () => {
        baseQuantity += 6;
        picsQuantity += 6;
        getContent(baseQuantity, picsQuantity);
    })

     //---MODAL----//

    const modalWindow = document.querySelector('.modal');
    const modalWindowItem = document.querySelector('.modal__message-item');
    const closeX = document.querySelector('.closeBtn');
    const closeBtn = document.querySelector('.close-modal');
    const submitBtn = document.querySelector('.submitBtn');

    modalWindow.addEventListener('click', (e) => {
        if(e.target === modalWindow) {
            closeModal();
        }
    })

    closeX.addEventListener('click', () => {
        closeModal();
    })

    closeBtn.addEventListener('click', () => {
        closeModal();
    })

    document.addEventListener('keydown', (e)=>{
        if(e.code === 'Escape' && modalWindow.classList.contains('showModal')){
            closeModal();
        }
    })

    function openModal(){
        modalWindow.classList.remove('hideModal');
        modalWindow.classList.add('showModal');
        modalWindowItem.classList.add('modal-tranform');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(){
        modalWindow.classList.remove('showModal');
        modalWindow.classList.add('hideModal');
        modalWindowItem.classList.remove('modal-tranform');
        document.body.style.overflow = '';
    }

    //---FORM----//
  
    const form = document.querySelector('.contact-form');
    const inputName = document.querySelector('.input-name');
    const inputEmail = document.querySelector('.input-email');
    const inputMessage = document.querySelector('.input-message'); 

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const errorName = document.querySelector('.errorName'); 
        const errorEmail = document.querySelector('.errorEmail'); 
        const errorMessage = document.querySelector('.errorMessage');  

        const message = {
            loading: "loading",
            success: "Thank you! We will contact you soon",
            failue: "Error,  something went wrong"
        };

        if(inputName.value.length  < 2) {
            inputName.style.borderTopColor = "red";
            errorName.classList.remove('hide');
            errorName.classList.add('show');
        } else {
            inputName.style.borderTopColor = "black";
            errorName.classList.add('hide');
            errorName.classList.remove('show');
        }

        if (!inputEmail.value.match(/^[^\W][a-z\d\.-]*[^\W]@{1}[^\.][\w\da-z-\.]+?\.[\w\da-z-]*[^\W]$/ig)) {
            inputEmail.style.borderTopColor = "red";
            errorEmail.classList.remove('hide');
            errorEmail.classList.add('show');
        } else {
            inputEmail.style.borderTopColor = "black";
            errorEmail.classList.add('hide');
            errorEmail.classList.remove('show');
        }

        if (inputMessage.value.length < 5) {
            inputMessage.style.borderTopColor = "red";
            errorMessage.classList.remove('hide');
            errorMessage.classList.add('show');
        } else {
            inputMessage.style.borderTopColor = "black";
            errorMessage.classList.add('hide');
            errorMessage.classList.remove('show');
        }

        if(inputName.value.length  < 2 || !inputEmail.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/) || inputMessage.value.length < 5) { return }
        
        const spinner = document.querySelector('.loader');
        spinner.classList.remove('hide');
        spinner.classList.add('show');
        
        const formData = new FormData(form);

        const object = {};

        formData.forEach(function(value, key){
            object[key] = value;
        });

        getResource('http://localhost:3000/contact-messages', "POST", JSON.stringify(object))
        .then(data => {
            console.log(data);
            showThanksModal(message.success);
            spinner.classList.remove('show');
            spinner.classList.add('hide');
        }).catch(() => {
            console.log('error');
            showThanksModal(message.failue);
        })
        .finally(() => {
            form.reset();
        });
    })
    
    function showThanksModal(message) {
        const modalMessage= document.querySelector('.info-message');
        openModal();
        modalMessage.textContent = `
            ${message} 
        `;

        setTimeout(() => {
            closeModal();
        }, 5000);
    }
    
});
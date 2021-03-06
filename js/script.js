window.addEventListener("DOMContentLoaded", function () {

    "use strict";

    //Tabs-------------------------------------------------------------------->
    let tabs = document.querySelectorAll(".info-header-tab"),
        tabsContainer = document.querySelector(".info-header"),
        tabsContents = document.querySelectorAll(".info-tabcontent");

    function hideTabsContents(a) {
        for (let i = a; i < tabsContents.length; i++) {
            tabsContents[i].classList.remove('show');
            tabsContents[i].classList.add('hide');
        }
    }
    hideTabsContents(1);

    function showTabContent(b) {
        if (tabsContents[b].classList.contains('hide')) {
            tabsContents[b].classList.remove('hide');
            tabsContents[b].classList.add('show');
        }
    }

    tabsContainer.addEventListener('click', function (event) {
        let target = event.target;
        if (target && target.classList.contains("info-header-tab")) {
            for (let i = 0; i < tabs.length; i++) {
                if (target == tabs[i]) {
                    hideTabsContents(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });
    //<-----------------------------------------------------------------------




    //Timer-------------------------------------------------------------------->
    let deadline = '2020-06-16';

    //Функция определяющая остаток времени, которая возвращает часы, минуты и секунды
    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()), //количество милисекунд = дата дедлайна минус текущая дата
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60)));
        // hours = Math.floor((t/1000/60/60) % 24), //если нужны дни в таймере
        // days = Math.floor((t/(1000*60*60*24)))  

        return {
            'total': t,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
    //Функция превращающая статическую верстку в динамическую
    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);

            function addZero(num) {
                if (num <= 9) {
                    return '0' + num;
                } else return num;
            }

            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }
    setClock('timer', deadline);
//<-------------------------------------------------------------------------/


//Modal window-------------------------------------------------------------------->
    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function() {
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', function() {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });
//<-------------------------------------------------------------------------/


//Form-------------------------------------------------------------------->
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с Вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        inputs = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

    statusMessage.classList.add('status');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        //Получаем все данные, которые ввел пользователь (в виде ключ/значение)
        let formData = new FormData(form);
        
        //Создаем новый объект, в который помещаем все данные от пользователя
        let obj = {};

        //Помещаем все данные объекта formData в объект obj
        formData.forEach(function(value, key) {
            obj[key] = value;
        });

        //Превращаем его в JSON-формат. Получаем переменную, в которой лежат все наши данные с формы
        let json = JSON.stringify(obj);

        //Отправляем запрос на сервер
        request.send(json);

        request.addEventListener('readystatechange', function() {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.status == 200) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
        }
    });
//<-------------------------------------------------------------------------/

});





document.querySelector('.start_btn').addEventListener('click', function () {
    main_animation();
})


function main_animation() {
    document.querySelector('.start_btn').classList.add('_active')
    setTimeout(function () {
        const main_box = document.querySelector('._main_animation');
        main_box.classList.remove('_finish');
        main_box.classList.add('_completed');
        start();
    }, 500)

}



function start() {
    const QUESTIONS = [
        {
            question: "Как вы работаете?",
            assistText: "Это важный вопрос, так как прайсы с НДС и без НДС имеют отличие в ценах",
            answers: [
                "С НДС",
                "БЕЗ НДС",
                "ЗАТРУДНЯЮСЬ ОТВЕТИТЬ",
            ],
        },
        {
            question: "Из какого вы города, региона?",
            assistText: "Ваш ответ поможет в формировании предложения по доставке продукции",
            answers: [
                "Москва ",
                "Санкт-петербург ",
                "Краснодарский край ",
                "Кавказ ",
                "Крым",
                "textarea",
            ],
        },
        {
            question: "Откуда вы о нас узнали?",
            assistText: "Это последний вопрос",
            answers: [
                "Instagram",
                "Google ",
                "Yandex ",
                "По совету ",
                "textarea",
            ],
        },
    ]
    let currentPos = 0;
    const btnPrev = document.querySelector('.back_btn')
    btnPrev.classList.add('_disable')
    const btnNext = document.querySelector('.forward_btn')
    btnNext.classList.add('_disable')

    addEventToBtns();
    btnNext.addEventListener('click', function () {
        if (checkNext()) {
            btnPrev.classList.remove('_disable')
            goToQuest(1);
        } else {
            this.classList.add('_disable')
        }
    })
    btnPrev.addEventListener('click', function () {
        if (checkPrev()) {
            btnNext.classList.remove('_disable')
            goToQuest(-1);
        } else {
            this.classList.add('_disable')
        }
    })
    document.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
            if (checkNext()) {
                btnPrev.classList.remove('_disable')
                goToQuest(1);
            } else {
                btnNext.classList.add('_disable')
            }
        }
        if (event.key == 'Backspace') {
            goToQuest(-1);
        }
    })


    async function addEventToBtns() {
        createQuest(currentPos).then(function () {
            for (let e of document.querySelector('.quiz_container').querySelectorAll('label')) {
                if (e.querySelector('textarea')) {
                    e.querySelector('textarea').addEventListener('change', function () {
                        if (this.value.length !== 0) {
                            btnPrev.classList.remove('_disable')
                            e.previousElementSibling.checked = true;
                            goToQuest(1, 300)
                        }
                    })
                } else {
                    e.addEventListener('click', function () {
                        btnPrev.classList.remove('_disable')
                        goToQuest(1, 300)
                    })
                }
            }
        })
    }
    async function goToQuest(where, delay = 300) {
        console.log(currentPos, QUESTIONS.length - 1);
        if (currentPos === QUESTIONS.length - 1 && where > 0) {
            changeLineBar(currentPos + 1);
            finishForm()
        }
        if (where > 0 && currentPos < QUESTIONS.length - 1) {
            currentPos += +where;
        } else if (where < 0 && currentPos > 0) {
            currentPos += +where;
        } else {
            return
        }
        setText(currentPos);
        changeLineBar(currentPos);
        const questions = document.querySelectorAll('.question_item ');

        function build() {
            let interval = setTimeout(function () {
                questions.forEach(element => {
                    element.classList.remove('_animation');
                });
                questions[currentPos - +where].classList.add('_animation');
                questions[currentPos - +where].classList.remove('_visible');
                questions[currentPos].classList.add('_visible');

            }, delay)
            return new Promise(r => {
                setTimeout(function () {
                    return r();
                }, delay + 600)

            })
        }
        await build()

        questions.forEach(element => {
            element.classList.remove('_animation');
        });


    }
    function setText(currentPos) {
        const textField = document.querySelector('._textField');
        textField.textContent = QUESTIONS[currentPos].assistText;
    }
    function changeLineBar(currentPos) {
        const progress_line = document.querySelector('.progress_line');
        const value = progress_line.querySelector('.value')
        const persentage = Math.round(currentPos / QUESTIONS.length * 100);
        progress_line.style.width = persentage + "%";
        value.textContent = persentage + "%"
    }
    function createQuest(currentPos) {
        const answerCont = document.querySelector('.questions_part');
        QUESTIONS.map((element, index) => {
            answerCont.innerHTML += appendQuest(element, index, index === 0 ? true : false);
        })

        return new Promise(function (resolve, reject) {
            return resolve();
        });
    }

    function appendQuest(element, index, active) {
        let template;
        if (active) {
            template = `<div class="question_item _visible">
                                <div class="question_title">${element.question}</div>
                                <div class="answear_cont">` + appendAnswer(element.answers, index) + `</div></div>`;
            return template;
        } else {
            template = `<div class="question_item ">
                                <div class="question_title">${element.question}</div>
                                <div class="answear_cont">` + appendAnswer(element.answers, index) + `</div></div>`;
            return template;
        }

        function appendAnswer(ans, index) {
            let result = '';

            ans.map((element, i) => {
                if (element !== "textarea") {
                    result += `<div class="answear_item">
                                    <input type="radio" name="ques_${index}" id="answer_${index}_${i}">
                                    <label for="answer_${index}_${i}">
                                        <div class="icon"></div>
                                        <div class="text">${element}</div>
                                    </label>
                                </div>`
                } else {
                    result += `<div class="answear_item _textarea">
                                    <input type="radio" name="ques_${index}" id="answer_${index}_${i}">
                                    <label for="answer_${index}_${i}">
                                        <div class="icon"></div>
                                        <textarea placeholder="Другое..."></textarea>
                                    </label>
                                </div>`
                }
            });
            return result
        }

        // <div class="question_item">
        //         <div class="question_title">${element.question}</div>
        //         <div class="answear_cont">
        //             <div class="answear_item">
        //                 <input type="text" name="ques_${index}" id="answer_${index}_{}">
        //                 <label for="answer_ _">
        //                     <div class="icon"></div>
        //                     <div class="text"></div>
        //                 </label>
        //             </div>
        //         </div>
        //     </div>
    }
    function checkNext() {
        const inputs = document.querySelectorAll('.question_item')[currentPos].querySelectorAll('input');
        let ret = false;
        inputs.forEach(e => {
            console.log(e.checked);
            if (e.checked === true) {
                ret = true;
            }
        })
        return ret;
    }
    function checkPrev() {
        if (currentPos != 0) {
            if (currentPos === 1) {
                btnPrev.classList.add('_disable')
            }
            return true;
        }
        return false;
    }

    function finishForm() {
        const main_box = document.querySelector('._main_animation');
        const finish_box = document.querySelector('.quiz_container_part_2');
        main_box.classList.add('_finish')
        setTimeout(function () {
            main_box.classList.add('_none')
            finish_box.classList.remove('_none')
            setTimeout(function () {
                finish_box.classList.add('_done')
            }, 400)
        }, 1500)
    }
    document.querySelector('.end').addEventListener('click', function (e) {
        e.preventDefault();
        const finish_box = document.querySelector('.quiz_container_part_2');
        finish_box.classList.add('_finish')
        setTimeout(function () {
            document.querySelector('.end_popup').classList.add('_active');
        }, 300)

    })
    assistent();
    drop_down();
    function assistent() {
        if (document.documentElement.clientWidth < 860) {
            for (let i = 0; i < QUESTIONS.length; i++) {
                document.querySelectorAll('.question_title')[i].insertAdjacentHTML('afterEnd',
                    template_ass(i)
                )
            }
            function template_ass(i) {
                return `<div class="right_part">
                        <div class="assistent">
                            <div class="img">
                                <img src="img/avatar.png" alt="">
                            </div>
                            <div class="text">
                                <div class="upper">Анна</div>
                                <div class="lower">Менеджер оптовых продаж</div>
                            </div>
                        </div>
                        <div class="answer ">
                            <p>${QUESTIONS[i].assistText}</p>
                        </div>
                    </div>`;
            }
        }
        //document.querySelector('._right_js').style.top = document.querySelector('.quiz_header').clientHeight + 50 + "px";
        // window.addEventListener('resize', function () {
        //     document.querySelector('._right_js').style.top = document.querySelector('.quiz_header').clientHeight + 50 + "px";
        // })
    }
    function drop_down() {
        $('.drop_down_title').click(function () {
            $('.drop_down_title').not(this).parent().removeClass('_active');
            $('.drop_down_title').not(this).siblings().slideUp();
            $(this).siblings().slideToggle();
            $(this).parent().toggleClass('_active');
        });
        $('._drop_item').click(function () {
            $(this).parent().slideUp();
            $(this).parent().parent().removeClass('_active');
            $(this).parent().siblings().children('.text').text($(this).children('.name').attr('data-number'));
            //$(this).parent().siblings().children('.flag').text($(this).children('.flag'))
        });
    }
}




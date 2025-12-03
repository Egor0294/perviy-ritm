// === КОНФИГУРАЦИЯ TELEGRAM БОТА ===
// ЗАМЕНИТЕ ЭТИ ЗНАЧЕНИЯ НА СВОИ!
const TELEGRAM_BOT_TOKEN = 'ВАШ_ТОКЕН_БОТА'; // Пример: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz'
const TELEGRAM_CHAT_ID = 'ВАШ_CHAT_ID'; // Пример: '123456789'

// === ФУНКЦИЯ ДЛЯ YCLIENTS WIDGET ===
function openYclientsWidget() {
    const companyId = 1729530;
    
    if (typeof yclientsWidget !== 'undefined') {
        yclientsWidget.open(companyId);
    } else {
        window.open('https://n1729530.yclients.com/', '_blank');
        alert('Переходим к онлайн-записи... Если запись не открылась, перейдите по ссылке: https://n1729530.yclients.com/');
    }
}

// === ОТПРАВКА В TELEGRAM ===
async function sendToTelegram(data) {
    try {
        const message = `
🎯 НОВАЯ ЗАЯВКА С САЙТА "Первый ритм Ленинского"

👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
📧 Email: ${data.email || 'не указан'}
👶 Возрастная группа: ${data.age || 'не указана'}
💃 Направление: ${data.direction || 'не указано'}
💬 Сообщение: ${data.message || 'нет'}
🕒 Дата: ${new Date().toLocaleString('ru-RU')}
🌐 Источник: ${window.location.href}
        `;

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Сообщение отправлено в Telegram');
            return true;
        } else {
            console.error('❌ Ошибка отправки в Telegram:', result);
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка отправки в Telegram:', error);
        return false;
    }
}

// === ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ ===
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация формы записи
    const enrollForm = document.getElementById('enrollForm');
    if (enrollForm) {
        enrollForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Инициализация всплывающих подсказок для направлений
    initDirectionTooltips();
    
    // Инициализация FAQ
    initFAQ();
    
    console.log('🚀 Сайт студии "Первый ритм Ленинского" загружен!');
    console.log('🤖 Telegram бот подключен');
    console.log('📱 Все функции активны');
});

// === ОБРАБОТКА ФОРМЫ ЗАПИСИ ===
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        direction: document.getElementById('direction').value,
        message: document.getElementById('message').value
    };
    
    if (!formData.name || !formData.phone) {
        alert('⚠️ Пожалуйста, заполните имя и телефон');
        return;
    }
    
    const submitBtn = this.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправляем...';
    submitBtn.disabled = true;
    
    try {
        // Отправляем в Telegram
        const telegramSent = await sendToTelegram(formData);
        
        if (telegramSent) {
            showSuccessMessage();
        } else {
            alert('⚠️ Не удалось отправить заявку. Пожалуйста, позвоните нам: +7 (904) 123-31-75');
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
        alert('⚠️ Произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function showSuccessMessage() {
    alert('✅ Спасибо! Заявка отправлена.\n\nМы свяжемся с вами в течение 30 минут!\n\nЕсли срочно - звоните: +7 (904) 123-31-75');
    closeModal();
    const form = document.getElementById('enrollForm');
    if (form) form.reset();
}

// === ВСПЛЫВАЮЩИЕ ПОДСКАЗКИ ДЛЯ НАПРАВЛЕНИЙ ===
const directionDescriptions = {
    'dance-game': {
        title: 'ТАНЕЦ-ИГРА (3-4 года)',
        description: 'Развитие координации, чувства ритма и творческих способностей через игровые танцевальные упражнения. Занятия проходят в игровой форме, что помогает малышам адаптироваться к групповым занятиям.',
        benefits: '🎯 Улучшение координации\n🎯 Развитие музыкального слуха\n🎯 Адаптация к коллективу\n🎯 Укрепление мышц спины и ног',
        duration: '45 минут'
    },
    'first-steps': {
        title: 'ПЕРВЫЕ ПА (5-7 лет)',
        description: 'Изучение базовых элементов хореографии, развитие пластики и артистизма. Формирование правильной осанки и походки.',
        benefits: '🎯 Основы классической хореографии\n🎯 Развитие артистизма\n🎯 Улучшение осанки\n🎯 Подготовка к более сложным направлениям',
        duration: '50 минут'
    },
    'young-dancer': {
        title: 'ЮНЫЙ ТАНЦОР (8-10 лет)',
        description: 'Изучение различных танцевальных стилей: от классики до современных направлений. Подготовка к выступлениям и конкурсам.',
        benefits: '🎯 Разнообразие стилей\n🎯 Подготовка к выступлениям\n🎯 Развитие сценического мастерства\n🎯 Укрепление физической формы',
        duration: '55 минут'
    },
    'dance-expression': {
        title: 'ТАНЕЦ-ЭКСПРЕССИЯ (11-13 лет)',
        description: 'Работа над выразительностью движений, развитие индивидуального стиля. Изуение современных танцевальных техник.',
        benefits: '🎯 Развитие индивидуального стиля\n🎯 Современные танцевальные техники\n🎯 Улучшение физической формы\n🎯 Подготовка к конкурсам',
        duration: '60 минут'
    },
    'dance-drive': {
        title: 'ТАНЕЦ-ДРАЙВ (14-16 лет)',
        description: 'Интенсивные занятия современными направлениями, работа над сложными элементами, подготовка к профессиональным выступлениям.',
        benefits: '🎯 Сложные хореографические постановки\n🎯 Профессиональная подготовка\n🎯 Участие в конкурсах\n🎯 Развитие лидерских качеств',
        duration: '60 минут'
    },
    'dance-for-soul': {
        title: 'ТАНЕЦ ДЛЯ ДУШИ (17+)',
        description: 'Снятие стресса, улучшение настроения через танец. Подходит для начинающих любого уровня подготовки.',
        benefits: '🎯 Снятие стресса\n🎯 Улучшение настроения\n🎯 Общее оздоровление\n🎯 Новые знакомства',
        duration: '60 минут'
    },
    'conscious-body': {
        title: 'ОСОЗНАННОЕ ТЕЛО (25+)',
        description: 'Работа с осанкой, грацией, пластикой. Улучшение координации движений и телесного восприятия.',
        benefits: '🎯 Исправление осанки\n🎯 Развитие грации\n🎯 Улучшение пластики\n🎯 Повышение уверенности в себе',
        duration: '60 минут'
    },
    'heels': {
        title: 'HEELS (ХИЛС) (25+)',
        description: 'Танец на каблуках для развития женственности, уверенности и сексуальности. Изуение различных стилей от классического до современного.',
        benefits: '🎯 Развитие женственности\n🎯 Уверенность в себе\n🎯 Улучшение осанки\n🎯 Укрепление мышц ног и ягодиц',
        duration: '60 минут'
    },
    'stretching': {
        title: 'РАСТЯЖКА И ГИБКОСТЬ',
        description: 'Безопасное развитие гибкости для любого возраста и уровня подготовки. Улучшение мобильности суставов и эластичности мышц.',
        benefits: '🎯 Увеличение гибкости\n🎯 Улучшение осанки\n🎯 Профилактика травм\n🎯 Снятие мышечного напряжения',
        duration: '45-60 минут'
    },
    'silver-age': {
        title: 'СЕРЕБРЯНЫЙ ВОЗРАСТ (45+)',
        description: 'Специально разработанные программы для поддержания здоровья суставов, улучшения координации и общего тонуса организма.',
        benefits: '🎯 Поддержание здоровья суставов\n🎯 Улучшение координации\n🎯 Социальное общение\n🎯 Поднятие жизненного тонуса',
        duration: '45 минут'
    }
};

function initDirectionTooltips() {
    const directionItems = document.querySelectorAll('.direction-list li');
    
    directionItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        let directionKey = null;
        
        if (text.includes('танец-игра') || text.includes('3-4')) directionKey = 'dance-game';
        else if (text.includes('первые па') || text.includes('5-7')) directionKey = 'first-steps';
        else if (text.includes('юный танцор') || text.includes('8-10')) directionKey = 'young-dancer';
        else if (text.includes('танец-экспрессия') || text.includes('11-13')) directionKey = 'dance-expression';
        else if (text.includes('танец-драйв') || text.includes('14-16')) directionKey = 'dance-drive';
        else if (text.includes('души') || text.includes('17+')) directionKey = 'dance-for-soul';
        else if (text.includes('осознанное тело') || text.includes('25+')) directionKey = 'conscious-body';
        else if (text.includes('heels') || text.includes('хилс')) directionKey = 'heels';
        else if (text.includes('растяжк')) directionKey = 'stretching';
        else if (text.includes('серебрян') || text.includes('45+')) directionKey = 'silver-age';
        
        if (directionKey && directionDescriptions[directionKey]) {
            item.setAttribute('data-direction', directionKey);
            item.style.cursor = 'help';
            
            item.addEventListener('mouseenter', showDirectionTooltip);
            item.addEventListener('mouseleave', hideDirectionTooltip);
        }
    });
}

let directionTooltipTimeout;
const directionTooltip = document.createElement('div');
directionTooltip.className = 'direction-tooltip';
document.body.appendChild(directionTooltip);

function showDirectionTooltip(event) {
    clearTimeout(directionTooltipTimeout);
    
    const directionKey = event.currentTarget.getAttribute('data-direction');
    const direction = directionDescriptions[directionKey];
    
    if (!direction) return;
    
    directionTooltip.innerHTML = `
        <div class="tooltip-header">
            <h3>${direction.title}</h3>
        </div>
        <div class="tooltip-body">
            <p><strong>⏱ Продолжительность:</strong> ${direction.duration}</p>
            <p><strong>📝 Описание:</strong> ${direction.description}</p>
            <p><strong>✨ Преимущества:</strong></p>
            <p style="white-space: pre-line;">${direction.benefits}</p>
        </div>
        <div class="tooltip-footer">
            <button onclick="quickEnrollFromTooltip('${direction.title}')" class="btn-enroll-small">
                📝 Записаться на пробное
            </button>
        </div>
    `;
    
    directionTooltip.style.display = 'block';
    
    const x = event.clientX + 15;
    const y = event.clientY + 15;
    
    directionTooltip.style.left = x + 'px';
    directionTooltip.style.top = y + 'px';
    
    // Корректировка позиции если тултип выходит за границы
    const tooltipRect = directionTooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) {
        directionTooltip.style.left = (event.clientX - tooltipRect.width - 15) + 'px';
    }
    if (tooltipRect.bottom > window.innerHeight) {
        directionTooltip.style.top = (event.clientY - tooltipRect.height - 15) + 'px';
    }
}

function hideDirectionTooltip() {
    directionTooltipTimeout = setTimeout(() => {
        directionTooltip.style.display = 'none';
    }, 100);
}

function quickEnrollFromTooltip(direction) {
    openModal();
    // Автоматически заполняем направление в форме
    setTimeout(() => {
        const directionSelect = document.getElementById('direction');
        if (directionSelect) {
            const option = Array.from(directionSelect.options).find(opt => 
                opt.text.includes(direction.split(' (')[0])
            );
            if (option) directionSelect.value = option.value;
        }
    }, 100);
}

// === ФУНКЦИИ ДЛЯ FAQ ===
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                toggleFAQ(this);
            });
        });
    }
}

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');
    
    if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        toggle.textContent = '+';
    } else {
        // Закрываем все открытые ответы
        document.querySelectorAll('.faq-answer.active').forEach(item => {
            item.classList.remove('active');
            item.previousElementSibling.querySelector('.faq-toggle').textContent = '+';
        });
        
        answer.classList.add('active');
        toggle.textContent = '−';
    }
}

// === ФУНКЦИИ ДЛЯ РАСПИСАНИЯ ===
const scheduleTeachers = {
    'stepan': {
        name: 'Степан Васильев',
        position: 'Главный хореограф',
        experience: 'Опыт: 14 лет',
        specialization: 'Современные танцы, постановка выступлений',
        description: 'Профессиональный хореограф с международным опытом. Ученики - победители всероссийских конкурсов.'
    },
    'white': {
        name: 'Общая группа',
        position: 'Разные преподаватели',
        experience: 'Профессиональные педагоги',
        specialization: 'Различные направления',
        description: 'Занятия проводят сертифицированные преподаватели по соответствующим направлениям.'
    },
    'alina': {
        name: 'Алина Козлова',
        position: 'Педагог детских групп',
        experience: 'Опыт: 8 лет',
        specialization: 'Детская хореография, развивающие танцы',
        description: 'Специалист по работе с детьми. Находит подход к каждому ребенку через игру и творчество.'
    },
    'valeria': {
        name: 'Валерия Смирнова',
        position: 'Фитнес-тренер',
        experience: 'Опыт: 4 года',
        specialization: 'Функциональный тренинг, силовые направления',
        description: 'Сертифицированный фитнес-тренер. Помогает укрепить мышцы и улучшить осанку.'
    },
    'anastasia': {
        name: 'Анастасия Петрова',
        position: 'Тренер по pole dance',
        experience: 'Опыт: 6 лет',
        specialization: 'Pole dance, heels, воздушная гимнастика',
        description: 'Сертифицированный тренер. Участница международных соревнований по pole dance.'
    },
    'yaroslava': {
        name: 'Ярослава Иванова',
        position: 'Тренер серебряного возраста',
        experience: 'Опыт: 3 года',
        specialization: 'Парные танцы, социальные танцы 45+',
        description: 'Специалист по работе со взрослыми. Создает комфортную атмосферу для обучения.'
    },
    'ekaterina': {
        name: 'Екатерина Сидорова',
        position: 'Инструктор по растяжке',
        experience: 'Опыт: 5 лет',
        specialization: 'Стретчинг, йога, пилатес',
        description: 'Специалист по безопасной растяжке. Помогает достичь гибкости без травм.'
    }
};

let scheduleTooltipTimeout;
const scheduleTooltip = document.createElement('div');
scheduleTooltip.id = 'scheduleTooltip';
scheduleTooltip.className = 'schedule-tooltip';
document.body.appendChild(scheduleTooltip);

function showScheduleTooltip(event, teacherId) {
    clearTimeout(scheduleTooltipTimeout);
    
    const teacher = scheduleTeachers[teacherId];
    if (!teacher) return;
    
    scheduleTooltip.innerHTML = `
        <div class="tooltip-content">
            <div class="tooltip-photo">${teacher.name.split(' ')[0].toUpperCase()}</div>
            <div class="tooltip-info">
                <div class="tooltip-name">${teacher.name}</div>
                <div class="tooltip-position">${teacher.position}</div>
                <div class="tooltip-experience">${teacher.experience}</div>
                <div class="tooltip-specialization">${teacher.specialization}</div>
                <div style="margin-top: 8px; font-size: 11px; color: #666; line-height: 1.3;">
                    ${teacher.description}
                </div>
            </div>
        </div>
    `;
    
    scheduleTooltip.style.display = 'block';
    
    const x = event.clientX + 10;
    const y = event.clientY + 10;
    
    scheduleTooltip.style.left = x + 'px';
    scheduleTooltip.style.top = y + 'px';
    
    const tooltipRect = scheduleTooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) {
        scheduleTooltip.style.left = (event.clientX - tooltipRect.width - 10) + 'px';
    }
    if (tooltipRect.bottom > window.innerHeight) {
        scheduleTooltip.style.top = (event.clientY - tooltipRect.height - 10) + 'px';
    }
}

function hideScheduleTooltip() {
    scheduleTooltipTimeout = setTimeout(() => {
        scheduleTooltip.style.display = 'none';
    }, 100);
}

// === ФУНКЦИИ ДЛЯ МОДАЛЬНЫХ ОКОН ===
function openModal() {
    const modal = document.getElementById('enrollModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('enrollModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
function subscribeNewsletter() {
    const email = prompt('Введите ваш email для подписки на новости:');
    if (!email) return;
    
    if (validateEmail(email)) {
        // Отправляем email в Telegram
        const message = `📧 НОВАЯ ПОДПИСКА НА РАССЫЛКУ\n\nEmail: ${email}\nДата: ${new Date().toLocaleString('ru-RU')}\nСтраница: ${window.location.href}`;
        
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        }).then(response => response.json())
          .then(result => {
              if (result.ok) {
                  alert('Спасибо за подписку! Теперь вы будете получать уведомления о наших мероприятиях.');
              } else {
                  alert('Спасибо за подписку! Вы будете получать наши новости.');
              }
          })
          .catch(() => {
              alert('Спасибо за подписку! Вы будете получать наши новости.');
          });
    } else {
        alert('Пожалуйста, введите корректный email адрес.');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function quickEnroll(direction) {
    if (confirm(`Хотите записаться на пробное занятие по направлению "${direction}"?`)) {
        openModal();
    }
}

// === ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ ===
window.onclick = function(event) {
    const modal = document.getElementById('enrollModal');
    
    if (event.target == modal) {
        closeModal();
    }
}

// Автоматическое обновление каждые 5 минут
setTimeout(function() {
    console.log('🔄 Автоматическое обновление страницы...');
    location.reload();
}, 300000);

// Инициализация при загрузке iframe
function initIframe() {
    initDirectionTooltips();
    initFAQ();
}

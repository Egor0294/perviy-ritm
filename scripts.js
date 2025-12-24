// Основные скрипты сайта
let siteData = {};

// Загрузка данных сайта
async function loadSiteData() {
    try {
        const response = await fetch('data.json');
        siteData = await response.json();
        
        // Обновляем сайт данными
        updateSiteWithData();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Используем данные по умолчанию
        siteData = getDefaultData();
        updateSiteWithData();
    }
}

// Данные по умолчанию
function getDefaultData() {
    return {
        site: {
            name: "Первый ритм Ленинского",
            tagline: "Студия танцев в Иркутске",
            phone: "+7 (904) 123-31-75",
            email: "egor.denunn@yandex.ru",
            address: "г. Иркутск, ул. 1-й Ленинский квартал д. 1"
        },
        pages: [
            {
                id: "home",
                title: "Главная",
                content: "<h2>Добро пожаловать!</h2><p>Сайт находится в разработке.</p>"
            }
        ]
    };
}

// Обновление сайта данными
function updateSiteWithData() {
    if (!siteData.site) return;
    
    // Обновляем заголовок сайта
    document.getElementById('site-logo').querySelector('h1').textContent = siteData.site.name;
    document.getElementById('site-tagline').textContent = siteData.site.tagline;
    
    // Обновляем телефон
    const phoneElements = document.querySelectorAll('#header-phone, #footer-phone');
    phoneElements.forEach(el => {
        if (el.tagName === 'SPAN') {
            el.textContent = siteData.site.phone;
        } else if (el.tagName === 'A') {
            el.textContent = siteData.site.phone;
            el.href = `tel:${siteData.site.phone.replace(/[^+\d]/g, '')}`;
        }
    });
    
    // Обновляем адрес и email
    document.getElementById('footer-address').textContent = siteData.site.address;
    document.getElementById('footer-email').textContent = siteData.site.email;
    
    // Обновляем меню
    updateMenu();
    
    // Обновляем соцсети
    updateSocialLinks();
    
    // Обновляем часы работы
    updateWorkHours();
    
    // Обновляем быстрые ссылки
    updateQuickLinks();
}

// Обновление меню
function updateMenu() {
    const menu = document.getElementById('main-menu');
    if (!menu || !siteData.pages) return;
    
    menu.innerHTML = '';
    
    // Сортируем страницы по порядку
    const sortedPages = [...siteData.pages].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Добавляем страницы в меню
    sortedPages.forEach(page => {
        if (page.showInMenu !== false) {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${page.url || '#'}" onclick="loadPage('${page.id}'); return false;">
                    ${page.title}
                </a>
            `;
            menu.appendChild(li);
        }
    });
}

// Обновление соцсетей
function updateSocialLinks() {
    const container = document.getElementById('social-links');
    if (!container || !siteData.social) return;
    
    container.innerHTML = '';
    
    if (siteData.social.vk) {
        container.innerHTML += `
            <a href="${siteData.social.vk}" target="_blank" class="social-link">
                <i class="fab fa-vk"></i>
            </a>
        `;
    }
    
    if (siteData.social.telegram) {
        container.innerHTML += `
            <a href="${siteData.social.telegram}" target="_blank" class="social-link">
                <i class="fab fa-telegram"></i>
            </a>
        `;
    }
    
    if (siteData.social.instagram) {
        container.innerHTML += `
            <a href="${siteData.social.instagram}" target="_blank" class="social-link">
                <i class="fab fa-instagram"></i>
            </a>
        `;
    }
}

// Обновление часов работы
function updateWorkHours() {
    const container = document.getElementById('work-hours');
    if (!container || !siteData.site.workHours) return;
    
    container.innerHTML = `
        <p><strong>Понедельник-Суббота:</strong> ${siteData.site.workHours.weekdays}</p>
        <p><strong>Воскресенье:</strong> ${siteData.site.workHours.weekend}</p>
    `;
}

// Обновление быстрых ссылок
function updateQuickLinks() {
    const container = document.getElementById('quick-links');
    if (!container || !siteData.pages) return;
    
    const quickPages = siteData.pages.filter(p => p.id !== 'home').slice(0, 4);
    
    container.innerHTML = quickPages.map(page => `
        <a href="${page.url || '#'}" class="quick-link" onclick="loadPage('${page.id}'); return false;">
            <div class="quick-icon">
                ${getPageIcon(page.id)}
            </div>
            <div class="quick-title">${page.title}</div>
        </a>
    `).join('');
}

// Иконки для страниц
function getPageIcon(pageId) {
    const icons = {
        'directions': '🎯',
        'prices': '💰',
        'schedule': '📅',
        'team': '👥',
        'gallery': '📸',
        'contacts': '📞'
    };
    return icons[pageId] || '📄';
}

// Настройка навигации
function setupNavigation() {
    // Обработка кликов по меню
    document.addEventListener('click', function(e) {
        if (e.target.matches('.main-nav a')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            if (href && href !== '#') {
                const pageId = href.replace('#', '');
                loadPage(pageId);
            }
        }
    });
}

// Инициализация компонентов страницы
function initializePageComponents() {
    // Инициализируем галерею
    initGallery();
    
    // Инициализируем формы
    initForms();
    
    // Инициализируем табы
    initTabs();
}

// Инициализация галереи
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const caption = this.querySelector('.gallery-caption').textContent;
            alert(caption);
        });
    });
}

// Инициализация форм
function initForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Форма отправлена! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    });
}

// Инициализация табов
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Скрыть все табы
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Убрать активность со всех кнопок
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Показать выбранный таб
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });
}

// Загрузка направлений для формы записи
function loadBookingDirections() {
    const select = document.getElementById('booking-direction');
    if (!select || !siteData.products) return;
    
    select.innerHTML = '<option value="">Выберите направление</option>';
    
    siteData.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - ${product.price}₽`;
        select.appendChild(option);
    });
}

// Сохранение данных формы записи
document.getElementById('booking-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;
    const direction = document.getElementById('booking-direction').value;
    
    if (!name || !phone) {
        alert('Пожалуйста, заполните обязательные поля');
        return;
    }
    
    // Сохраняем заявку
    const booking = {
        name,
        phone,
        direction,
        date: new Date().toISOString(),
        status: 'new'
    };
    
    // Сохраняем в localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Показываем подтверждение
    alert(`Спасибо, ${name}! Ваша заявка принята. Мы свяжемся с вами по телефону ${phone} в течение 2 часов.`);
    
    // Закрываем модальное окно
    closeModal();
    this.reset();
});

// Закрытие модального окна
function closeModal() {
    document.getElementById('booking-modal').style.display = 'none';
}

// Открытие модального окна
function openModal() {
    document.getElementById('booking-modal').style.display = 'block';
}

// Прокрутка к секции
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Если секции нет на странице, загружаем страницу
        loadPage(sectionId);
    }
}

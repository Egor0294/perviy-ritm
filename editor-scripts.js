// Скрипты редактора сайта
let currentPage = null;
let editorData = {};

// Инициализация редактора
async function initializeEditor() {
    try {
        // Загружаем данные
        const response = await fetch('data.json');
        editorData = await response.json();
        
        // Инициализируем интерфейс
        loadPagesList();
        loadMediaGallery();
        updateStats();
        
        // Загружаем первую страницу
        if (editorData.pages && editorData.pages.length > 0) {
            loadPageForEditing(editorData.pages[0].id);
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        editorData = getDefaultEditorData();
        initializeEditor();
    }
}

// Данные по умолчанию для редактора
function getDefaultEditorData() {
    return {
        site: {
            name: "Первый ритм Ленинского",
            tagline: "Студия танцев в Иркутске"
        },
        pages: [
            {
                id: "home",
                title: "Главная",
                content: "<h2>Добро пожаловать!</h2><p>Начните редактировать ваш сайт.</p>"
            }
        ],
        media: []
    };
}

// Загрузка списка страниц
function loadPagesList() {
    const container = document.getElementById('pages-list');
    if (!container || !editorData.pages) return;
    
    container.innerHTML = '';
    
    editorData.pages.forEach(page => {
        const pageElement = document.createElement('div');
        pageElement.className = 'page-item';
        pageElement.innerHTML = `
            <div class="page-info">
                <div class="page-title">${page.title}</div>
                <div class="page-url">${page.url || '#'}</div>
            </div>
            <div class="page-actions">
                <button class="btn btn-sm" onclick="loadPageForEditing('${page.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePage('${page.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(pageElement);
    });
}

// Загрузка страницы для редактирования
function loadPageForEditing(pageId) {
    const page = editorData.pages.find(p => p.id === pageId);
    if (!page) return;
    
    currentPage = page;
    
    // Загружаем контент в редактор
    const editorArea = document.getElementById('editor-area');
    if (editorArea) {
        editorArea.innerHTML = page.content;
    }
    
    // Обновляем предпросмотр
    updatePreview();
    
    // Прокручиваем к верху
    document.querySelector('.editor-area').scrollTop = 0;
}

// Обновление предпросмотра
function updatePreview() {
    const preview = document.getElementById('mobile-preview');
    if (preview && currentPage) {
        preview.innerHTML = currentPage.content;
    }
}

// Форматирование текста
function formatText(type) {
    const editor = document.getElementById('editor-area');
    if (!editor) return;
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) {
        // Если текст не выделен, вставляем теги
        const tag = getFormatTag(type);
        editor.focus();
        document.execCommand('insertHTML', false, `<${tag}></${tag}>`);
        return;
    }
    
    // Форматируем выделенный текст
    const formattedText = wrapWithTag(selectedText, type);
    range.deleteContents();
    range.insertNode(document.createTextNode(formattedText));
}

// Получение тега для форматирования
function getFormatTag(type) {
    const tags = {
        'bold': 'strong',
        'italic': 'em',
        'underline': 'u'
    };
    return tags[type] || 'span';
}

// Обертывание текста тегом
function wrapWithTag(text, type) {
    const tag = getFormatTag(type);
    return `<${tag}>${text}</${tag}>`;
}

// Вставка ссылки
function insertLink() {
    const url = prompt('Введите URL ссылки:', 'https://');
    if (!url) return;
    
    const text = prompt('Введите текст ссылки:', 'Текст ссылки');
    const linkText = text || 'Ссылка';
    
    const editor = document.getElementById('editor-area');
    if (editor) {
        editor.focus();
        document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${linkText}</a>`);
    }
}

// Вставка изображения
function insertImage() {
    openMediaUpload();
}

// Вставка списка
function insertList(type) {
    const editor = document.getElementById('editor-area');
    if (editor) {
        editor.focus();
        document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
    }
}

// Изменение размера шрифта
function changeFontSize(size) {
    if (!size) return;
    
    const editor = document.getElementById('editor-area');
    if (editor) {
        editor.focus();
        document.execCommand('fontSize', false, '7'); // Сначала устанавливаем базовый размер
        
        // Затем применяем стиль
        const selection = window.getSelection();
        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontSize = size;
            range.surroundContents(span);
        }
    }
}

// Изменение шрифта
function changeFontFamily(font) {
    if (!font) return;
    
    const editor = document.getElementById('editor-area');
    if (editor) {
        editor.focus();
        document.execCommand('fontName', false, font);
    }
}

// Загрузка медиа-галереи
function loadMediaGallery() {
    const container = document.getElementById('media-gallery');
    if (!container || !editorData.media) return;
    
    container.innerHTML = '';
    
    if (editorData.media.length === 0) {
        container.innerHTML = `
            <div class="empty-gallery">
                <i class="fas fa-images"></i>
                <p>Нет загруженных изображений</p>
            </div>
        `;
        return;
    }
    
    // Показываем только первые 6 изображений
    editorData.media.slice(0, 6).forEach(media => {
        const mediaElement = document.createElement('div');
        mediaElement.className = 'media-item';
        mediaElement.innerHTML = `
            <div class="media-preview">
                <i class="fas fa-image"></i>
            </div>
            <div class="media-title">${media.title}</div>
        `;
        
        mediaElement.addEventListener('click', function() {
            insertMediaIntoEditor(media.url);
        });
        
        container.appendChild(mediaElement);
    });
}

// Вставка медиа в редактор
function insertMediaIntoEditor(url) {
    const editor = document.getElementById('editor-area');
    if (editor) {
        editor.focus();
        document.execCommand('insertHTML', false, `<img src="${url}" style="max-width: 100%; border-radius: 8px;">`);
    }
}

// Открытие загрузки медиа
function openMediaUpload() {
    document.getElementById('media-modal').style.display = 'block';
}

// Закрытие модального окна медиа
function closeMediaModal() {
    document.getElementById('media-modal').style.display = 'none';
}

// Подключение Яндекс.Диска
function connectYandexDisk() {
    const token = document.getElementById('yandex-token').value;
    if (!token) {
        alert('Введите OAuth токен Яндекс.Диска');
        return;
    }
    
    // Сохраняем токен
    localStorage.setItem('yandex_token', token);
    
    alert('Яндекс.Диск подключен! Теперь вы можете загружать изображения.');
}

// Сохранение всех изменений
async function saveAllChanges() {
    if (currentPage) {
        // Сохраняем контент текущей страницы
        const editorArea = document.getElementById('editor-area');
        if (editorArea) {
            currentPage.content = editorArea.innerHTML;
        }
    }
    
    // Сохраняем данные
    try {
        // В реальном проекте здесь был бы запрос на сервер
        localStorage.setItem('site_data', JSON.stringify(editorData));
        
        // Показываем уведомление
        showNotification('Все изменения сохранены!', 'success');
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        showNotification('Ошибка сохранения', 'error');
    }
}

// Предпросмотр сайта
function previewSite() {
    // Сохраняем изменения перед просмотром
    saveAllChanges();
    
    // Открываем сайт в новой вкладке
    window.open('index.html', '_blank');
}

// Создание новой страницы
function createNewPage() {
    const title = prompt('Введите название новой страницы:');
    if (!title) return;
    
    const id = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    const newPage = {
        id: id,
        title: title,
        content: `<h2>${title}</h2><p>Начните редактировать эту страницу...</p>`,
        order: editorData.pages.length + 1,
        showInMenu: true
    };
    
    editorData.pages.push(newPage);
    loadPagesList();
    loadPageForEditing(id);
    
    showNotification(`Страница "${title}" создана`, 'success');
}

// Удаление страницы
function deletePage(pageId) {
    if (editorData.pages.length <= 1) {
        alert('Нельзя удалить последнюю страницу!');
        return;
    }
    
    if (confirm('Удалить эту страницу?')) {
        editorData.pages = editorData.pages.filter(p => p.id !== pageId);
        
        // Если удалили текущую страницу, загружаем первую
        if (currentPage && currentPage.id === pageId) {
            loadPageForEditing(editorData.pages[0].id);
        }
        
        loadPagesList();
        showNotification('Страница удалена', 'warning');
    }
}

// Применение настроек дизайна
function applyDesignSettings() {
    if (!editorData.design) {
        editorData.design = {};
    }
    
    editorData.design.primaryColor = document.getElementById('primary-color').value;
    editorData.design.secondaryColor = document.getElementById('secondary-color').value;
    editorData.design.accentColor = document.getElementById('accent-color').value;
    editorData.design.textColor = document.getElementById('text-color').value;
    editorData.design.fontFamily = document.getElementById('main-font').value;
    editorData.design.fontSize = document.getElementById('font-size').value + 'px';
    
    const layout = document.querySelector('input[name="layout"]:checked');
    if (layout) {
        editorData.design.layout = layout.value;
    }
    
    showNotification('Настройки дизайна применены', 'success');
}

// Сохранение настроек сайта
function saveSiteSettings() {
    if (!editorData.site) {
        editorData.site = {};
    }
    
    editorData.site.name = document.getElementById('site-name').value;
    editorData.site.tagline = document.getElementById('site-tagline').value;
    editorData.site.phone = document.getElementById('contact-phone').value;
    editorData.site.email = document.getElementById('contact-email').value;
    editorData.site.address = document.getElementById('contact-address').value;
    
    // Социальные сети
    if (!editorData.social) {
        editorData.social = {};
    }
    
    editorData.social.vk = document.getElementById('social-vk').value;
    editorData.social.telegram = document.getElementById('social-telegram').value;
    editorData.social.instagram = document.getElementById('social-instagram').value;
    
    showNotification('Настройки сайта сохранены', 'success');
}

// Сохранение SEO настроек
function saveSeoSettings() {
    if (!editorData.seo) {
        editorData.seo = {};
    }
    
    editorData.seo.title = document.getElementById('seo-title').value;
    editorData.seo.description = document.getElementById('seo-description').value;
    editorData.seo.keywords = document.getElementById('seo-keywords').value;
    editorData.seo.canonical = document.getElementById('seo-canonical').value;
    
    showNotification('SEO настройки сохранены', 'success');
}

// Экспорт сайта
function exportSite() {
    const dataStr = JSON.stringify(editorData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `site-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Сайт экспортирован', 'success');
}

// Импорт сайта
function importSite() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                editorData = JSON.parse(e.target.result);
                
                // Перезагружаем интерфейс
                loadPagesList();
                loadMediaGallery();
                updateStats();
                
                if (editorData.pages && editorData.pages.length > 0) {
                    loadPageForEditing(editorData.pages[0].id);
                }
                
                showNotification('Сайт успешно импортирован', 'success');
            } catch (error) {
                console.error('Ошибка импорта:', error);
                showNotification('Ошибка импорта файла', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Очистка кэша
function clearCache() {
    if (confirm('Очистить кэш редактора? Это не затронет сохраненные данные.')) {
        // Можно очистить localStorage кроме данных сайта
        for (let key in localStorage) {
            if (key !== 'site_data' && key !== 'yandex_token') {
                localStorage.removeItem(key);
            }
        }
        
        showNotification('Кэш очищен', 'warning');
    }
}

// Обновление статистики
function updateStats() {
    document.getElementById('pages-count').textContent = editorData.pages?.length || 0;
    document.getElementById('images-count').textContent = editorData.media?.length || 0;
    document.getElementById('products-count').textContent = editorData.products?.length || 0;
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Автосохранение
function autoSave() {
    if (currentPage) {
        const editorArea = document.getElementById('editor-area');
        if (editorArea) {
            currentPage.content = editorArea.innerHTML;
            console.log('Автосохранение выполнено');
        }
    }
}

// Настройка перетаскивания
function setupDragAndDrop() {
    const editorArea = document.getElementById('editor-area');
    const components = document.querySelectorAll('.component');
    
    // Разрешаем перетаскивание компонентов
    components.forEach(component => {
        component.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('onclick'));
        });
    });
    
    // Обработка перетаскивания в редактор
    editorArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    editorArea.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });
    
    editorArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const componentAction = e.dataTransfer.getData('text/plain');
        if (componentAction) {
            // Выполняем действие компонента
            eval(componentAction.replace('onclick="', '').replace('"', ''));
        }
    });
}

// Вставка готовых компонентов
function insertComponent(type) {
    const editor = document.getElementById('editor-area');
    if (!editor) return;
    
    const components = {
        'hero': `
            <section class="hero-component" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 20px; text-align: center; border-radius: 12px; margin: 20px 0;">
                <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Заголовок баннера</h2>
                <p style="font-size: 1.2rem; margin-bottom: 30px; max-width: 600px; margin-left: auto; margin-right: auto;">
                    Описание баннера. Расскажите о вашем предложении или акции.
                </p>
                <button style="background: white; color: #667eea; border: none; padding: 12px 30px; border-radius: 25px; font-size: 1rem; font-weight: bold; cursor: pointer;">
                    Призыв к действию
                </button>
            </section>
        `,
        
        'services': `
            <section class="services-component" style="margin: 40px 0;">
                <h2 style="text-align: center; margin-bottom: 30px;">Наши услуги</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 15px;">💰</div>
                        <h3 style="margin-bottom: 10px;">Название услуги 1</h3>
                        <p>Описание услуги. Расскажите о преимуществах.</p>
                        <div style="font-size: 1.5rem; font-weight: bold; color: #667eea; margin: 15px 0;">1,000₽</div>
                        <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Заказать
                        </button>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 15px;">🎯</div>
                        <h3 style="margin-bottom: 10px;">Название услуги 2</h3>
                        <p>Описание услуги. Расскажите о преимуществах.</p>
                        <div style="font-size: 1.5rem; font-weight: bold; color: #667eea; margin: 15px 0;">2,000₽</div>
                        <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Заказать
                        </button>
                    </div>
                </div>
            </section>
        `,
        
        'gallery': `
            <section class="gallery-component" style="margin: 40px 0;">
                <h2 style="text-align: center; margin-bottom: 30px;">Галерея</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                    <div style="background: #f5f5f5; aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #ccc;">
                        🖼️
                    </div>
                    <div style="background: #f5f5f5; aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #ccc;">
                        🖼️
                    </div>
                    <div style="background: #f5f5f5; aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #ccc;">
                        🖼️
                    </div>
                </div>
            </section>
        `,
        
        'team': `
            <section class="team-component" style="margin: 40px 0;">
                <h2 style="text-align: center; margin-bottom: 30px;">Наша команда</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px;">
                    <div style="text-align: center;">
                        <div style="width: 150px; height: 150px; background: #667eea; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">
                            👤
                        </div>
                        <h3 style="margin-bottom: 5px;">Имя сотрудника</h3>
                        <p style="color: #667eea; margin-bottom: 10px;">Должность</p>
                        <p>Краткое описание сотрудника и его опыта работы.</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <div style="width: 150px; height: 150px; background: #667eea; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">
                            👤
                        </div>
                        <h3 style="margin-bottom: 5px;">Имя сотрудника</h3>
                        <p style="color: #667eea; margin-bottom: 10px;">Должность</p>
                        <p>Краткое описание сотрудника и его опыта работы.</p>
                    </div>
                </div>
            </section>
        `,
        
        'contact-form': `
            <section class="contact-form-component" style="margin: 40px 0;">
                <h2 style="text-align: center; margin-bottom: 30px;">Свяжитесь с нами</h2>
                <div style="max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 30px; border-radius: 12px;">
                    <form>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Имя</label>
                                <input type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;" placeholder="Ваше имя">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Телефон</label>
                                <input type="tel" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;" placeholder="+7 (900) 123-45-67">
                            </div>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Сообщение</label>
                            <textarea style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; min-height: 100px;" placeholder="Ваше сообщение..."></textarea>
                        </div>
                        <button type="submit" style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-size: 1rem; width: 100%;">
                            Отправить сообщение
                        </button>
                    </form>
                </div>
            </section>
        `,
        
        'map': `
            <section class="map-component" style="margin: 40px 0;">
                <h2 style="text-align: center; margin-bottom: 30px;">Как нас найти</h2>
                <div style="background: #f5f5f5; border-radius: 12px; padding: 40px; text-align: center;">
                    <div style="font-size: 4rem; color: #667eea; margin-bottom: 20px;">
                        🗺️
                    </div>
                    <h3 style="margin-bottom: 15px;">Наш адрес</h3>
                    <p style="font-size: 1.2rem; margin-bottom: 20px;">г. Иркутск, ул. 1-й Ленинский квартал д. 1</p>
                    <p style="color: #666; margin-bottom: 30px;">Рядом с остановкой "Норильская", 5 минут пешком</p>
                    <button style="background: #667eea; color: white; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-size: 1rem;">
                        <i class="fas fa-directions"></i> Построить маршрут
                    </button>
                </div>
            </section>
        `
    };
    
    const componentHTML = components[type] || '';
    if (componentHTML) {
        editor.focus();
        document.execCommand('insertHTML', false, componentHTML);
        showNotification('Компонент добавлен', 'success');
    }
}

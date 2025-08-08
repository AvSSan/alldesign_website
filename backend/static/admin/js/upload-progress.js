jQuery(function($) {
    'use strict';

    function initFileUpload() {
        $('.upload-progress input[type="file"]').each(function() {
            var $input = $(this);
            var $wrapper = $input.closest('.form-row');
            var $progress = $wrapper.find('.progress-wrapper');
            var $bar = $progress.find('.progress-bar');
            var $label = $progress.find('.progress-label');

            $input.on('change', function(e) {
                var file = this.files[0];
                if (!file) {
                    $bar.css('width', '0%');
                    $label.text('Выберите файл');
                    return;
                }

                // Показываем начальный прогресс
                $bar.css('width', '0%');
                $label.text('Подготовка...');
                $wrapper.addClass('uploading');

                // Создаем объект FormData
                var formData = new FormData();
                formData.append(this.name, file);
                
                // Добавляем CSRF токен
                var csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
                formData.append('csrfmiddlewaretoken', csrftoken);

                // Создаем XHR запрос
                var xhr = new XMLHttpRequest();
                xhr.open('POST', window.location.href, true);

                // Обработчик прогресса загрузки
                xhr.upload.onprogress = function(e) {
                    if (e.lengthComputable) {
                        var percentComplete = (e.loaded / e.total) * 100;
                        $bar.css('width', percentComplete + '%');
                        $label.text('Загрузка: ' + Math.round(percentComplete) + '%');
                    }
                };

                // Обработчик завершения загрузки
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        $bar.css('width', '100%');
                        $label.text('Загружено');
                        $wrapper.removeClass('uploading').addClass('upload-complete');
                    } else {
                        $bar.css('width', '0%');
                        $label.text('Ошибка загрузки');
                        $wrapper.removeClass('uploading');
                        console.error('Ошибка загрузки:', xhr.statusText);
                    }
                };

                // Обработчик ошибки
                xhr.onerror = function() {
                    $bar.css('width', '0%');
                    $label.text('Ошибка загрузки');
                    $wrapper.removeClass('uploading');
                    console.error('Ошибка сети');
                };

                // Отправляем файл
                xhr.send(formData);
            });
        });
    }

    // Инициализация при загрузке страницы
    $(document).ready(function() {
        initFileUpload();
    });

    // Инициализация при добавлении новых форм (для inline-форм)
    $(document).on('formset:added', function(event, $row, formsetName) {
        initFileUpload();
    });
}); 
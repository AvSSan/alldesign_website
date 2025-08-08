jQuery(function($) {
    'use strict';

    function toggleFields(row) {
        var $row = $(row);
        var $mediaType = $row.find('select[id$="-media_type"]');
        var $fileField = $row.find('div[class$="file"]').parent();
        var $videoUrlField = $row.find('div[class$="video_url"]').parent();
        var $thumbnailField = $row.find('div[class$="thumbnail"]').parent();
        
        function updateFields() {
            var mediaType = $mediaType.val();
            
            if (mediaType === 'video') {
                $fileField.hide();
                $videoUrlField.show();
                $thumbnailField.show();
            } else {
                $fileField.show();
                $videoUrlField.hide();
                $thumbnailField.hide();
            }
        }

        // Обновляем поля при загрузке и при изменении типа медиа
        updateFields();
        $mediaType.on('change', updateFields);
    }

    // Инициализация для существующих строк
    $('.inline-related').each(function() {
        toggleFields(this);
    });

    // Инициализация для новых строк
    $(document).on('formset:added', function(event, $row, formsetName) {
        toggleFields($row);
    });

    // Обработка вставки ссылки на видео
    $(document).on('change', 'input[id$="-video_url"]', function() {
        var url = $(this).val();
        if (url.includes('vk.com/video')) {
            // Показываем сообщение об успешной вставке ссылки
            var $message = $('<div class="success-message">Ссылка на видео VK успешно добавлена</div>');
            $(this).after($message);
            setTimeout(function() {
                $message.fadeOut(function() {
                    $(this).remove();
                });
            }, 3000);
        }
    });
}); 
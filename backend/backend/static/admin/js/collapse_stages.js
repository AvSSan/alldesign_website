(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Добавляем заголовок каждому этапу для сворачивания
        $('.ImplementationStageInline').each(function(index) {
            var $stage = $(this);
            var $header = $('<div class="stage-header"></div>');
            
            // Получаем название этапа
            var stageTitle = $stage.find('input[name$="-title"]').val() || 'Новый этап';
            var stageType = $stage.find('select[name$="-stage_type"] option:selected').text() || '';
            var isCompleted = $stage.find('input[name$="-is_completed"]').prop('checked');
            
            // Формируем заголовок
            $header.html('<h3>' + stageTitle + ' (' + stageType + ')' + 
                (isCompleted ? ' <span class="completed-badge">Завершен</span>' : '') + 
                '<span class="collapse-icon">▼</span></h3>');
            
            // Добавляем класс для контейнера контента
            var $content = $stage.find('> .djn-tbody');
            $content.addClass('stage-content');
            
            // Вставляем заголовок перед контентом
            $content.before($header);
            
            // Обработчик клика для сворачивания/разворачивания
            $header.on('click', function() {
                $content.slideToggle();
                $(this).find('.collapse-icon').text(
                    $content.is(':visible') ? '▼' : '►'
                );
            });
            
            // Если этап уже заполнен и не первый, сворачиваем его
            if (index > 0 && stageTitle !== 'Новый этап') {
                $content.hide();
                $header.find('.collapse-icon').text('►');
            }
        });
        
        // Обновляем заголовки при изменении полей
        $(document).on('change', '.ImplementationStageInline input[name$="-title"], .ImplementationStageInline select[name$="-stage_type"], .ImplementationStageInline input[name$="-is_completed"]', function() {
            var $stage = $(this).closest('.ImplementationStageInline');
            var stageTitle = $stage.find('input[name$="-title"]').val() || 'Новый этап';
            var stageType = $stage.find('select[name$="-stage_type"] option:selected').text() || '';
            var isCompleted = $stage.find('input[name$="-is_completed"]').prop('checked');
            
            var $header = $stage.find('.stage-header h3');
            $header.html(stageTitle + ' (' + stageType + ')' + 
                (isCompleted ? ' <span class="completed-badge">Завершен</span>' : '') + 
                '<span class="collapse-icon">' + ($stage.find('.stage-content').is(':visible') ? '▼' : '►') + '</span>');
        });
    });
})(django.jQuery); 
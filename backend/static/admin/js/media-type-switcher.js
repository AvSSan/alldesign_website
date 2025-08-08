(function($) {
    $(document).ready(function() {
        function updateFields(row) {
            var mediaType = $(row).find('select[id$="-media_type"]').val();
            var fileField = $(row).find('input[id$="-file"]').closest('.form-row');
            var videoUrlField = $(row).find('input[id$="-video_url"]').closest('.form-row');
            
            if (mediaType === 'video') {
                fileField.hide();
                videoUrlField.show();
            } else {
                fileField.show();
                videoUrlField.hide();
            }
        }

        // Обработка изменения типа медиа
        $(document).on('change', 'select[id$="-media_type"]', function() {
            updateFields($(this).closest('.inline-related'));
        });

        // Инициализация при загрузке страницы
        $('.inline-related').each(function() {
            updateFields(this);
        });

        // Обработка добавления новой формы
        $(document).on('formset:added', function(event, row) {
            updateFields(row);
        });
    });
})(django.jQuery); 
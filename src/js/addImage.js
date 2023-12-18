import { Dropzone} from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').content;

Dropzone.options.image = {
    dictDefaultMessage: 'Upload your images here',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFileSize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dicRemoveFile: 'Remove file',
    dicMaxFilesExceeded: 'You exceeded the limit of 10 images',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'image',
    init: function (){
        const dropzone = this;
        const publishBtn = document.querySelector('#publish');
        
        publishBtn.addEventListener('click', function(){
            dropzone.processQueue();
        });

        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/my-properties';
            }
        });

    }
}
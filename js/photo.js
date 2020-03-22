'use strict';

(function () {
  var FILE_TYPES = ['webp', 'jpg', 'jpeg', 'png'];

  var photoUploadField = document.querySelector('.ad-form__upload');
  var photoPreview = document.querySelector('.ad-form__photo');

  var avatarUploadField = document.querySelector('.ad-form__field');
  var avatar = document.querySelector('.ad-form-header__preview img');
  var avatarSrcInitial = avatar.src;

  var photoChooser = photoUploadField.querySelector('input[type=file]');
  var avatarChooser = avatarUploadField.querySelector('input[type=file]');

  var addPhotoPreview = function () {
    getPicturePreview(photoChooser, function (link) {
      var newPhoto = document.createElement('img');
      newPhoto.src = link;
      newPhoto.style.maxWidth = '100%';
      photoPreview.appendChild(newPhoto);
    });
  };

  var setAvatarPreview = function () {
    getPicturePreview(avatarChooser, function (link) {
      avatar.src = link;
    });
  };

  var getPicturePreview = function (fileChooser, cb) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        cb(reader.result);
      });

      reader.readAsDataURL(file);
    }
  };

  var clearPictures = function () {
    avatar.src = avatarSrcInitial;
    window.util.clearChildren(photoPreview);
  };

  var photoUploadHandler = function () {
    addPhotoPreview();
  };

  var avatarUploadHandler = function () {
    setAvatarPreview();
  };

  photoChooser.addEventListener('change', photoUploadHandler);
  avatarChooser.addEventListener('change', avatarUploadHandler);

  window.photo = {
    clear: clearPictures,
    setAvatar: setAvatarPreview,
    add: addPhotoPreview
  };
})();

// node-telegram-bot-api editMessageMedia komutu bence problemli. şöyle bir patch yaptım. 
// node-modules/node-telegram-bot-api/src/telegram.js adresinde bu kısmı güncelleyerek kullanın.

  /**
   * Use this method to edit audio, document, photo, or video messages.
   * If a message is a part of a message album, then it can be edited only to a photo or a video.
   * Otherwise, message type can be changed arbitrarily. When inline message is edited, new file can't be uploaded.
   * Use previously uploaded file via its file_id or specify a URL.
   * On success, the edited Message is returned.
   *
   * Note that you must provide one of chat_id, message_id, or
   * inline_message_id in your request.
   *
   * @param  {Object} media  A JSON-serialized object for a new media content of the message
   * @param  {Object} [options] Additional Telegram query options (provide either one of chat_id, message_id, or inline_message_id here)
   * @return {Promise}
   * @see https://core.telegram.org/bots/api#editmessagemedia
   */
  editMessageMedia(media, form = {}) {
    const opts = {
      qs: form
    }
    opts.formData = {}

    const payload = Object.assign({}, media);
    delete payload.media;
    try {
      const attachName = String(0);
      const [formData, fileId] = this._formatSendData(attachName, media.media, media.fileOptions);
      if (formData) {
        opts.formData[attachName] = formData[attachName];
        payload.media = `attach://${attachName}`;
      } else {
        payload.media = fileId;
      }
    } catch (ex) {
      return Promise.reject(ex);
    }
    opts.qs.media = JSON.stringify(payload);
    // form.media = stringify(media);
    return this._request('editMessageMedia', opts);
  }

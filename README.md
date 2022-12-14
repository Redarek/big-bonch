### Настройка окружения и запуск
1. Скачать и установить [NodeJS](https://nodejs.org)
2. Склонировать репозиторий `git clone https://github.com/Redarek/big-bonch.git`
3. Загрузить `/nodemodules` командой `npm install` в директории `client`, затем в директории `server`
4. Выполнить `npm start` в директории `server`, затем в директории `client`<br>Чтобы `react-app` запустился в браузере поумолчанию, нужно удалить `BROWSER=firefox` из файла [package.json в директории client](https://github.com/Redarek/big-bonch/blob/626c4444a023d8a50af520f5105be7e1c4003ef8/client/package.json#L33)

### Авторизация и регистрация
1. Для доступа к авторизации и регистрации нужно установить расширение браузера [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) и войти крипто-кошелек.
2. При регистрации адрес крипто-кошелька привязывается к вашему аккаунту. С уже зарегестрированным кошельком нельзя создать второй аккаунт и нельзя войти под другим аккаунтом.

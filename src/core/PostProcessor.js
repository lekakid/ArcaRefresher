export default { parseUserInfo };

function parseUserInfo(rootView) {
    const users = rootView.querySelectorAll('.user-info');

    users.forEach(user => {
        let id = user.dataset.id;
        if(id == undefined) {
            id = user.innerText.trim();
            const subid = user.querySelector('a[title], span[title]');
            if(subid && subid.title.indexOf('#') > -1) {
                id = subid.title.substring(subid.title.indexOf('#'));
            }
            user.dataset.id = id;
        }
    });
}

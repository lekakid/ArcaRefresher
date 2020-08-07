export function filter(articles) {
    articles.forEach(article => {
        let category = article.querySelector('.tag').innerText;
        category = (category == '') ? '일반' : category;

        if(window.setting.filteredCategory[window.channel][category]) {
            article.querySelector('.vrow-preview').remove();
        }
    });
}

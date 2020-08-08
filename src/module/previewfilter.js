export function filter(articles, channel) {
    articles.forEach(article => {
        let category = article.querySelector('.tag').innerText;
        category = (category == '') ? '일반' : category;

        if(window.config.filteredCategory[channel][category]) {
            article.querySelector('.vrow-preview').remove();
        }
    });
}

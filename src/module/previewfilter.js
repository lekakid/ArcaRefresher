export function filter(articles, channel) {
    const filteredCategory = window.config.filteredCategory;

    articles.forEach(article => {
        let category = article.querySelector('.tag').innerText;
        category = (category == '') ? '일반' : category;
        const preview = article.querySelector('.vrow-preview');

        const filtered = filteredCategory[channel][category] || filteredCategory[channel]['전체'];

        if(filtered && preview != null) preview.remove();
    });
}

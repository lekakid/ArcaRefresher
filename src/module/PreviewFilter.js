export function filter(articles, channel) {
    const filteredCategory = window.config.filteredCategory;

    articles.forEach(article => {
        const tag = article.querySelector('.tag');
        if(tag == null) return;

        let category = tag.textContent;
        category = (category == '') ? '일반' : category;
        const preview = article.querySelector('.vrow-preview');

        const filtered = filteredCategory[channel][category] || filteredCategory[channel]['전체'];

        if(filtered && preview != null) preview.remove();
    });
}

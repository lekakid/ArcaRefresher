import { defaultConfig } from './Setting';

export function filter(articles, channel) {
    const filteredCategory = GM_getValue('filteredCategory', defaultConfig.filteredCategory);

    articles.forEach(article => {
        const badge = article.querySelector('.badge');
        if(badge == null) return;

        let category = badge.textContent;
        category = (category == '') ? '일반' : category;
        const preview = article.querySelector('.vrow-preview');

        const filtered = filteredCategory[channel][category] || filteredCategory[channel]['전체'];

        if(filtered && preview != null) preview.remove();
    });
}

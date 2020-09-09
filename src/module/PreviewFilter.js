import { defaultConfig } from './Setting';

export function filter(articles, channel) {
    const categoryConfig = GM_getValue('category', defaultConfig.category);

    articles.forEach(article => {
        const badge = article.querySelector('.badge');
        if(badge == null) return;

        let category = badge.textContent;
        category = (category == '') ? '일반' : category;
        const preview = article.querySelector('.vrow-preview');

        if(categoryConfig[channel] && categoryConfig[channel][category]) {
            const filtered = categoryConfig[channel][category].blockPreview || false;

            if(filtered && preview != null) preview.remove();
        }
    });
}

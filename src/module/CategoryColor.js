import { defaultConfig } from './Setting';
import { getContrastYIQ } from '../util/ColorManager';

export function applyArticles(articles, channel) {
    const categoryConfig = GM_getValue('category', defaultConfig.category);

    articles.forEach(article => {
        const category = article.querySelector('.badge');
        if(category == null) return;

        let color = '';
        if(categoryConfig[channel] && categoryConfig[channel][category.textContent]) {
            color = categoryConfig[channel][category.textContent].color;
        }

        const textColor = getContrastYIQ(color);

        if(color != '') {
            category.style.backgroundColor = `#${color}`;
            category.style.color = textColor;
        }
    });
}

import Parser from '../core/Parser';
import DefaultConfig from '../core/DefaultConfig';
import { getContrastYIQ } from '../util/ColorManager';

export default { apply };

function apply(rootView, channel) {
    const categoryConfig = GM_getValue('category', DefaultConfig.category);
    const articles = Parser.getArticles(rootView);

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

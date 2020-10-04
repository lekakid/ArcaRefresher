import DefaultConfig from '../core/DefaultConfig';
import { getContrastYIQ } from '../util/ColorManager';

export default { apply };

function apply(rootView, channel) {
    const categoryConfig = GM_getValue('category', DefaultConfig.category);
    const articles = rootView.querySelectorAll('a.vrow');

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

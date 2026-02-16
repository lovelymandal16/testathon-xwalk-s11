import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    let alt = (img.getAttribute('alt') || '').trim();

    const isPlaceholderAlt = !alt || /^image\d*$/i.test(alt);
    if (isPlaceholderAlt) {
      const li = img.closest('li');
      const cardBody = li?.querySelector('.cards-card-body');
      const fallback = cardBody?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 125) || '';
      alt = fallback || '';
    }
    const optimizedPic = createOptimizedPicture(img.src, alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}

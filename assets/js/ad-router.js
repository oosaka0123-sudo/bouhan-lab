export class AdRouter {
  constructor(registry) {
    this.ads = Array.isArray(registry?.ads) ? registry.ads : [];
  }

  eligible() {
    return this.ads.filter(ad => ad.approved === true && ad.active === true && ad.url);
  }

  select(context = []) {
    const tags = new Set(context);
    return this.eligible()
      .map(ad => ({
        ...ad,
        score: ad.priority + ad.category.reduce((n, tag) => n + (tags.has(tag) ? 20 : 0), 0)
      }))
      .sort((a, b) => b.score - a.score)[0] || null;
  }

  render(anchor, context = []) {
    if (!anchor) return;
    const ad = this.select(context);
    if (!ad) {
      anchor.hidden = true;
      return;
    }

    anchor.hidden = false;
    anchor.innerHTML = '';
    const label = document.createElement('span');
    label.textContent = 'PR';
    label.className = 'ad-label';

    const link = document.createElement('a');
    link.href = ad.url;
    link.rel = 'sponsored nofollow noopener';
    link.target = '_blank';
    link.textContent = ad.label;
    link.dataset.adId = ad.id;
    link.dataset.network = ad.network;

    anchor.append(label, link);
  }
}

export async function mountAffiliateSlots() {
  const slots = [...document.querySelectorAll('[data-affiliate-slot]')];
  if (!slots.length) return;

  try {
    const response = await fetch('data/ads.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`ad registry ${response.status}`);
    const router = new AdRouter(await response.json());
    slots.forEach(slot => {
      const context = (slot.dataset.context || '').split(',').map(v => v.trim()).filter(Boolean);
      router.render(slot, context);
    });
  } catch (error) {
    console.warn('[affiliate] registry unavailable', error);
    slots.forEach(slot => { slot.hidden = true; });
  }
}

// High-performance image preloader and asset cache optimizer
export function preloadProductAssets() {
  if (typeof window === 'undefined') return;

  const priorityImages = [
    '/aa1.webp',
    '/aaa2.webp',
    '/aa2.webp',
    '/aa3.webp',
    '/aa4.webp',
    '/aa5.webp',
    '/aa1_thumb.webp',
    '/aaa2_thumb.webp',
    '/aa2_thumb.webp',
    '/aa3_thumb.webp',
    '/aa4_thumb.webp',
    '/aa5_thumb.webp',
    '/allure_gold_1.webp',
    '/allure_gold_2.webp',
    '/allure_gold_3.webp',
    '/allure_gold_4.webp',
    '/allure_gold_5.webp',
    '/allure_gold_1_thumb.webp',
    '/allure_gold_2_thumb.webp',
    '/allure_gold_3_thumb.webp',
    '/allure_gold_4_thumb.webp',
    '/allure_gold_5_thumb.webp',
    '/allure_gold_hero.webp',
    '/allure_gold_earrings.webp',
    '/allure_gold_model.webp',
    '/allure_gold_detail.webp',
    '/allure_gold_box.webp',
    '/Cinematic.webp',
    '/Hero_website.webp',
    '/Hero_website_neklace.webp',
    '/neklace_producshot.webp',
    '/neklace_productshot_2.webp',
    '/combo5_user_1.webp',
    '/combo5_user_2.webp',
    '/combo5_user_3.webp',
    '/combo5_user_4.webp',
    '/combo5_user_1_thumb.webp',
    '/elegant_combo_1.webp',
    '/elegant_combo_2.webp',
    '/elegant_combo_3.webp',
    '/elegant_combo_4.webp',
    '/elegant_combo_5.webp',
    '/elegant_combo_1_thumb.webp',
    '/elegant_combo_2_thumb.webp',
    '/elegant_combo_3_thumb.webp',
    '/elegant_combo_4_thumb.webp',
    '/elegant_combo_5_thumb.webp',
    '/radhika_ambani_1.webp',
    '/radhika_ambani_2.webp',
    '/radhika_ambani_3.webp',
    '/radhika_ambani_4.webp',
    '/radhika_ambani_5.webp',
    '/radhika_ambani_1_thumb.webp',
    '/radhika_ambani_2_thumb.webp',
    '/radhika_ambani_3_thumb.webp',
    '/radhika_ambani_4_thumb.webp',
    '/radhika_ambani_5_thumb.webp',
    '/radhika_green_hero.webp',
    '/radhika_green_detail.webp',
    '/radhika_green_earrings.webp',
    '/radhika_green_back.webp',
    '/radhika_green_lifestyle.webp',
    '/radhika_green_hero_thumb.webp',
    '/radhika_green_detail_thumb.webp',
    '/radhika_green_earrings_thumb.webp',
    '/radhika_green_back_thumb.webp',
    '/radhika_green_lifestyle_thumb.webp',
    '/Cinematic_thumb.webp',
    '/Hero_website_neklace_thumb.webp',
    '/neklace_producshot_thumb.webp',
    '/neklace_productshot_2_thumb.webp',
    '/UGC_1_thumb.webp',
    '/UGC_2_thumb.webp',
    '/UGC_3_thumb.webp',
    '/UGC_thumb.webp',
  ];

  const preheat = () => {
    priorityImages.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  };

  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(preheat);
  } else {
    setTimeout(preheat, 150);
  }
}

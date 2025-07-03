export const getDeviceType = () => {
    if (navigator.userAgentData) {
      const brands = navigator.userAgentData.brands.map(b => b.brand.toLowerCase()).join(',');
      if (brands.includes('apple')) {
        if (window.screen.width <= 834 && 'ontouchstart' in window) {
          return 'ipad'; 
        }
      }
    }
  
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('iphone')) return 'iphone';
    if (ua.includes('ipad') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return 'ipad';
    }
  
    return 'other';
  }
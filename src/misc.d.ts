declare module '@sipec/vue3-tags-input';

declare module 'vue3-clipboard';

import GAuth from 'vue3-google-oauth2';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $gAuth: GAuth;
    }
  }
import { required } from '@vuelidate/validators';
import { courseNameUnique } from './validators';

export const courseValidation = {
  name: {
    required,
    unique: courseNameUnique,
    $autoDirty: true,
  },
};

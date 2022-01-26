<template>
  <div>
    <!-- RE-USE THE STUFF FROM COURSEEXERCIES VIEW (a few ideas, use props to
    conditionally hide certain search parameters for the reduced version, and
    don't put margins or the card borders by default. In the exercise picker,
    you can include this component with the reduced version and integrate it
    with the picker) - define a SearchFilters interface and use it here as the
    modelValue -->
    <h3>{{ $t('filter_results.title') }}</h3>

    <div class="overflow-y-hidden duration-300 ease-in-out">
      <!-- <chipset :options="tagsOptions" v-model="resultFilter.tags"></chipset> -->
      <chipset
        :options="exerciseTypeOptions"
        v-model="resultFilter.types"
      ></chipset>
      <chipset
        :options="exerciseStateOptions"
        v-model="resultFilter.states"
      ></chipset>
      <!-- <tag-input
            class="md:mt-1"
            v-model="resultFilter.tags"
            :placeholder="$t('filter_results.filter_by_tag')"
          ></tag-input> -->
      <div class="flex w-full hidden">
        <btn @btnClick="applyFilters()" class="mt-4 ml-auto">{{
          $t('filter_results.title')
        }}</btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getTranslatedString as _ } from '@/i18n'
// import { icons as exerciseTypesIcons } from '@/assets/exerciseTypesIcons'
// import { icons as exerciseStatesIcons } from '@/assets/exerciseStatesIcons'
// import {
//   Exercise,
//   ExerciseState,
//   ExerciseType,
//   getBlankExercise,
//   Tag
// } from '@/models'

import Btn from '@/components/ui/Btn.vue'
import Chipset from '@/components/ui/Chipset.vue'
import { ExerciseState, ExerciseType, Tag } from '@/models'
import { defineComponent } from '@vue/runtime-core'
import { icons as exerciseTypesIcons } from '@/assets/exerciseTypesIcons'
import { icons as exerciseStatesIcons } from '@/assets/exerciseStatesIcons'
export default defineComponent({
  name: 'ExerciseSearchFilters',
  components: {
    Chipset,
    Btn
  },
  data () {
    return {
      resultFilter: { types: [], states: [] }
    }
  },
  computed: {
    tags (): Tag[] {
      return [{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }]
    },
    // tagsOptions () {
    //   return this.tags.map(t => ({
    //     value: t.name,
    //     content: t.name
    //   }))
    // },
    exerciseTypeOptions () {
      return ((Object.keys(ExerciseType) as unknown[]) as ExerciseType[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: exerciseTypesIcons[key],
          value: key,
          content: _('exercise_types.' + key)
        }))
    },
    exerciseStateOptions () {
      return ((Object.keys(ExerciseState) as unknown[]) as ExerciseState[])
        .filter((key: string | number) => parseInt(key as string) == key) //(ExerciseType[key] as unknown) == 'number')
        .map(key => ({
          icons: exerciseStatesIcons[key],
          value: key,
          content: _('exercise_states.' + key),
          description: _('exercise_states_descriptions.' + key)
        }))
    }
  }
})
</script>

<style></style>

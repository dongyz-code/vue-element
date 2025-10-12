import type { PageData } from './types';
import { computed, defineComponent, h, ref } from 'vue';
import VPagination from './pagination.vue';
import { defaultPageData } from './types';

export function usePage(_?: PageData) {
  const pageData = ref({ ...defaultPageData, ..._ });

  const component = defineComponent({
    emits: ['update', 'update:current', 'update:size'],
    setup(_, { emit, slots }) {
      return () => h(VPagination, {
        'pageData': pageData.value,
        'onUpdate': (current: number, size: number) => {
          emit('update', current, size);
        },
        'onUpdate:current': (current: number) => {
          emit('update:current', current);
        },
        'onUpdate:size': (size: number) => {
          emit('update:size', size);
        },
        'slot': slots.default,
      });
    },
  });

  const pageRange = computed(() => {
    const { current, size } = pageData.value;
    return [
      (current - 1) * size,
      current * size,
    ];
  });

  return {
    pageData,
    pageRange,
    PageComponent: component,
  };
}

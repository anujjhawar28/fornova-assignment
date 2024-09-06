<template>
  <div>
    <label for="requestedFloor" class="block text-sm font-medium leading-6 text-gray-900">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      @input="($event) => $emit('update:modelValue', $event.target.value)"
      :type="type"
      :name="name"
      :id="name"
      autocomplete="off"
      class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 p-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6"
    />
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

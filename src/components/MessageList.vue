<template>
  <div class="q-pa-md row justify-center">
    <div v-for="message in messages" :key="message._id" style="width: 100%;">
      <q-chat-message
        :text="[message.content]"
        :sent="message.senderId === senderId"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    messages: {
      type: Array,
      default: () => ([])
    },
    senderId: {
      type: String,
      default: ''
    }
  }
}
</script>

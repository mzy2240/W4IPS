<template>
<v-dialog v-model="show" max-width="500px">
  <v-card>
    <v-card-actions>
      <v-btn color="primary" flat @click.stop="show=false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  props: ['visible'],
  computed: {
    show: {
      get () {
        return this.visible
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  }
}
</script>

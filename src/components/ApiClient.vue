<template>
    <div>{{ info }}</div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ApiClient',
    data() {
        return {
            info: null
        }
    },
    created() {
        axios
            .get('http://127.0.0.1:5000/Messages/message?type=14')
            .then(response => (this.info = response))
    }
}
</script>

<style scoped>
</style>

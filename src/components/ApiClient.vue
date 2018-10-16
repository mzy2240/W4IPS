<template>
    <div>{{ info }}</div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'ApiClient',
    props: {
        link: String,
        interval:{
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            info: null
        }
    },
    created() {
        if(this.interval == 0) {
            axios
            .get(this.link)
            .then(response => (this.info = response))
        } else {
            setInterval(() => {
                axios
                .get(this.link)
                .then(response => (this.info = response))
            }, this.interval)
        }
    }
}
</script>

<style scoped>
</style>

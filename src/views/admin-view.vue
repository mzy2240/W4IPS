<template>
    <!-- <ApiClient :interval=2000 link="http://104.254.244.143:8080/api/v3nodes/emqx@127.0.0.1/connections/"></ApiClient> -->
</template>

<style>
/* .container {
	max-width: 100vw;
	padding: 0px;
	margin: 5px;
} */
</style>

<script>
import ApiClient from '../components/ApiClient'

export default {
    name: 'admin',
    data(){
        return {}
    },
	components: {
        ApiClient
	}
};
</script>

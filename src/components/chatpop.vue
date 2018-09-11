<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Chat</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Topic" v-model.lazy="topic" required :rules="[rules.prohibited]"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Content" v-model.lazy="content"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="subscribe">Subscribe</v-btn>
          <v-btn color="blue darken-1" flat @click.native="send">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
    props: {
        visible: {
			type: Boolean,
			default: false
		}
    },
	data() {
        return {
            topic: "",
            content: "",
            rules: {
                prohibited: value => value != "data" && value != "user" && value != "note" || 'Cannot use the reserved topic'
            }
        };
    },
    computed:{
        show: {
			get() {
				return this.visible;
			},
			set(value) {
				if (!value) {
					this.display = [];
					this.childshow = false;
					this.$emit('close');
				}
			}
		}
    },
    methods: {
        send() {
            this.$store.commit('setnewpublish', [this.topic, this.content])
            // this.show = false;
        },
        subscribe() {
            this.$store.commit('setnewsubscribe', this.topic)
        }
    }
};
</script>

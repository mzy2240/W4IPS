<template>
  <v-card @mouseover="disable = false" @mouseout="disable = true">
    <v-card-text class="pa-0 ma-0">
      <v-container class="pa-0 ma-0">
        <div class="layout row ma-0">
          <div class="sm6 xs6 flex">
            <div class="layout column ma-0 justify-center align-center">
              <v-icon size="24px" :color="color">{{icon}}</v-icon>
            </div>
          </div>
          <v-flex sm6 xs6 white--text :class="color">
              <v-layout row wrap>
                  <v-flex sm12 xs12>
                      <div class="text-sm-center pt-3">
                        <div class="caption">{{ title }}</div>
                        <span class="headline">{{ subTitle }}</span>
                    </div>
                  </v-flex>
                  <v-flex sm12 xs12 class="pa-0 ma-0">
                     <v-layout align-end justify-end>
                         <v-btn icon depressed :disabled='disable'>
                            <v-icon dark>mdi-chart-line-variant</v-icon>
                    </v-btn>
                     </v-layout>
                  </v-flex>
              </v-layout>
          </v-flex>
          <!-- <div class="sm6 xs6 flex text-sm-center py-3 white--text" :class="color">
            <div class="caption">{{ title }}</div>
            <span class="headline">{{ subTitle }}</span>
            <div class="text-sm-right py-0"> -->
                <!-- <v-spacer></v-spacer> -->
                <!-- <v-btn icon>
                    <v-icon dark>mdi-chart-line-variant</v-icon>
                </v-btn>
            </div>
          </div> -->
        </div>
      </v-container>
    </v-card-text>
  </v-card>    
</template>

<script>
export default {
	props: {
		icon: String,
		title: String,
		subTitle: [String, Number],
		color: String
    },
    data() {
        return {
            disable: true
        }
    }
};
</script>
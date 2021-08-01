<template>
  <div>
    <vue-json-pretty :path="res" :data="data"> </vue-json-pretty>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  components: {
    VueJsonPretty
  },
  data(){
      return {
          res:'test',
          data:{}
      }
  }
};
</script>
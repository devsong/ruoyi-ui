<template>
  <div>
    <el-dialog title="明细" :visible.sync="open" width="700px" height="500px" append-to-body>
      <json-viewer v-model="detailMsg" :expand-depth="5" copyable boxed sort></json-viewer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer'
export default {
  name: 'DetailDialog',
  components:{
    JsonViewer
  },
  data() {
    return {
      open: false,
      detailMsg: {}
    }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.detailMsg = {};
    },
    openDialog(msg) {
      this.open = true;
      this.detailMsg = msg;
    }
  }
}
</script>
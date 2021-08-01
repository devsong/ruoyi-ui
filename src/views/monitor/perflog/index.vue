<template>
  <div class="app-container">
    <perf-search ref="searchForm"/>

    <el-form ref="formParams" :model="formParams" :inline="true" label-width="68px">
      <el-form-item label="日志ID" prop="id">
        <el-input
          v-model="formParams.id"
          placeholder="请输入日志ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    </el-form>

    <el-row class="btn-group">
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      class="cell-limit"
      :data="logList"
      :cell-class-name="tableCellClassName"
      height="500"
      @cell-dblclick="handleCellDbClick"
    >
      <el-table-column fixed="left" label="日志ID" align="center" width="180" prop="id" />
      <el-table-column label="产品线" align="center" prop="product" />
      <el-table-column label="服务分组" align="center" prop="groupName" />
      <el-table-column label="应用名" align="center" width="120" prop="app" />
      <el-table-column
        label="类名"
        align="center"
        width="180"
        prop="clazz"
        title="clazz"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="方法名" align="center" width="80" prop="method" />
      <el-table-column label="操作IP" align="center" width="120" prop="operatorIp" />
      <el-table-column label="执行时间" align="center" prop="executeTimespan" />
      <el-table-column
        label="入参"
        align="center"
        prop="paramsIn"
        title="paramsIn"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="出参"
        align="center"
        prop="paramsOut"
        title="paramsOut"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="状态码" align="center" prop="code" />
      <el-table-column label="异常信息" align="center" prop="errmsg" />
      <el-table-column fixed="right" label="创建时间" align="center" prop="createTime" width="180" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="formParams.pageNum"
      :limit.sync="formParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="明细" :visible.sync="open" width="700px" height="500px" append-to-body>
      <vue-json-pretty ref="popDialogMsg" ></vue-json-pretty>
      <!-- <pre v-show="!isJsonMsg">{{detailMsg}}</pre> -->
      <!--<el-form ref="form" :model="form" :rules="rules" label-width="80px">{{ detailMsg }}</el-form> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scope>
.cell-limit tr td .cell {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /*可以显示的行数，超出部分用...表示 */
  -webkit-box-orient: vertical;
}

.btn-group{
  padding:0 0 10px 0px;
}
</style>

<script>
import VueJsonPretty from '@/components/VueJsonPretty'
import { listLog, getMetaLog } from '@/api/monitor/perflog';
import PerfSearch from './PerfSearch.vue'
export default {
  name: 'Sysperflog',
  components:{
    PerfSearch,
    VueJsonPretty
  },
  data() {
     return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 系统接口日志表格数据
      logList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {

      },
      formParams: {
        id:undefined,
        pageNum: 1,
        pageSize: 10
      },
      // 明细日志
      detailMsg: '',
      // 表单校验
      rules: {

      }
    };
  },
  computed: {
  },
  created() {
  },
  methods: {
    /** 查询系统接口日志列表 */
    getList() {
      this.loading = true;
      let mergeParams = Object.assign(this.formParams,this.$refs.searchForm.queryParams);
      listLog(this.addDateRange(mergeParams, this.$refs.searchForm.dateRange)).then(response => {
        this.logList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.detailMsg = '';
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.formParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('formParams')
      this.$refs.searchForm.resetQueryForm('queryForm');
    },

    //
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex;
      column.index = columnIndex;
    },

    handleCellDbClick(row, column, cell, event) {
      // 4  8 9 11列的数据较长,需要弹出对话框显示
      const index = column.index;
      if (index === 4 || index === 8 || index === 9 || index === 11) {
        this.open = true;
        let msg = cell.innerText;
        try {
          msg = JSON.parse(msg);
        } catch (error) {
          // this.detailMsg = msg;
          msg = {'class':msg};
        }
        this.$refs.popDialogMsg.data = msg;
      }
    },

    // ip
    // handleMethodChange() {
    //   const query = {
    //     level: 6,
    //     product: this.queryParams.product,
    //     group: this.queryParams.group,
    //     app: this.queryParams.app,
    //     method: this.queryParams.method
    //   };
    //   getMetaLog(query).then(response => {
    //     this.option.operatorIps = response.data;
    //     this.option.operatorIps.push('*');
    //   });
    // },

  }
};
</script>

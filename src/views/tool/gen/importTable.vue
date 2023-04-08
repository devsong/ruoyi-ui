<template>
  <!-- 导入表 -->
  <el-dialog title="导入表" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="数据源" prop="tableDbid">
        <el-select filterable v-model="queryParams.tableDbid" placeholder="请选择" @change="dbChange">
          <el-option
            v-for="item in jdbcUrl"
            :key="item.id"
            :label="item.dbschema"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="数据库" prop="tableSchema">
        <el-select filterable v-model="queryParams.tableSchema" placeholder="请选择">
          <el-option
            v-for="item in schemas"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入表描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table
        @row-click="clickRow"
        ref="table"
        :data="dbTableList"
        @selection-change="handleSelectionChange"
        height="260px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tableName" label="表名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="tableComment" label="表描述" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleImportTable">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listDbTable, importTable, listSchemas } from "@/api/tool/gen";
import { listDbconfig } from "@/api/tool/dbconfig";

export default {
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      tables: [],
      // 总条数
      total: 0,
      // 数据源列表
      jdbcUrl:[],
      // 数据库列表
      schemas: [],
      // 表数据
      dbTableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tableDbid:undefined,
        tableSchema:undefined,
        tableName: undefined,
        tableComment: undefined
      }
    };
  },
  mounted(){
    this.getJdbcUrl();
  },
  methods: {
    // 显示弹框
    show() {
      this.getJdbcUrl();
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.tables = selection.map(item => item.tableName);
    },
    // 查询表数据
    getList() {
      if(this.queryParams.tableDbid == null || this.queryParams.tableSchema == null){
        return;
      }
      listDbTable(this.queryParams).then(res => {
        if (res.code === 200) {
          this.dbTableList = res.rows;
          this.total = res.total;
        }
      });
    },
    // 获取数据源列表
    getJdbcUrl(){
      listDbconfig().then(res=>{
        if(res.code == 200){
          this.jdbcUrl = res.rows;
          this.queryParams.tableDbid = res.rows[0].tableDbid;
          this.getSchemas();
        }else{
          this.msgError(res.msg);
        }
      });
    },
    // 获取数据库列表
    dbChange(){
      this.getSchemas();
    },
    getSchemas(){
      if(this.queryParams.tableDbid == null){
        return;
      }
      listSchemas(this.queryParams.tableDbid).then(res => {
        if (res.code == 200) {
          this.schemas = res.data;
        }else{
          this.msgError(res.msg);
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导入按钮操作 */
    handleImportTable() {
      importTable({dbId:this.queryParams.tableDbid,schema:this.queryParams.tableSchema, tables: this.tables.join(",") }).then(res => {
        this.msgSuccess(res.msg);
        if (res.code === 200) {
          this.visible = false;
          this.$emit("ok");
        }
      });
    }
  }
};
</script>

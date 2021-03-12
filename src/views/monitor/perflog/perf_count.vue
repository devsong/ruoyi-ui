<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="产品线" prop="product">
        <el-select
          filterable
          v-model="queryParams.product"
          placeholder="请选择"
          @change="handleProductChange"
        >
          <el-option v-for="item in option.products" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="分组" prop="group">
        <el-select
          filterable
          v-model="queryParams.group"
          placeholder="请选择"
          @change="handleGroupChange"
        >
          <el-option v-for="item in option.groups" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="应用" prop="app">
        <el-select filterable v-model="queryParams.app" placeholder="请选择" @change="handleAppChange">
          <el-option v-for="item in option.apps" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="类名" prop="clazz">
        <el-select
          filterable
          v-model="queryParams.clazz"
          placeholder="请选择"
          @change="handleClazzChange"
        >
          <el-option v-for="item in option.clazzs" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="方法名" prop="method">
        <el-select
          filterable
          v-model="queryParams.method"
          placeholder="请选择"
          @change="handleMethodChange"
        >
          <el-option v-for="item in option.methods" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="服务IP" prop="operateIp">
        <el-select filterable v-model="queryParams.operateIp" placeholder="请选择">
          <el-option v-for="item in option.operatorIps" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="时间" prop="createTime">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 320px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import {getMetaLog ,getMetaLogCount} from '@/api/monitor/perflog';

export default {
  name: 'SysperfLogCount',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 下拉列表数据
      option: {
        // 产品线
        products: [],
        // 分组
        groups: [],
        // 应用
        apps: [],
        // 类名
        clazzs: [],
        // 方法名
        methods: [],
        // 服务器IP
        operatorIps: []
      },
      // 时间筛选
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        product: undefined,
        group: undefined,
        app: undefined,
        clazz: undefined,
        method: undefined,
        operatorIps: undefined,
        level: undefined
      }
    };
  },
  created() {
    this.getProducts();
    this.getList();
  },
  methods: {
    /** 查询系统接口日志列表 */
    getList() {
      this.loading = true;
      getMetaLogCount(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.loading = false;
      });
    },
    
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        metaId: undefined,
        executeTimespan: undefined,
        paramsIn: undefined,
        paramsOut: undefined,
        code: undefined,
        errmsg: undefined,
        createTime: undefined,
        timestamp: undefined
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },

    // 获取产品线
    getProducts() {
      const query = {
        level: 1
      };
      getMetaLog(query).then(response => {
        this.option.products = response.data;
        this.option.products.push('*');
      });
    },

    // 产品线
    handleProductChange() {
      const query = {
        level: 2,
        product: this.queryParams.product
      };
      getMetaLog(query).then(response => {
        this.option.groups = response.data;
        this.option.groups.push('*');
      });
    },

    // 服务组
    handleGroupChange() {
      const query = {
        level: 3,
        product: this.queryParams.product,
        group: this.queryParams.group
      };
      getMetaLog(query).then(response => {
        this.option.apps = response.data;
        this.option.apps.push('*');
      });
    },

    // 应用
    handleAppChange() {
      const query = {
        level: 4,
        product: this.queryParams.product,
        group: this.queryParams.group,
        app: this.queryParams.app
      };
      getMetaLog(query).then(response => {
        this.option.clazzs = response.data;
        this.option.clazzs.push('*');
      });
    },

    // 方法
    handleClazzChange() {
      this.queryParams.level = 5;
      const query = {
        level: 5,
        product: this.queryParams.product,
        group: this.queryParams.group,
        app: this.queryParams.app,
        clazz: this.queryParams.clazz
      };
      getMetaLog(query).then(response => {
        this.option.methods = response.data;
        this.option.methods.push('*');
      });
    },

    // ip
    handleMethodChange() {
      const query = {
        level: 6,
        product: this.queryParams.product,
        group: this.queryParams.group,
        app: this.queryParams.app,
        method: this.queryParams.method
      };
      getMetaLog(query).then(response => {
        this.option.operatorIps = response.data;
        this.option.operatorIps.push('*');
      });
    },



  }
};
</script>

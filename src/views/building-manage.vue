<template>
  <div class="page-container">
    <section class="flex offset-fotm-item">
      <div>
        <el-form @submit.native.prevent="search" inline>
          <el-form-item label="楼栋号">
            <el-input class="text-center"
                      placeholder="例如：8"
                      prefix-icon="el-icon-office-building"
                      size="medium"
                      style="width: 180px"
                      v-model="searchForm.building_num">
              <template #append><p>号楼</p></template>
            </el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input clearable
                      placeholder="搜索描述内容"
                      prefix-icon="el-icon-tickets"
                      size="medium"
                      style="width: 200px"
                      v-model="searchForm.desc"/>
          </el-form-item>
          <el-form-item>
            <el-button native-type="submit" size="medium" type="primary">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="margin-left-auto">
        <transition name="el-fade-in">
          <el-button @click="deleteManyBuildings" size="medium" type="danger" v-if="selectedBuildings.length">批量删除楼栋
          </el-button>
        </transition>
        <el-button @click="showAddBuildingDialog" size="medium" type="primary">新增楼栋</el-button>
      </div>
    </section>

    <!-- 楼栋表格 -->
    <el-table :data="buildingData"
              :default-sort="{prop: 'building_num', order: 'ascending'}"
              border
              class="margin-top-20"
              stripe>
      <el-table-column align="center" label="楼栋号" prop="building_num" sortable/>
      <el-table-column align="center" label="楼层数" prop="floor" sortable/>
      <el-table-column align="center" label="描述" prop="desc" sortable>
        <template #default="scope">{{scope.row.desc || '无'}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-tooltip content="编辑信息">
            <el-button @click="editDetail(scope.row)" circle icon="el-icon-edit font-size-16" plain size="mini"/>
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button @click="deleteBuilding(scope.row)"
                       circle
                       icon="el-icon-delete font-size-16"
                       plain
                       size="mini"
                       type="danger"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="paging.current"
      :total="paging.total"
      @current-change="curPageChange"
      background
      class="margin-top-20"
      layout="total, prev, pager, next"
      style="text-align: right">
    </el-pagination>

    <!-- 添加楼栋 -->
    <add-buidling :visible.sync="isShowAddBuilding" @update="getData"/>
    <!-- 编辑楼栋 -->
    <edit-building :cur-building="curBuilding" :visible.sync="isShowEditBuilding" @update="getData"/>
  </div>
</template>

<script>
  import AddBuidling from "@/components/building/add-buidling";
  import request from "@/api";
  import _ from "lodash";
  import EditBuilding from "@/components/building/edit-building";

  export default {
    name: "building-manage",
    components: {EditBuilding, AddBuidling},
    data() {
      return {
        searchForm: {
          building_num: "",
          desc: ""
        },
        paging: {
          current: 1,
          total: 1,
          pageCount: 1
        },
        buildingData: [],
        selectedBuildings: [],
        isShowAddBuilding: false,
        isShowEditBuilding: false,
        curBuilding: {}
      }
    },
    methods: {
      search() {
        this.paging.current = 1;
        this.getData();
      },
      getData() {
        const form = {...this.searchForm};
        form.page = this.paging.current;
        request.post('/api/building/search', form).then(res => {
          this.buildingData = res.data.data.list;
          this.paging = Object.assign(this.paging, res.data.data.paging);
          if (this.paging.current > this.paging.pageCount) {
            this.paging.current = this.paging.pageCount;
            this.getData();
          }
        })
      },
      curPageChange(page) {
        this.paging.current = page;
        this.getData();
      },
      deleteManyBuildings() {

      },
      showAddBuildingDialog() {
        this.isShowAddBuilding = true;
      },
      editDetail(row) {
        this.curBuilding = _.cloneDeep(row);
        this.isShowEditBuilding = true;
      },
      deleteBuilding(row) {
        this.$confirm('此操作将永久删除该楼栋且无法恢复，是否继续？', '提示', {
          type: "warning"
        }).then(() => {
          this.request.post('/api/building/removeOne', {id: row._id}).then(res => {
            if (!res.data.errcode) {
              this.$alert('删除成功！', '提示', {type: "success"});
              this.getData();
            } else {
              this.$alert(res.data.errors.join(','), '错误', {type: "error"});
            }
          })
        })
      },
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-form-item__content .el-input-group {
    vertical-align: baseline;
  }

  /deep/ .el-input__icon {
    font-size: 17px;
  }
</style>

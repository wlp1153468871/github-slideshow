<template>
  <div id="servicedetail">
    <div class="layout-content-header detail-header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="header-text">
        <el-breadcrumb-item 
          :to="{ path: '/console/service' }" 
          class="header-text"
        >
          服务
        </el-breadcrumb-item>
        <el-breadcrumb-item>服务详情(Nginx)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-title">
      <span>
        <svg class="icon icon-size">
          <use :xlink:href="`#color-icon_microsoft`"></use>
        </svg>
      </span>
      <div class="title-name">nginx-example-1</div>
      <div class="title-desc">
        状态:
        <div class="title-desc-name">
          <svg class="icon" style="color: #25D473">
            <use :xlink:href="`#icon_status-dot-small`"></use>
          </svg>
          使用中
        </div>
        <div class="title1">类型:</div>
        <div class="title-desc-name">Operator</div>
        <div class="title1">创建于:</div>
        <div class="title-desc-name">2020-05-26 10:23:34</div>
      </div>
      <span class="dao-btn-group select-btn">
        <dao-dropdown
          trigger="click"
          :append-to-body="true"
          placement="bottom-start"
        >
          <button class="dao-btn has-icons" style="width: 98px">
            <span class="text">更多操作</span>
            <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
          </button>
          <dao-dropdown-menu slot="list" style="min-width: 120px;">
            <dao-dropdown-item style="margin-left: 10px">
              <span>使用表单更新</span>
            </dao-dropdown-item>
            <dao-dropdown-item style="margin-left: 10px">
              <span>使用YAML更新</span>
            </dao-dropdown-item>
            <dao-dropdown-item style="margin-left: 10px">
              <span style="color: red;">删除</span>
            </dao-dropdown-item>
          </dao-dropdown-menu>
        </dao-dropdown>
      </span>
    </div>
    <el-tabs v-model="activeName" style="position:relative;">
      <el-tab-pane label="基本属性" name="first">
        <div class="container1">
          <div class="c-title">基本属性</div>
          <div class="info-title1-layout">
            <div class="info-title">租户</div>
            <div class="info-desc">http://harbor.ats</div>
          </div>
          <div class="info-title1-layout" style="float: right;">
            <div class="info-title">项目组</div>
            <div class="info-desc">admin</div>
          </div>
          <div class="info-title2-layout">
            <div class="info-title">创建者</div>
            <div class="info-desc">admin</div>
          </div>
          <div class="info-title2-layout"  style="float: right;">
            <div class="info-title">可用区</div>
            <div class="info-desc">上海-dev</div>
          </div>
          <div class="info-title2-layout">
            <div class="info-title">Chart 版本</div>
            <div class="info-desc">1.9.1</div>
          </div>
        </div>
        <div style="height: 300px; float:right; overflow: hidden; width: 300px;">
          <!-- <el-steps direction="vertical">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>
          </el-steps> -->
          <daox-info-table title="操作记录">
            <template slot="operation">
              <a href="javascript:void(0)" @click="toDetail">
                查看更多 >
              </a>
            </template>
            <template slot="content">
              <event-list :jobs="jobs"></event-list>
            </template>
          </daox-info-table>
        </div>
        <div class="container1" style="margin-top: 20px;">
          <div class="c-title">参数</div>
          <el-table
            style="width: 100%;padding: 20px;"
            :data="tableDate"
          >
            <el-table-column label="key" prop="key" width="400"></el-table-column>
            <el-table-column label="value" prop="value" width="400"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="second">
        <div class="Operation">
          <div style="padding: 20px 20px 0 23px;">
            <div style="position: relative; height: 78px;">
              <div class="panel">
                <div class="circle"></div>
                <div class="line"></div>
              </div>
              <div class="explain">
                <div class="title">更新实例</div>
                <div class="date">2020-7-29 10:23</div>
              </div>
            </div>
          </div>
          <div style="padding: 20px 20px 0 23px;">
            <div style="position: relative; height: 78px;">
              <div class="panel">
                <div class="top-line"></div>
                <div class="circle"></div>
                <div class="line"></div>
              </div>
              <div class="explain">
                <div class="title">更新实例</div>
                <div class="date">2020-7-29 10:23</div>
              </div>
            </div>
          </div>
          <div style="padding: 20px 20px 0 23px;">
            <div style="position: relative; height: 78px;">
              <div class="panel">
                <div class="top-line"></div>
                <div class="circle"></div>
                <div class="line"></div>
              </div>
              <div class="explain">
                <div class="title">更新实例</div>
                <div class="date">2020-7-29 10:23</div>
              </div>
            </div>
          </div>
          <div style="padding: 20px 20px 0 23px;">
            <div style="position: relative; height: 78px;">
              <div class="panel">
                <div class="top-line"></div>
                <div class="circle"></div>
                <div class="line"></div>
              </div>
              <div class="explain">
                <div class="title">更新实例</div>
                <div class="date">2020-7-29 10:23</div>
              </div>
            </div>
          </div>
          <div style="padding: 20px 20px 0 23px;">
            <div style="position: relative; height: 78px;">
              <div class="panel">
                <div class="top-line"></div>
                <div class="circle"></div>
                <div class="line"></div>
              </div>
              <div class="explain">
                <div class="title">更新实例</div>
                <div class="date">2020-7-29 10:23</div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Deployment" name="thrid">
        <dao-input
          search
          placeholder="搜索">
        </dao-input>
        <span style="float: right;">
          <el-button size="mini" style="margin-left: 10px;">
            <span>
              <svg class="icon">
                <use :xlink:href="`#icon_cw`"></use>
              </svg>
            </span>
          </el-button>
        </span>
        <div style="margin-top: 20px;">
          <el-table
            style="width: 100%;"
            :data="tableData"
          >
            <el-table-column label="资源名" prop="resourceName" width="400"></el-table-column>
            <el-table-column label="类型" prop="type"></el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="创建时间" prop="date"></el-table-column>
          </el-table>
          <div class="footer">
            <div class="page">共 4 项</div>
            <span class="dao-btn-group" style="padding: 6px 10px 0 0; float: right;">
              <dao-dropdown
                trigger="click"
                :append-to-body="true"
                placement="bottom-start"
              >
                <button class="dao-btn has-icons" style="width: 92px;height: 28px;">
                  <span class="text">10项/页</span>
                  <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
                </button>
                <dao-dropdown-menu slot="list" style="min-width: 120px;">
                  <dao-dropdown-item style="margin-left: 10px">
                    <span>15项/页</span>
                  </dao-dropdown-item>
                  <dao-dropdown-item style="margin-left: 10px">
                    <span>20项/页</span>
                  </dao-dropdown-item>
                  <dao-dropdown-item style="margin-left: 10px">
                    <span>25项/页</span>
                  </dao-dropdown-item>
                </dao-dropdown-menu>
              </dao-dropdown>
            </span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Service" name="fouth">Service</el-tab-pane>
      <el-tab-pane label="Ingress" name="fifth">Ingress</el-tab-pane>
      <el-tab-pane label="Pod" name="sixth">Pod</el-tab-pane>
      <el-tab-pane label="Config Map" name="seventh">Config Map</el-tab-pane>
      <el-tab-pane label="PVC" name="eighth">PVC</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./example.js"></script>

<style lang="scss" src="./example.scss"></style>

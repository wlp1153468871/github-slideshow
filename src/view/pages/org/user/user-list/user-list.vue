<template>
  <div class="container">
    <div class="row">
      <org-user-list
        :canView="$can('organization.user.get')"
        :canDelete="$can('organization.user.create')"
        :canCreat="$can('organization.user.create')"
        :canUpdate="$can('organization.user.update')"
        :org-id="org.id"
      >
      </org-user-list>
    </div>
  </div>
</template>

<script src="./user-list.js"></script>

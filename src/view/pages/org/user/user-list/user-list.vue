<template>
  <div class="container">
    <div class="row">
      <org-user-list
        :canView="$can('organization.user.get', 'organization.user')"
        :canDelete="$can('organization.user.create', 'organization.user')"
        :canCreat="$can('organization.user.create', 'organization.user')"
        :canUpdate="$can('organization.user.update', 'organization.user')"
        :org-id="org.id"
      >
      </org-user-list>
    </div>
  </div>
</template>

<script src="./user-list.js"></script>

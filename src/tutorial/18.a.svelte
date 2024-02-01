<script lang="ts">
  let user = {
    firstname: 'Ada',
    lastname: 'Lovelace',
  }
</script>

<input type="text" bind:value={user.firstname} />
<input type="text" bind:value={user.lastname} />

<!-- {(console.log(user), '')} -->

<!-- {@debug user} -->

<h1>Hello {user.firstname}</h1>

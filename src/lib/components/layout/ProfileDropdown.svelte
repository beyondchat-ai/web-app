<script lang="ts">
    const { user } = $props();
</script>


{#if user}
    <p>{user.id}</p>
{:else}
     <p>Not logged in</p>
{/if}